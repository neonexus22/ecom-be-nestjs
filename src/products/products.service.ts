import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private readonly productModule: Model<Product>,
  ) {}

  getAllProducts() {
    return this.productModule.find().exec();
  }

  getProductById(id: string) {
    return this.productModule.findById(id).exec();
  }

  addProduct(name: string, price: number) {
    const newProduct = new this.productModule({ name, price });
    return newProduct.save();
  }
}
