import { Response } from 'express';
import mongoose from 'mongoose';
import SKU from '../models/SKU';
import StockMovement from '../models/StockMovement';
import AuditLog from '../models/AuditLog';
import { AuthRequest } from '../middleware/auth';

export const createStockMovement = async (req: AuthRequest, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const {
      skuId,
      movementType,
      quantity,
      reason,
      referenceNumber,
      fromLocation,
      toLocation,
      notes,
    } = req.body;

    // Get SKU
    const sku = await SKU.findById(skuId).session(session);
    if (!sku) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'SKU not found' });
    }

    const previousStock = sku.currentStock;
    let newStock = previousStock;
    let totalValue = 0;

    // Calculate new stock based on movement type
    switch (movementType) {
      case 'inward':
        newStock = previousStock + quantity;
        totalValue = quantity * sku.costPrice;
        break;
      case 'outward':
        if (previousStock < quantity) {
          await session.abortTransaction();
          return res.status(400).json({
            message: 'Insufficient stock',
            available: previousStock,
            requested: quantity,
          });
        }
        newStock = previousStock - quantity;
        totalValue = quantity * sku.sellingPrice;
        break;
      case 'damage':
      case 'loss':
        if (previousStock < quantity) {
          await session.abortTransaction();
          return res.status(400).json({
            message: 'Insufficient stock',
            available: previousStock,
            requested: quantity,
          });
        }
        newStock = previousStock - quantity;
        totalValue = quantity * sku.costPrice;
        break;
      case 'adjustment':
        newStock = quantity; // Direct stock adjustment
        totalValue = Math.abs(quantity - previousStock) * sku.costPrice;
        break;
      default:
        await session.abortTransaction();
        return res.status(400).json({ message: 'Invalid movement type' });
    }

    // Update SKU stock
    sku.currentStock = newStock;
    await sku.save({ session });

    // Create stock movement record
    const movement = await StockMovement.create(
      [
        {
          sku: sku._id,
          skuCode: sku.skuCode,
          skuName: sku.name,
          movementType,
          quantity,
          unit: sku.unit,
          previousStock,
          newStock,
          costPrice: sku.costPrice,
          sellingPrice: sku.sellingPrice,
          totalValue,
          reason,
          referenceNumber,
          fromLocation,
          toLocation,
          performedBy: req.user!.id,
          performedByName: req.user!.name,
          notes,
        },
      ],
      { session }
    );

    // Skip audit log for now (no real user authentication)

    await session.commitTransaction();

    res.status(201).json({
      message: 'Stock movement recorded successfully',
      movement: movement[0],
      updatedStock: newStock,
    });
  } catch (error: any) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

export const getStockMovements = async (req: AuthRequest, res: Response) => {
  try {
    const {
      skuId,
      movementType,
      startDate,
      endDate,
      page = 1,
      limit = 50,
    } = req.query;

    const query: any = {};

    if (skuId) query.sku = skuId;
    if (movementType) query.movementType = movementType;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate as string);
      if (endDate) query.createdAt.$lte = new Date(endDate as string);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [movements, total] = await Promise.all([
      StockMovement.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('sku', 'skuCode name category')
        .lean(),
      StockMovement.countDocuments(query),
    ]);

    res.json({
      movements,
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

export const getStockMovementStats = async (req: AuthRequest, res: Response) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Number(days));

    const stats = await StockMovement.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$movementType',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          totalValue: { $sum: '$totalValue' },
        },
      },
    ]);

    const dailyMovements = await StockMovement.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
          inward: {
            $sum: { $cond: [{ $eq: ['$movementType', 'inward'] }, '$quantity', 0] },
          },
          outward: {
            $sum: { $cond: [{ $eq: ['$movementType', 'outward'] }, '$quantity', 0] },
          },
          damage: {
            $sum: { $cond: [{ $eq: ['$movementType', 'damage'] }, '$quantity', 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      stats,
      dailyMovements,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
