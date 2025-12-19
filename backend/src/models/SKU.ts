import mongoose, { Document, Schema } from 'mongoose';

export interface ISKU extends Document {
  skuCode: string;
  name: string;
  category: string;
  subcategory?: string;
  description?: string;
  supplier: string;
  costPrice: number;
  sellingPrice: number;
  currentStock: number;
  unit: string; // pieces, sqft, kg, boxes, etc.
  minReorderQuantity: number;
  maxStockLevel?: number;
  location: string; // warehouse, showroom, site
  imageUrl?: string;
  attributes?: Map<string, string>; // For category-specific attributes
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SKUSchema = new Schema<ISKU>(
  {
    skuCode: {
      type: String,
      required: [true, 'SKU code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['tiles', 'sanitaryware', 'lighting', 'stone', 'plywood', 'other'],
    },
    subcategory: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    supplier: {
      type: String,
      required: [true, 'Supplier is required'],
      trim: true,
    },
    costPrice: {
      type: Number,
      required: [true, 'Cost price is required'],
      min: 0,
    },
    sellingPrice: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: 0,
    },
    currentStock: {
      type: Number,
      default: 0,
      min: 0,
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      enum: ['pieces', 'sqft', 'kg', 'boxes', 'sets', 'meters'],
      default: 'pieces',
    },
    minReorderQuantity: {
      type: Number,
      required: [true, 'Minimum reorder quantity is required'],
      min: 0,
    },
    maxStockLevel: {
      type: Number,
      min: 0,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      default: 'warehouse',
    },
    imageUrl: {
      type: String,
    },
    attributes: {
      type: Map,
      of: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
SKUSchema.index({ category: 1, currentStock: 1 });
SKUSchema.index({ skuCode: 1 });

export default mongoose.model<ISKU>('SKU', SKUSchema);
