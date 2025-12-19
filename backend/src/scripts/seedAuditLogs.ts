import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AuditLog from '../models/AuditLog';
import User from '../models/User';
import SKU from '../models/SKU';

dotenv.config();

const seedAuditLogs = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('MongoDB Connected');

    // Get a user for audit logs
    let user = await User.findOne();
    if (!user) {
      console.log('No users found, creating default user...');
      user = await User.create({
        name: 'System Admin',
        email: 'admin@insyd.com',
        password: 'hashedpassword',
        role: 'admin',
      });
    }

    // Get some SKUs
    const skus = await SKU.find().limit(5);

    // Clear existing audit logs
    await AuditLog.deleteMany({});
    console.log('Cleared existing audit logs');

    // Create sample audit logs
    const auditLogs = [
      {
        action: 'SKU Created',
        entityType: 'sku',
        entityId: skus[0]?._id,
        performedBy: user._id,
        performedByName: user.name,
        performedByRole: user.role,
        changes: {
          name: skus[0]?.name,
          skuCode: skus[0]?.skuCode,
          currentStock: skus[0]?.currentStock,
        },
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
      },
      {
        action: 'SKU Updated',
        entityType: 'sku',
        entityId: skus[1]?._id,
        performedBy: user._id,
        performedByName: user.name,
        performedByRole: user.role,
        changes: {
          currentStock: { from: 100, to: 150 },
        },
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4), // 4 days ago
      },
      {
        action: 'Stock Movement Recorded',
        entityType: 'stock',
        entityId: skus[2]?._id,
        performedBy: user._id,
        performedByName: user.name,
        performedByRole: user.role,
        changes: {
          movementType: 'inward',
          quantity: 50,
          previousStock: 100,
          newStock: 150,
        },
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      },
      {
        action: 'Stock Movement Recorded',
        entityType: 'stock',
        entityId: skus[3]?._id,
        performedBy: user._id,
        performedByName: user.name,
        performedByRole: user.role,
        changes: {
          movementType: 'outward',
          quantity: 25,
          previousStock: 150,
          newStock: 125,
        },
        ipAddress: '192.168.1.103',
        userAgent: 'Mozilla/5.0',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      },
      {
        action: 'Stock Movement Recorded - outward',
        entityType: 'stock',
        entityId: skus[0]?._id,
        performedBy: user._id,
        performedByName: user.name,
        performedByRole: user.role,
        changes: {
          movementType: 'outward',
          quantity: 15,
          reason: 'Customer order fulfillment',
        },
        ipAddress: '192.168.1.104',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      },
      {
        action: 'SKU Created',
        entityType: 'sku',
        entityId: skus[4]?._id,
        performedBy: user._id,
        performedByName: user.name,
        performedByRole: user.role,
        changes: {
          name: skus[4]?.name,
          skuCode: skus[4]?.skuCode,
          category: skus[4]?.category,
        },
        ipAddress: '192.168.1.105',
        userAgent: 'Mozilla/5.0',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      },
      {
        action: 'Stock Adjustment',
        entityType: 'stock',
        performedBy: user._id,
        performedByName: user.name,
        performedByRole: user.role,
        changes: {
          movementType: 'adjustment',
          reason: 'Physical inventory count',
        },
        ipAddress: '192.168.1.106',
        userAgent: 'Mozilla/5.0',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      },
      {
        action: 'Damage Recorded',
        entityType: 'stock',
        performedBy: user._id,
        performedByName: user.name,
        performedByRole: user.role,
        changes: {
          movementType: 'damage',
          quantity: 5,
          reason: 'Water damage in warehouse',
        },
        ipAddress: '192.168.1.107',
        userAgent: 'Mozilla/5.0',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
      },
      {
        action: 'Stock Movement Recorded - inward',
        entityType: 'stock',
        performedBy: user._id,
        performedByName: user.name,
        performedByRole: user.role,
        changes: {
          movementType: 'inward',
          quantity: 200,
          reason: 'Supplier delivery - bulk order',
        },
        ipAddress: '192.168.1.108',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      },
      {
        action: 'System Backup',
        entityType: 'system',
        performedBy: user._id,
        performedByName: 'System',
        performedByRole: 'admin',
        changes: {
          backupSize: '2.5 GB',
          status: 'success',
        },
        ipAddress: '127.0.0.1',
        userAgent: 'System/1.0',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      },
    ];

    await AuditLog.insertMany(auditLogs);
    console.log(`✅ Seeded ${auditLogs.length} audit logs`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding audit logs:', error);
    process.exit(1);
  }
};

seedAuditLogs();
