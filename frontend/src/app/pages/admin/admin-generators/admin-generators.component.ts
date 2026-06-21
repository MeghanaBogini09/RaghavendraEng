import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Generator } from '../../../models/generator';
import { Quotation } from '../../../models/quotation';

@Component({
  selector: 'app-admin-generators',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-generators.component.html',
  styleUrl: './admin-generators.component.scss',
})
export class AdminGeneratorsComponent implements OnInit {
  activeTab: 'generators' | 'quotations' = 'generators';

  form!: FormGroup;
  generators: Generator[] = [];
  loading = true;
  submitting = false;
  error = '';
  success = '';
  selectedFile: File | null = null;
  previewUrl = '';

  quotations: Quotation[] = [];
  quotationsLoading = true;
  quotationsError = '';
  selectedQuotation: Quotation | null = null;
  statusOptions = ['Pending', 'Reviewed', 'Quoted', 'Closed'];

  types = ['Diesel', 'Gas', 'Portable'];
  brands = ['Cummins', 'Kirloskar', 'Caterpillar', 'Ashok Leyland', 'Mahindra', 'Rustom'];

  constructor(
    public auth: AuthService,
    private api: ApiService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      brand: ['Cummins', Validators.required],
      type: ['Diesel', Validators.required],
      powerKVA: ['', [Validators.required, Validators.min(1)]],
      frequency: ['50Hz'],
      description: ['', Validators.required],
      price: ['0'],
    });
    this.loadGenerators();
    this.loadQuotations();
  }

  setTab(tab: 'generators' | 'quotations'): void {
    this.activeTab = tab;
    this.error = '';
    this.success = '';
  }

  loadQuotations(): void {
    this.quotationsLoading = true;
    this.api.getQuotations().subscribe({
      next: (data) => {
        this.quotations = data;
        this.quotationsLoading = false;
      },
      error: () => {
        this.quotationsError = 'Failed to load quotation requests.';
        this.quotationsLoading = false;
      },
    });
  }

  viewQuotationDetails(q: Quotation): void {
    this.selectedQuotation = this.selectedQuotation?.id === q.id ? null : q;
  }

  updateQuotationStatus(id: number, status: string): void {
    this.api.updateQuotationStatus(id, status).subscribe({
      next: (updated) => {
        const idx = this.quotations.findIndex((q) => q.id === id);
        if (idx >= 0) this.quotations[idx] = updated;
        if (this.selectedQuotation?.id === id) this.selectedQuotation = updated;
      },
    });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('en-IN');
  }

  get pendingQuotationCount(): number {
    return this.quotations.filter((q) => q.status === 'Pending').length;
  }

  loadGenerators(): void {
    this.loading = true;
    this.api.getAdminGenerators().subscribe({
      next: (data) => {
        this.generators = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load generators.';
        this.loading = false;
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.selectedFile = file;
    this.previewUrl = URL.createObjectURL(file);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.error = '';
    this.success = '';

    const formData = new FormData();
    Object.entries(this.form.value).forEach(([key, value]) => {
      formData.append(key, String(value ?? ''));
    });
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.api.createGenerator(formData).subscribe({
      next: () => {
        this.submitting = false;
        this.success = 'Generator added successfully. It is now visible on the website.';
        this.form.reset({ brand: 'Cummins', type: 'Diesel', frequency: '50Hz', price: '0' });
        this.selectedFile = null;
        this.previewUrl = '';
        this.loadGenerators();
      },
      error: (err) => {
        this.submitting = false;
        this.error = err.error?.error || 'Failed to add generator.';
      },
    });
  }

  onUpdateImage(id: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    this.api.updateGeneratorImage(id, formData).subscribe({
      next: () => {
        this.success = 'Image updated.';
        this.loadGenerators();
      },
      error: () => {
        this.error = 'Failed to update image.';
      },
    });
  }

  removeGenerator(id: number): void {
    if (!confirm('Remove this generator from the website?')) return;

    this.api.deleteGenerator(id).subscribe({
      next: () => {
        this.success = 'Generator removed.';
        this.loadGenerators();
      },
      error: () => {
        this.error = 'Failed to remove generator.';
      },
    });
  }

  imageSrc(gen: Generator): string {
    return this.api.imageUrl(gen.imageUrl);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  }
}
