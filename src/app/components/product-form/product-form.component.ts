import {Component, inject, OnInit} from '@angular/core';
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
import { Router } from '@angular/router';
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

  productForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.setupDateListeners();
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
      if (!control.value) return of(null);
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
      const newProduct = this.productForm.getRawValue();
      this.productService.createProduct(newProduct).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => alert('Error al crear el producto')
      });
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  onReset(): void {
    this.productForm.reset();
  }
}

