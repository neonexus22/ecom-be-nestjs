import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async getAllProducts(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'name',
    sortOrder: 'asc' | 'desc' = 'asc',
    filter: { [key: string]: any } = {},
  ) {
    const skip = (page - 1) * limit;

    const query = this.productModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 });

    const products = await query.exec();
    const total = await this.productModel.countDocuments(filter).exec();

    return {
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  getProductById(id: string) {
    return this.productModel.findById(id).exec();
  }

  addProduct(name: string, price: number) {
    const newProduct = new this.productModel({ name, price });
    return newProduct.save();
  }
}
