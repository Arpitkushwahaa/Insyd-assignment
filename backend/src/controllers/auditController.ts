import { Response } from 'express';
import AuditLog from '../models/AuditLog';
import { AuthRequest } from '../middleware/auth';

export const getAuditLogs = async (req: AuthRequest, res: Response) => {
  try {
    const {
      entityType,
      performedBy,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 50,
    } = req.query;

    const query: any = {};

    if (entityType) query.entityType = entityType;
    if (performedBy) query.performedBy = performedBy;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate as string);
      if (endDate) query.timestamp.$lte = new Date(endDate as string);
    }
    
    // Handle search across action, entityType, and performedByName
    if (search) {
      query.$or = [
        { action: { $regex: search, $options: 'i' } },
        { entityType: { $regex: search, $options: 'i' } },
        { performedByName: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('performedBy', 'name email')
        .lean(),
      AuditLog.countDocuments(query),
    ]);

    // Transform timestamp to createdAt for frontend compatibility
    const transformedLogs = logs.map(log => ({
      ...log,
      createdAt: log.timestamp,
    }));

    res.json({
      logs: transformedLogs,
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
