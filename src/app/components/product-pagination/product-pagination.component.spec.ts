import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPaginationComponent } from './product-pagination.component';

describe('ProductPaginationComponent', () => {
  let component: ProductPaginationComponent;
  let fixture: ComponentFixture<ProductPaginationComponent>;

  beforeEach(async () => {
    // 1. ARRANGE
    await TestBed.configureTestingModule({
      imports: [ProductPaginationComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(ProductPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Events', () => {
    it('should emit pageChange with previous page number', () => {
      // 1. ARRANGE
      component.currentPage = 2;
      spyOn(component.pageChange, 'emit');

      // 2. ACT
      component.onPrev();

      // 3. ASSERT
      expect(component.pageChange.emit).toHaveBeenCalledWith(1);
    });

    it('should emit pageChange with next page number', () => {
      // 1. ARRANGE
      component.currentPage = 1;
      component.totalPages = 3;
      spyOn(component.pageChange, 'emit');

      // 2. ACT
      component.onNext();

      // 3. ASSERT
      expect(component.pageChange.emit).toHaveBeenCalledWith(2);
    });

    it('should emit limitChange when selection changes', () => {
      // 1. ARRANGE
      spyOn(component.limitChange, 'emit');

      // 2. ACT
      component.onLimitChange(10);

      // 3. ASSERT
      expect(component.limitChange.emit).toHaveBeenCalledWith(10);
    });
  });
});
