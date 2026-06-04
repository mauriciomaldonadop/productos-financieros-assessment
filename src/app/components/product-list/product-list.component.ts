import {Component, computed, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { FinancialProduct } from '../../interfaces/product.interface';
import { FormsModule } from '@angular/forms';
import { ProductSearchComponent } from '../product-search/product-search.component';
import {ProductPaginationComponent} from '../product-pagination/product-pagination.component';
import {ProductTableComponent} from '../product-table/product-table.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductSearchComponent, ProductPaginationComponent, ProductTableComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  private productService = inject(ProductService);
  products = signal<FinancialProduct[]>([]);
  searchTerm = signal<string>('');
  itemsPerPage = signal<number>(5);
  currentPage = signal<number>(1);
  activeDropdown = signal<string | null>(null);
  showModal = signal<boolean>(false);
  productToDelete = signal<FinancialProduct | null>(null);

  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.products();

    return this.products().filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term)
    );
  });

  totalPages = computed(() => {
    const total = this.filteredProducts().length;
    return Math.ceil(total / this.itemsPerPage());
  });

  paginatedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.filteredProducts().slice(start, end);
  });

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data) => this.products.set(data),
      error: (err) => console.error('Error fetching products', err)
    });
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1);
  }

  onLimitChange(limit: number): void {
    this.itemsPerPage.set(Number(limit));
    this.currentPage.set(1);
  }

  prevPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }

  toggleDropdown(id: string): void {
    this.activeDropdown.update(currentId => currentId === id ? null : id);
  }

  openDeleteModal(product: FinancialProduct): void {
    this.productToDelete.set(product);
    this.showModal.set(true);
    this.activeDropdown.set(null);
  }

  confirmDelete(): void {
    const product = this.productToDelete();
    if (product) {
      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          this.closeModal();
          this.loadProducts();
        },
        error: (err) => {
          console.error(err);
          alert('Hubo un error al eliminar el producto.');
          this.closeModal();
        }
      });
    }
  }

  closeModal(): void {
    this.showModal.set(false);
    this.productToDelete.set(null);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }
}
