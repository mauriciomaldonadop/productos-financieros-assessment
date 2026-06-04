import {Component, EventEmitter, Input, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.css'
})
export class ProductSearchComponent {
  @Input() searchTerm = '';
  @Output() searchTermChange = new EventEmitter<string>();

  onSearchChange(term: string): void {
    this.searchTermChange.emit(term);
  }
}
