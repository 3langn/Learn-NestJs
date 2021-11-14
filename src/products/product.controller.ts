import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductsService } from './product.service';

@Controller('api/product')
export class ProductController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  getAllProducts() {
    return { products: { ...this.productService.getAllProducts() } };
  }

  @Get(':id')
  getProduct(@Param('id') productId: string) {
    return { product: { ...this.productService.getProduct(productId) } };
  }

  @Post()
  insertProduct(
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('price') price: number,
  ) {
    return { id: this.productService.insertProduct(title, description, price) };
  }
}
