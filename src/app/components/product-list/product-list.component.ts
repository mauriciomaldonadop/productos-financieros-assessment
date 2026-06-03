import {Component, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ProductService} from '../../services/product.service';
import {FinancialProduct} from '../../interfaces/product.interface';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  private productService = inject(ProductService);
  products = signal<FinancialProduct[]>([]);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => this.products.set(data),
      error: (err) => console.error('Error fetching products', err)
    });
  }
}
