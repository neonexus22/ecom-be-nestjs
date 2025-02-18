import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getAllProducts(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'name',
    sortOrder: 'asc' | 'desc' = 'asc',
    filter: { [key: string]: any } = {},
  ) {
    // redis config start
    const cacheKey = `products_${page}_${limit}_${sortBy}_${sortOrder}_${JSON.stringify(filter)}`;
    // Check if the data is in redis
    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) return cachedData;
    // redis config end

    const skip = (page - 1) * limit;

    const query = this.productModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 });

    const products = await query.exec();
    const total = await this.productModel.countDocuments(filter).exec();

    const result = {
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Cache the result
    await this.cacheManager.set(cacheKey, result, 60);

    return result;
  }

  async getProductById(id: string) {
    const cacheKey = `product_${id}`;
    // check if data in cache already
    const cachedData = await this.cacheManager.get(cacheKey);
    if (cachedData) return cachedData;

    const product = this.productModel.findById(id).exec();

    await this.cacheManager.set(cacheKey, product, 60);

    return product;
  }

  addProduct(name: string, price: number) {
    const newProduct = new this.productModel({ name, price });
    return newProduct.save();
  }
}
