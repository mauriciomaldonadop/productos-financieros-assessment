import {ComponentFixture, TestBed} from '@angular/core/testing';

import { ProductFormComponent } from './product-form.component';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let routerSpy: jasmine.SpyObj<Router>;

  let mockRouteParamId: string | null = null;

  beforeEach(async () => {
    // 1. ARRANGE
    const prodSpy = jasmine.createSpyObj('ProductService', [
      'verifyIdExists',
      'createProduct',
      'updateProduct',
      'getProductById'
    ]);
    const navSpy = jasmine.createSpyObj('Router', ['navigate']);

    const activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: (key: string) => key === 'id' ? mockRouteParamId : null
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [ProductFormComponent],
      providers: [
        { provide: ProductService, useValue: prodSpy },
        { provide: Router, useValue: navSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    productServiceSpy = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  const createComponent = () => {
    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
  };

  describe('Initialization (Create Mode)', () => {
    beforeEach(() => {
      mockRouteParamId = null;
      createComponent();
      fixture.detectChanges();
    });

    it('should set isEditMode to false', () => {
      expect(component.isEditMode()).toBeFalse();
    });

    it('should initialize an empty invalid form', () => {
      expect(component.productForm.invalid).toBeTrue();
    });
  });

  describe('Initialization (Edit Mode)', () => {
    beforeEach(() => {
      mockRouteParamId = '123';
    });

    it('should disable the ID control in edit mode', () => {
      // 1. ARRANGE
      productServiceSpy.getProductById.and.returnValue(of({} as any));

      // 2. ACT
      createComponent();
      fixture.detectChanges();

      // 3. ASSERT
      expect(component.productForm.get('id')?.disabled).toBeTrue();
    });

    it('should patch form with product data formatting the dates correctly', () => {
      // 1. ARRANGE
      const mockProduct = {
        id: '123', name: 'Test', description: 'Desc', logo: 'logo.png',
        date_release: '2025-05-10T00:00:00.000Z',
        date_revision: '2026-05-10T00:00:00.000Z'
      };
      productServiceSpy.getProductById.and.returnValue(of(mockProduct));

      // 2. ACT
      createComponent();
      fixture.detectChanges();

      // 3. ASSERT
      expect(component.productForm.get('date_release')?.value).toBe('2025-05-10');
    });
  });

  describe('setupDateListeners()', () => {
    beforeEach(() => {
      mockRouteParamId = null;
      createComponent();
      fixture.detectChanges();
    });

    it('should calculate date_revision to be +1 year from date_release', () => {
      // 1. ARRANGE
      const releaseControl = component.productForm.get('date_release');
      const revisionControl = component.productForm.get('date_revision');

      // 2. ACT
      releaseControl?.setValue('2025-05-10');

      // 3. ASSERT
      expect(revisionControl?.value).toBe('2026-05-10');
    });
  });

  describe('Custom Validators', () => {
    beforeEach(() => {
      mockRouteParamId = null;
      createComponent();
      fixture.detectChanges();
    });

    it('should return { minDate: true } if date is before today', () => {
      // 1. ARRANGE
      const pastDate = '2000-01-01';
      // 2. ACT
      const result = component.minDateValidator()({ value: pastDate } as any);
      // 3. ASSERT
      expect(result).toEqual({ minDate: true });
    });
  });

  describe('onSubmit()', () => {
    beforeEach(() => {
      mockRouteParamId = null;
      createComponent();
      fixture.detectChanges();
    });

    it('should mark all fields as touched if form is invalid', () => {
      component.onSubmit();
      expect(component.productForm.touched).toBeTrue();
    });

    describe('Valid Form - Create Mode', () => {
      beforeEach(() => {
        component.productForm.clearValidators();
        component.productForm.clearAsyncValidators();
        for (const key in component.productForm.controls) {
          component.productForm.get(key)?.clearValidators();
          component.productForm.get(key)?.clearAsyncValidators();
          component.productForm.get(key)?.setErrors(null);
        }
      });

      it('should navigate to root on successful creation', () => {
        // 1. ARRANGE
        productServiceSpy.createProduct.and.returnValue(of({} as any));

        // 2. ACT
        component.onSubmit();

        // 3. ASSERT
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
      });
    });

    describe('Valid Form - Edit Mode', () => {
      beforeEach(() => {
        component.isEditMode.set(true);
        component.productIdToEdit.set('123');
        component.productForm.clearValidators();
        for (const key in component.productForm.controls) {
          component.productForm.get(key)?.clearValidators();
          component.productForm.get(key)?.clearAsyncValidators();
          component.productForm.get(key)?.setErrors(null);
        }
      });

      it('should navigate to root on successful update', () => {
        // 1. ARRANGE
        productServiceSpy.updateProduct.and.returnValue(of({} as any));

        // 2. ACT
        component.onSubmit();

        // 3. ASSERT
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
      });
    });
  });

  describe('onReset()', () => {
    beforeEach(() => {
      mockRouteParamId = null;
      productServiceSpy.verifyIdExists.and.returnValue(of(false));
      createComponent();
      fixture.detectChanges();
    });

    it('should clear the form but preserve the ID in edit mode', () => {
      // 1. ARRANGE
      component.isEditMode.set(true);
      component.productForm.patchValue({ id: '123', name: 'Test' });

      // 2. ACT
      component.onReset();

      // 3. ASSERT
      expect(component.productForm.get('id')?.value).toBe('123');
    });
  });
});
