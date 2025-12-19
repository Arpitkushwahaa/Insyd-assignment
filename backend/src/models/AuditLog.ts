import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  action: string;
  entityType: 'sku' | 'stock' | 'user' | 'system';
  entityId?: mongoose.Types.ObjectId;
  performedBy: mongoose.Types.ObjectId;
  performedByName: string;
  performedByRole: string;
  changes?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    action: {
      type: String,
      required: true,
    },
    entityType: {
      type: String,
      required: true,
      enum: ['sku', 'stock', 'user', 'system'],
    },
    entityId: {
      type: Schema.Types.ObjectId,
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    performedByName: {
      type: String,
      required: true,
    },
    performedByRole: {
      type: String,
      required: true,
    },
    changes: {
      type: Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

// Index for queries
AuditLogSchema.index({ timestamp: -1 });
AuditLogSchema.index({ performedBy: 1, timestamp: -1 });
AuditLogSchema.index({ entityType: 1, entityId: 1 });

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
