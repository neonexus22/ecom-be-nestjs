import { Document, Schema } from 'mongoose';

export const ProductSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
});

export interface Product extends Document {
  name: string;
  price: number;
}
