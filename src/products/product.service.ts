import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.model';

@Injectable()
export class ProductsService {
  products: Product[] = [];

  insertProduct(title: string, description: string, price: number): string {
    const newProduct = new Product(
      Math.random().toString(),
      title,
      description,
      price,
    );
    this.products.push(newProduct);
    return newProduct.id;
  }

  getAllProducts() {
    return this.products;
  }

  getProduct(id: string) {
    const product = this.products.find((product) => product.id === id);
    if (!product) {
      return new NotFoundException('Could not found product.');
    }
    return { ...product };
  }
}
