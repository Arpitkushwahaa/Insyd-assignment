import mongoose, { Document, Schema } from 'mongoose';

export interface IStockMovement extends Document {
  sku: mongoose.Types.ObjectId;
  skuCode: string;
  skuName: string;
  movementType: 'inward' | 'outward' | 'damage' | 'loss' | 'adjustment' | 'transfer';
  quantity: number;
  unit: string;
  previousStock: number;
  newStock: number;
  costPrice?: number;
  sellingPrice?: number;
  totalValue: number;
  reason?: string;
  referenceNumber?: string; // Invoice, PO, etc.
  fromLocation?: string;
  toLocation?: string;
  performedBy?: mongoose.Types.ObjectId;
  performedByName?: string;
  notes?: string;
  createdAt: Date;
}

const StockMovementSchema = new Schema<IStockMovement>(
  {
    sku: {
      type: Schema.Types.ObjectId,
      ref: 'SKU',
      required: true,
    },
    skuCode: {
      type: String,
      required: true,
    },
    skuName: {
      type: String,
      required: true,
    },
    movementType: {
      type: String,
      required: true,
      enum: ['inward', 'outward', 'damage', 'loss', 'adjustment', 'transfer'],
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    previousStock: {
      type: Number,
      required: true,
    },
    newStock: {
      type: Number,
      required: true,
    },
    costPrice: {
      type: Number,
    },
    sellingPrice: {
      type: Number,
    },
    totalValue: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      trim: true,
    },
    referenceNumber: {
      type: String,
      trim: true,
    },
    fromLocation: {
      type: String,
    },
    toLocation: {
      type: String,
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    performedByName: {
      type: String,
      required: false,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
StockMovementSchema.index({ sku: 1, createdAt: -1 });
StockMovementSchema.index({ movementType: 1, createdAt: -1 });
StockMovementSchema.index({ createdAt: -1 });

export default mongoose.model<IStockMovement>('StockMovement', StockMovementSchema);
