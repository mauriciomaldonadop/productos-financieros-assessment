import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTableComponent } from './product-table.component';
import {FinancialProduct} from '../../interfaces/product.interface';
import {provideRouter} from '@angular/router';

describe('ProductTableComponent', () => {
  let component: ProductTableComponent;
  let fixture: ComponentFixture<ProductTableComponent>;
  const mockProduct = { id: '1', name: 'Test' } as FinancialProduct;

  beforeEach(async () => {
    // 1. ARRANGE
    await TestBed.configureTestingModule({
      imports: [ProductTableComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('UI Interactions', () => {
    it('should set activeDropdown to the selected ID', () => {
      // 2. ACT
      component.toggleDropdown('1');
      // 3. ASSERT
      expect(component.activeDropdown()).toBe('1');
    });

    it('should emit requestDelete and close dropdown on delete', () => {
      // 1. ARRANGE
      component.activeDropdown.set('1');
      spyOn(component.requestDelete, 'emit');

      // 2. ACT
      component.onDelete(mockProduct);

      // 3. ASSERT
      expect(component.requestDelete.emit).toHaveBeenCalledWith(mockProduct);
    });
  });
});
