import mongoose, { Schema, Document } from 'mongoose';

interface IProduct extends Document {
  sellerId: mongoose.Schema.Types.ObjectId;
  title: string;
  price: number;
  description: string;
  category: string;
  condition: string;
  isListed:boolean;
  images: string[];  // Array of image URLs
  isSold: boolean;
  buyerId?: mongoose.Schema.Types.ObjectId;
  location: string;
  createdAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String, // Storing image URLs as strings
        required: true,
      },
    ],
    isSold: {
      type: Boolean,
      default: false,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isListed: { type: Boolean, default: true },
    location: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: false },
  }
);

const Product = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
