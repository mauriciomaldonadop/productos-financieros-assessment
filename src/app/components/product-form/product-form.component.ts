import {Component, inject, OnInit, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule ],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  productForm!: FormGroup;
  isEditMode = signal(false);
  productIdToEdit = signal<string | null>(null);

  ngOnInit(): void {
    this.initForm();
    this.setupDateListeners();
    this.checkEditMode();
  }
  initForm(): void {
    this.productForm = this.fb.group({
      id: ['',
        [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
        [this.idExistsValidator()]
      ],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', [Validators.required, this.minDateValidator()]],
      date_revision: [{ value: '', disabled: true }, Validators.required]
    });
  }

  setupDateListeners(): void {
    this.productForm.get('date_release')?.valueChanges.subscribe(date => {
      if (date) {
        const releaseDate = new Date(date);
        releaseDate.setFullYear(releaseDate.getFullYear() + 1);
        const revisionDateStr = releaseDate.toISOString().split('T')[0];
        this.productForm.patchValue({ date_revision: revisionDateStr });
      } else {
        this.productForm.patchValue({ date_revision: '' });
      }
    });
  }

  minDateValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      const today = new Date().toISOString().split('T')[0];
      return control.value < today ? { minDate: true } : null;
    };
  }

  idExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (this.isEditMode() || !control.value) return of(null);
      return this.productService.verifyIdExists(control.value).pipe(
        map(exists => (exists ? { idExists: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  hasError(field: string, errorType: string): boolean {
    const control = this.productForm.get(field);
    return !!(control?.hasError(errorType) && control?.touched);
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const productData = this.productForm.getRawValue();

      if (this.isEditMode()) {
        this.productService.updateProduct(this.productIdToEdit()!, productData).subscribe({
          next: () => this.router.navigate(['/']),
          error: () => alert('Error al actualizar el producto')
        });
      } else {
        this.productService.createProduct(productData).subscribe({
          next: () => this.router.navigate(['/']),
          error: () => alert('Error al crear el producto')
        });
      }
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  onReset(): void {
    if (this.isEditMode()) {
      const currentId = this.productForm.getRawValue().id;
      this.productForm.reset({ id: currentId });
    } else {
      this.productForm.reset();
    }
  }

  checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.productIdToEdit.set(id);

      this.productForm.get('id')?.disable();

      this.productService.getProductById(id).subscribe({
        next: (product) => {
          const formattedProduct = {
            ...product,
            date_release: product.date_release ? product.date_release.split('T')[0] : '',
            date_revision: product.date_revision ? product.date_revision.split('T')[0] : ''
          };
          this.productForm.patchValue(formattedProduct);
        },
        error: (err) => {
          console.error('Error al obtener el producto', err);
          alert('No se pudo cargar la información del producto.');
          this.router.navigate(['/']);
        }
      });
    }
  }
}

