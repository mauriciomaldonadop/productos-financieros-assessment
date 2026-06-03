import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ApiResponse, FinancialProduct } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3002/bp/products';

  getProducts(): Observable<FinancialProduct[]> {
    return this.http.get<ApiResponse<FinancialProduct[]>>(this.apiUrl)
      .pipe(map(response => response.data || []));
  }
}
