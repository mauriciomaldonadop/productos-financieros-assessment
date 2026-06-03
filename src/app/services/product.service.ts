import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiResponse, FinancialProduct } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = '/bp/products';

  getProducts(): Observable<FinancialProduct[]> {
    return this.http.get<ApiResponse<FinancialProduct[]>>(this.apiUrl)
      .pipe(map(response => response.data || []));
  }
}
