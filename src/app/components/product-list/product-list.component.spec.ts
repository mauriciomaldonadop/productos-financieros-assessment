import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { provideRouter } from '@angular/router';
import { FinancialProduct } from '../../interfaces/product.interface';
import { of } from 'rxjs';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;

  const mockProducts: FinancialProduct[] = [
    { id: '1', name: 'Apple Card', description: 'Credit card', logo: '', date_release: '', date_revision: '' },
    { id: '2', name: 'Banana Bank', description: 'Savings account', logo: '', date_release: '', date_revision: '' },
    { id: '3', name: 'Cherry Crypto', description: 'Wallet', logo: '', date_release: '', date_revision: '' },
    { id: '4', name: 'Date Deposit', description: 'Fixed term', logo: '', date_release: '', date_revision: '' },
    { id: '5', name: 'Elderberry Equity', description: 'Stocks', logo: '', date_release: '', date_revision: '' },
    { id: '6', name: 'Fig Finance', description: 'Loans', logo: '', date_release: '', date_revision: '' }
  ];

  beforeEach(async () => {
    // 1. ARRANGE
    const spy = jasmine.createSpyObj('ProductService', ['getProducts', 'deleteProduct']);

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        provideRouter([]),
        { provide: ProductService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productServiceSpy = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
  });

  describe('Initialization', () => {
    it('should load products into the products signal on init', () => {
      // 1. ARRANGE
      productServiceSpy.getProducts.and.returnValue(of(mockProducts));

      // 2. ACT
      fixture.detectChanges();

      // 3. ASSERT
      expect(component.products().length).toBe(6);
    });

    it('should calculate the total pages correctly based on default itemsPerPage (5)', () => {
      // 1. ARRANGE
      productServiceSpy.getProducts.and.returnValue(of(mockProducts));

      // 2. ACT
      fixture.detectChanges();

      // 3. ASSERT
      expect(component.totalPages()).toBe(2);
    });
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
      productServiceSpy.getProducts.and.returnValue(of(mockProducts));
      fixture.detectChanges();
    });

    it('should reduce the filtered products array length based on search term', () => {
      // 2. ACT
      component.onSearchChange('apple');

      // 3. ASSERT
      expect(component.filteredProducts().length).toBe(1);
    });

    it('should reset current page to 1 when search term changes', () => {
      // 1. ARRANGE
      component.currentPage.set(2);

      // 2. ACT
      component.onSearchChange('ban');

      // 3. ASSERT
      expect(component.currentPage()).toBe(1);
    });
  });

  describe('Pagination Controls', () => {
    beforeEach(() => {
      productServiceSpy.getProducts.and.returnValue(of(mockProducts));
      fixture.detectChanges();
    });

    it('should increase current page when nextPage is called', () => {
      // 1. ARRANGE
      component.currentPage.set(1);

      // 2. ACT
      component.nextPage();

      // 3. ASSERT
      expect(component.currentPage()).toBe(2);
    });

    it('should reset current page to 1 when limit changes', () => {
      // 1. ARRANGE
      component.currentPage.set(2);

      // 2. ACT
      component.onLimitChange(10);

      // 3. ASSERT
      expect(component.currentPage()).toBe(1);
    });

    it('should update itemsPerPage signal when limit changes', () => {
      // 2. ACT
      component.onLimitChange(20);

      // 3. ASSERT
      expect(component.itemsPerPage()).toBe(20);
    });
  });

  describe('Dropdown Menu (F5)', () => {
    beforeEach(() => {
      productServiceSpy.getProducts.and.returnValue(of(mockProducts));
      fixture.detectChanges();
    });

    it('should set activeDropdown to the provided id', () => {
      // 2. ACT
      component.toggleDropdown('123');

      // 3. ASSERT
      expect(component.activeDropdown()).toBe('123');
    });

    it('should clear activeDropdown if the same id is toggled again', () => {
      // 1. ARRANGE
      component.activeDropdown.set('123');

      // 2. ACT
      component.toggleDropdown('123');

      // 3. ASSERT
      expect(component.activeDropdown()).toBeNull();
    });
  });

  describe('Delete Modal (F6)', () => {
    beforeEach(() => {
      productServiceSpy.getProducts.and.returnValue(of(mockProducts));
      fixture.detectChanges();
    });

    it('should set showModal to true when openDeleteModal is called', () => {
      // 1. ARRANGE
      const productToDel = mockProducts[0];

      // 2. ACT
      component.openDeleteModal(productToDel);

      // 3. ASSERT
      expect(component.showModal()).toBeTrue();
    });

    it('should assign the correct product to productToDelete signal', () => {
      // 1. ARRANGE
      const productToDel = mockProducts[0];

      // 2. ACT
      component.openDeleteModal(productToDel);

      // 3. ASSERT
      expect(component.productToDelete()?.id).toBe('1');
    });

    it('should clear productToDelete when modal is closed', () => {
      // 1. ARRANGE
      component.openDeleteModal(mockProducts[0]);

      // 2. ACT
      component.closeModal();

      // 3. ASSERT
      expect(component.productToDelete()).toBeNull();
    });

    it('should call deleteProduct service when confirmDelete is triggered', () => {
      // 1. ARRANGE
      productServiceSpy.deleteProduct.and.returnValue(of(undefined));
      component.openDeleteModal(mockProducts[0]);

      // 2. ACT
      component.confirmDelete();

      // 3. ASSERT
      expect(productServiceSpy.deleteProduct).toHaveBeenCalledWith('1');
    });

    it('should reload products after successful deletion', () => {
      // 1. ARRANGE
      productServiceSpy.deleteProduct.and.returnValue(of(undefined));
      component.openDeleteModal(mockProducts[0]);
      productServiceSpy.getProducts.calls.reset();

      // 2. ACT
      component.confirmDelete();

      // 3. ASSERT
      expect(productServiceSpy.getProducts).toHaveBeenCalled();
    });
  });
});
