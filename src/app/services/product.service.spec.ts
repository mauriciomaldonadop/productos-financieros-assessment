import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { FinancialProduct } from '../interfaces/product.interface';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProduct: FinancialProduct = {
    id: '123',
    name: 'Test Product',
    description: 'Test Description',
    logo: 'logo.png',
    date_release: '2025-01-01',
    date_revision: '2026-01-01'
  };
  beforeEach(() => {
    // 1. ARRANGE
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Initialization', () => {
    it('should be created', () => {
      // 2. ACT & 3. ASSERT
      expect(service).toBeTruthy();
    });
  });

  describe('getProducts()', () => {
    it('should make a GET request', () => {
      // 1. ARRANGE
      const mockResponse = { data: [mockProduct] };

      // 2. ACT
      service.getProducts().subscribe();
      const req = httpMock.expectOne(req => req.url.endsWith('/bp/products'));
      req.flush(mockResponse);

      // 3. ASSERT
      expect(req.request.method).toBe('GET');
    });

    it('should return mapped products array when data exists', () => {
      // 1. ARRANGE
      const mockResponse = { data: [mockProduct] };
      let result: FinancialProduct[] = [];

      // 2. ACT
      service.getProducts().subscribe(res => result = res);
      const req = httpMock.expectOne(req => req.url.endsWith('/bp/products'));
      req.flush(mockResponse);

      // 3. ASSERT
      expect(result.length).toBe(1);
    });

    it('should return an empty array fallback when data is missing or falsy', () => {
      // 1. ARRANGE
      const mockResponse = {};
      let result: FinancialProduct[] = [];

      // 2. ACT
      service.getProducts().subscribe(res => result = res);
      const req = httpMock.expectOne(req => req.url.endsWith('/bp/products'));
      req.flush(mockResponse);

      // 3. ASSERT
      expect(result).toEqual([]);
    });
  });

  describe('getProductById()', () => {
    it('should make a GET request with the specific ID', () => {
      // 1. ARRANGE
      const mockResponse = { data: mockProduct };

      // 2. ACT
      service.getProductById('123').subscribe();
      const req = httpMock.expectOne(req => req.url.includes('/bp/products/123'));
      req.flush(mockResponse);

      // 3. ASSERT
      expect(req.request.method).toBe('GET');
    });

    it('should unwrap data property if the backend wraps the response', () => {
      // 1. ARRANGE
      const mockResponse = { data: mockProduct };
      let result: any;

      // 2. ACT
      service.getProductById('123').subscribe(res => result = res);
      const req = httpMock.expectOne(req => req.url.includes('/bp/products/123'));
      req.flush(mockResponse);

      // 3. ASSERT
      expect(result.id).toBe('123');
    });

    it('should return the response directly if backend does NOT wrap in data property', () => {
      // 1. ARRANGE
      const mockResponse = mockProduct;
      let result: any;

      // 2. ACT
      service.getProductById('123').subscribe(res => result = res);
      const req = httpMock.expectOne(req => req.url.includes('/bp/products/123'));
      req.flush(mockResponse);

      // 3. ASSERT
      expect(result.id).toBe('123');
    });
  });

  describe('verifyIdExists()', () => {
    it('should make a GET request to the verification endpoint', () => {
      // 1. ARRANGE & 2. ACT
      service.verifyIdExists('123').subscribe();
      const req = httpMock.expectOne(req => req.url.includes('/verification/123'));
      req.flush(true);

      // 3. ASSERT
      expect(req.request.method).toBe('GET');
    });

    it('should return true if ID exists', () => {
      // 1. ARRANGE
      let result = false;

      // 2. ACT
      service.verifyIdExists('123').subscribe(res => result = res);
      const req = httpMock.expectOne(req => req.url.includes('/verification/123'));
      req.flush(true);

      // 3. ASSERT
      expect(result).toBeTrue();
    });

    it('should return false if ID does not exist', () => {
      // 1. ARRANGE
      let result = true;

      // 2. ACT
      service.verifyIdExists('999').subscribe(res => result = res);
      const req = httpMock.expectOne(req => req.url.includes('/verification/999'));
      req.flush(false);

      // 3. ASSERT
      expect(result).toBeFalse();
    });
  });

  describe('createProduct()', () => {
    it('should make a POST request to create the product', () => {
      // 1. ARRANGE
      const mockResponse = { data: mockProduct };

      // 2. ACT
      service.createProduct(mockProduct).subscribe();
      const req = httpMock.expectOne(req => req.url.endsWith('/bp/products'));
      req.flush(mockResponse);

      // 3. ASSERT
      expect(req.request.method).toBe('POST');
    });

    it('should map and return the created product data', () => {
      // 1. ARRANGE
      const mockResponse = { data: mockProduct };
      let result: any;

      // 2. ACT
      service.createProduct(mockProduct).subscribe(res => result = res);
      const req = httpMock.expectOne(req => req.url.endsWith('/bp/products'));
      req.flush(mockResponse);

      // 3. ASSERT
      expect(result.name).toBe('Test Product');
    });
  });

  describe('updateProduct()', () => {
    it('should make a PUT request to update the product', () => {
      // 1. ARRANGE
      const mockResponse = { data: mockProduct };

      // 2. ACT
      service.updateProduct('123', mockProduct).subscribe();
      const req = httpMock.expectOne(req => req.url.includes('/bp/products/123'));
      req.flush(mockResponse);

      // 3. ASSERT
      expect(req.request.method).toBe('PUT');
    });

    it('should map and return the updated product data', () => {
      // 1. ARRANGE
      const mockResponse = { data: mockProduct };
      let result: any;

      // 2. ACT
      service.updateProduct('123', mockProduct).subscribe(res => result = res);
      const req = httpMock.expectOne(req => req.url.includes('/bp/products/123'));
      req.flush(mockResponse);

      // 3. ASSERT
      expect(result.id).toBe('123');
    });
  });

  describe('deleteProduct()', () => {
    it('should make a DELETE request to remove the product', () => {
      // 1. ARRANGE & 2. ACT
      service.deleteProduct('123').subscribe();
      const req = httpMock.expectOne(req => req.url.includes('/bp/products/123'));
      req.flush(null);

      // 3. ASSERT
      expect(req.request.method).toBe('DELETE');
    });
  });
});
