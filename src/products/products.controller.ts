/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/CreateProductDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { EmailService } from 'src/email/email.service';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';

@Controller('products')
@UseGuards(ThrottlerGuard)
@UsePipes(new ValidationPipe())
export class ProductsController {
  constructor(
    private readonly productService: ProductsService,
    private readonly emailService: EmailService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getAllProducts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('sortBy', new DefaultValuePipe('name')) sortBy: string,
    @Query('sortOrder', new DefaultValuePipe('asc')) sortOrder: 'asc' | 'desc',
    @Query('name') name?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ) {
    const filter: { [key: string]: any } = {};
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = minPrice;
      if (maxPrice) filter.price.$lte = maxPrice;
    }

    return this.productService.getAllProducts(
      page,
      limit,
      sortBy,
      sortOrder,
      filter,
    );
  }

  @Get(':id')
  getProductById(@Param('id') id: string) {
    return this.productService.getProductById(id);
  }

  @Post()
  async addProduct(@Body() createProductDto: CreateProductDto) {
    const product = this.productService.addProduct(
      createProductDto.name,
      createProductDto.price,
    );
    await this.emailService.sendEmail(
      'admin@example.com',
      'New Product Added',
      `A new product ${createProductDto.name} has been added}`,
    );
    return product;
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File upload failed.');
    }
    return {
      message: 'File uploaded successfully',
      file: file?.filename,
    };
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return this.productService.removeProduct(id);
  }
}
