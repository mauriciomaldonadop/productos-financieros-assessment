import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-pagination',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './product-pagination.component.html',
  styleUrl: './product-pagination.component.css'
})
export class ProductPaginationComponent {
  @Input() totalResults = 0;
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() itemsPerPage = 5;

  @Output() pageChange = new EventEmitter<number>();
  @Output() limitChange = new EventEmitter<number>();

  onPrev(): void {
    if (this.currentPage > 1) this.pageChange.emit(this.currentPage - 1);
  }

  onNext(): void {
    if (this.currentPage < this.totalPages) this.pageChange.emit(this.currentPage + 1);
  }

  onLimitChange(limit: number): void {
    this.limitChange.emit(Number(limit));
  }
}
