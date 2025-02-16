import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/CreateProductDto';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';

@Controller('products')
@UsePipes(new ValidationPipe())
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Post()
  addProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.addProduct(
      createProductDto.name,
      createProductDto.price,
    );
  }
}
