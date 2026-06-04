import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSearchComponent } from './product-search.component';
import {provideRouter} from '@angular/router';

describe('ProductSearchComponent', () => {
  let component: ProductSearchComponent;
  let fixture: ComponentFixture<ProductSearchComponent>;

  beforeEach(async () => {
    // 1. ARRANGE
    await TestBed.configureTestingModule({
      imports: [ProductSearchComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Outputs', () => {
    it('should emit searchTermChange when onSearchChange is called', () => {
      // 1. ARRANGE
      spyOn(component.searchTermChange, 'emit');

      // 2. ACT
      component.onSearchChange('product1');

      // 3. ASSERT
      expect(component.searchTermChange.emit).toHaveBeenCalledWith('product1');
    });
  });
});
