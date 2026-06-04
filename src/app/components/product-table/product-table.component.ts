import {Component, EventEmitter, Input, Output, signal} from '@angular/core';
import {FinancialProduct} from '../../interfaces/product.interface';
import {DatePipe, NgIf} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [
    DatePipe,
    RouterLink,
    NgIf
  ],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.css'
})
export class ProductTableComponent {
  @Input() products: FinancialProduct[] = [];
  @Output() requestDelete = new EventEmitter<FinancialProduct>();

  activeDropdown = signal<string | null>(null);

  toggleDropdown(id: string): void {
    this.activeDropdown.update(current => current === id ? null : id);
  }

  onDelete(product: FinancialProduct): void {
    this.activeDropdown.set(null); // Cierra el menú
    this.requestDelete.emit(product);
  }
}
