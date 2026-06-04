import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideRouter } from '@angular/router';

describe('AppComponent', () => {
  beforeEach(async () => {
    // 1. ARRANGE
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  describe('Component Initialization', () => {
    it('should create the app', () => {
      // 1. ARRANGE
      const fixture = TestBed.createComponent(AppComponent);

      // 2. ACT
      const app = fixture.componentInstance;

      // 3. ASSERT
      expect(app).toBeTruthy();
    });

    it('should render the header title BANCO', () => {
      // 1. ARRANGE
      const fixture = TestBed.createComponent(AppComponent);

      // 2. ACT
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      // 3. ASSERT
      expect(compiled.querySelector('.bank-title')?.textContent).toContain('BANCO');
    });
  });
});
