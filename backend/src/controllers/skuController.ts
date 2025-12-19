import { Response } from 'express';
import SKU from '../models/SKU';
import StockMovement from '../models/StockMovement';
import AuditLog from '../models/AuditLog';
import { AuthRequest } from '../middleware/auth';

export const getAllSKUs = async (req: AuthRequest, res: Response) => {
  try {
    const {
      category,
      search,
      lowStock,
      page = 1,
      limit = 50,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const query: any = {};

    if (category) query.category = category;
    if (search) {
      query.$or = [
        { skuCode: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { supplier: { $regex: search, $options: 'i' } },
      ];
    }
    if (lowStock === 'true') {
      query.$expr = { $lte: ['$currentStock', '$minReorderQuantity'] };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const sort: any = { [sortBy as string]: sortOrder === 'asc' ? 1 : -1 };

    const [skus, total] = await Promise.all([
      SKU.find(query).sort(sort).skip(skip).limit(Number(limit)).lean(),
      SKU.countDocuments(query),
    ]);

    res.json({
      skus,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSKUById = async (req: AuthRequest, res: Response) => {
  try {
    const sku = await SKU.findById(req.params.id);
    if (!sku) {
      return res.status(404).json({ message: 'SKU not found' });
    }

    // Get recent stock movements
    const recentMovements = await StockMovement.find({ sku: sku._id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ sku, recentMovements });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createSKU = async (req: AuthRequest, res: Response) => {
  try {
    const skuData = req.body;

    const sku = await SKU.create(skuData);

    // Create audit log
    await AuditLog.create({
      action: 'SKU Created',
      entityType: 'sku',
      entityId: sku._id,
      performedBy: req.user!.id,
      performedByName: req.user!.name,
      performedByRole: req.user!.role,
      changes: {
        name: sku.name,
        skuCode: sku.skuCode,
        category: sku.category,
        currentStock: sku.currentStock,
      },
    });

    res.status(201).json({
      message: 'SKU created successfully',
      sku,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSKU = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const oldSKU = await SKU.findById(id);
    if (!oldSKU) {
      return res.status(404).json({ message: 'SKU not found' });
    }

    // Don't allow direct stock updates through this endpoint
    delete updates.currentStock;

    const sku = await SKU.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    // Create audit log
    await AuditLog.create({
      action: 'SKU Updated',
      entityType: 'sku',
      entityId: sku!._id,
      performedBy: req.user!.id,
      performedByName: req.user!.name,
      performedByRole: req.user!.role,
      changes: updates,
    });

    res.json({
      message: 'SKU updated successfully',
      sku,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSKU = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const sku = await SKU.findById(id);
    if (!sku) {
      return res.status(404).json({ message: 'SKU not found' });
    }

    // Soft delete by marking as inactive
    sku.isActive = false;
    await sku.save();

    // Create audit log
    await AuditLog.create({
      action: 'SKU Deleted',
      entityType: 'sku',
      entityId: sku._id,
      performedBy: req.user!.id,
      performedByName: req.user!.name,
      performedByRole: req.user!.role,
      changes: {
        skuCode: sku.skuCode,
        name: sku.name,
        isActive: false,
      },
    });

    res.json({
      message: 'SKU deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSKUStats = async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalSKUs,
      activeSKUs,
      lowStockSKUs,
      totalStockValue,
      categoryBreakdown,
    ] = await Promise.all([
      SKU.countDocuments(),
      SKU.countDocuments({ isActive: true }),
      SKU.countDocuments({
        $expr: { $lte: ['$currentStock', '$minReorderQuantity'] },
        isActive: true,
      }),
      SKU.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: null,
            total: { $sum: { $multiply: ['$currentStock', '$costPrice'] } },
          },
        },
      ]),
      SKU.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            totalValue: { $sum: { $multiply: ['$currentStock', '$costPrice'] } },
          },
        },
      ]),
    ]);

    res.json({
      totalSKUs,
      activeSKUs,
      lowStockSKUs,
      totalStockValue: totalStockValue[0]?.total || 0,
      categoryBreakdown,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
