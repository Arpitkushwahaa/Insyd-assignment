import { Response } from 'express';
import SKU from '../models/SKU';
import StockMovement from '../models/StockMovement';
import { AuthRequest } from '../middleware/auth';

export const getDashboardInsights = async (req: AuthRequest, res: Response) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));

    // Get slow-moving SKUs (no outward movement in last X days)
    const slowMovingSKUs = await SKU.aggregate([
      { $match: { isActive: true, currentStock: { $gt: 0 } } },
      {
        $lookup: {
          from: 'stockmovements',
          let: { skuId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$sku', '$$skuId'] },
                movementType: 'outward',
                createdAt: { $gte: startDate },
              },
            },
          ],
          as: 'recentSales',
        },
      },
      { $match: { 'recentSales.0': { $exists: false } } },
      {
        $project: {
          skuCode: 1,
          name: 1,
          category: 1,
          currentStock: 1,
          costPrice: 1,
          lockedValue: { $multiply: ['$currentStock', '$costPrice'] },
        },
      },
      { $sort: { lockedValue: -1 } },
      { $limit: 10 },
    ]);

    // Get overstocked items
    const overstockedSKUs = await SKU.find({
      isActive: true,
      $expr: { $gt: ['$currentStock', { $multiply: ['$maxStockLevel', 1.2] }] },
    })
      .select('skuCode name category currentStock maxStockLevel costPrice')
      .limit(10)
      .lean();

    // Get low stock alerts
    const lowStockSKUs = await SKU.find({
      isActive: true,
      $expr: { $lte: ['$currentStock', '$minReorderQuantity'] },
    })
      .select('skuCode name category currentStock minReorderQuantity supplier')
      .limit(20)
      .lean();

    // Get high-damage SKUs
    const highDamageSKUs = await StockMovement.aggregate([
      {
        $match: {
          movementType: { $in: ['damage', 'loss'] },
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: '$sku',
          skuCode: { $first: '$skuCode' },
          skuName: { $first: '$skuName' },
          totalDamage: { $sum: '$quantity' },
          totalValue: { $sum: '$totalValue' },
        },
      },
      { $sort: { totalValue: -1 } },
      { $limit: 10 },
    ]);

    // Calculate suggested reorders
    const reorderSuggestions = await SKU.aggregate([
      {
        $match: {
          isActive: true,
          $expr: { $lte: ['$currentStock', '$minReorderQuantity'] },
        },
      },
      {
        $lookup: {
          from: 'stockmovements',
          let: { skuId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$sku', '$$skuId'] },
                movementType: 'outward',
                createdAt: { $gte: startDate },
              },
            },
            {
              $group: {
                _id: null,
                avgDailySales: { $avg: '$quantity' },
              },
            },
          ],
          as: 'salesData',
        },
      },
      {
        $project: {
          skuCode: 1,
          name: 1,
          category: 1,
          currentStock: 1,
          minReorderQuantity: 1,
          supplier: 1,
          avgDailySales: {
            $ifNull: [{ $arrayElemAt: ['$salesData.avgDailySales', 0] }, 0],
          },
          suggestedReorder: {
            $max: [
              '$minReorderQuantity',
              {
                $multiply: [
                  { $ifNull: [{ $arrayElemAt: ['$salesData.avgDailySales', 0] }, 1] },
                  30,
                ],
              },
            ],
          },
        },
      },
      { $sort: { suggestedReorder: -1 } },
      { $limit: 15 },
    ]);

    // Profit leakage indicators
    const profitLeakage = await StockMovement.aggregate([
      {
        $match: {
          movementType: { $in: ['damage', 'loss'] },
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          totalLoss: { $sum: '$totalValue' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top performing SKUs
    const topPerformers = await StockMovement.aggregate([
      {
        $match: {
          movementType: 'outward',
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: '$sku',
          skuCode: { $first: '$skuCode' },
          skuName: { $first: '$skuName' },
          totalSold: { $sum: '$quantity' },
          totalRevenue: { $sum: '$totalValue' },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      slowMovingSKUs,
      overstockedSKUs,
      lowStockSKUs,
      highDamageSKUs,
      reorderSuggestions,
      profitLeakage,
      topPerformers,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getReports = async (req: AuthRequest, res: Response) => {
  try {
    const { reportType, startDate, endDate } = req.query;

    const dateFilter: any = {};
    if (startDate) dateFilter.$gte = new Date(startDate as string);
    if (endDate) dateFilter.$lte = new Date(endDate as string);

    let report: any = {};

    switch (reportType) {
      case 'inventory-valuation':
        report = await SKU.aggregate([
          { $match: { isActive: true } },
          {
            $group: {
              _id: '$category',
              totalSKUs: { $sum: 1 },
              totalStock: { $sum: '$currentStock' },
              costValue: { $sum: { $multiply: ['$currentStock', '$costPrice'] } },
              sellingValue: {
                $sum: { $multiply: ['$currentStock', '$sellingPrice'] },
              },
            },
          },
          {
            $project: {
              category: '$_id',
              totalSKUs: 1,
              totalStock: 1,
              costValue: 1,
              sellingValue: 1,
              potentialProfit: { $subtract: ['$sellingValue', '$costValue'] },
            },
          },
        ]);
        break;

      case 'stock-movement-summary':
        report = await StockMovement.aggregate([
          ...(Object.keys(dateFilter).length > 0
            ? [{ $match: { createdAt: dateFilter } }]
            : []),
          {
            $group: {
              _id: {
                type: '$movementType',
                date: {
                  $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                },
              },
              count: { $sum: 1 },
              totalQuantity: { $sum: '$quantity' },
              totalValue: { $sum: '$totalValue' },
            },
          },
          { $sort: { '_id.date': 1, '_id.type': 1 } },
        ]);
        break;

      case 'abc-analysis':
        const outwardMovements = await StockMovement.aggregate([
          {
            $match: {
              movementType: 'outward',
              ...(Object.keys(dateFilter).length > 0 && { createdAt: dateFilter }),
            },
          },
          {
            $group: {
              _id: '$sku',
              skuCode: { $first: '$skuCode' },
              skuName: { $first: '$skuName' },
              totalRevenue: { $sum: '$totalValue' },
            },
          },
          { $sort: { totalRevenue: -1 } },
        ]);

        const totalRevenue = outwardMovements.reduce(
          (sum, item) => sum + item.totalRevenue,
          0
        );
        let cumulative = 0;
        report = outwardMovements.map((item) => {
          cumulative += item.totalRevenue;
          const cumulativePercentage = (cumulative / totalRevenue) * 100;
          let classification = 'C';
          if (cumulativePercentage <= 70) classification = 'A';
          else if (cumulativePercentage <= 90) classification = 'B';

          return {
            ...item,
            revenuePercentage: ((item.totalRevenue / totalRevenue) * 100).toFixed(2),
            cumulativePercentage: cumulativePercentage.toFixed(2),
            classification,
          };
        });
        break;

      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }

    res.json({ report });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
