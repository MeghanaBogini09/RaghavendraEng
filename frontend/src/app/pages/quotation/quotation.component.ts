import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  COMPANY,
  QUOTATION_SERVICES,
  SPECIALIST_BRANDS,
  QuotationRecord,
} from '../../data/site-data';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-quotation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './quotation.component.html',
  styleUrl: './quotation.component.scss',
})
export class QuotationComponent implements OnInit {
  company = COMPANY;
  serviceOptions = QUOTATION_SERVICES;
  brands = SPECIALIST_BRANDS;
  form!: FormGroup;
  selectedServiceIds = new Set<string>();
  quotation: QuotationRecord | null = null;
  showForm = true;
  submitting = false;
  submitError = '';

  urgencyOptions = ['Normal', 'Urgent', 'Emergency'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      customerName: ['', [Validators.required, Validators.minLength(2)]],
      company: [''],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s]{10,15}$/)]],
      email: ['', Validators.email],
      address: ['', Validators.required],
      brand: ['Cummins', Validators.required],
      equipmentDetails: [''],
      powerKVA: [''],
      message: [''],
      urgency: ['Normal'],
    });

    this.route.queryParams.subscribe((params) => {
      if (params['service']) {
        const serviceParam = params['service'] as string;
        const match = this.serviceOptions.find(
          (s) => s.name === serviceParam || s.id === serviceParam
        );
        if (match) {
          this.selectedServiceIds.add(match.id);
        } else if (serviceParam.includes('Second Hand')) {
          this.selectedServiceIds.add('sh-sale');
          this.selectedServiceIds.add('sh-purchase');
        }
      }
    });
  }

  toggleService(id: string): void {
    if (this.selectedServiceIds.has(id)) {
      this.selectedServiceIds.delete(id);
    } else {
      this.selectedServiceIds.add(id);
    }
  }

  isServiceSelected(id: string): boolean {
    return this.selectedServiceIds.has(id);
  }

  get selectedServiceNames(): string[] {
    return this.serviceOptions
      .filter((s) => this.selectedServiceIds.has(s.id))
      .map((s) => s.name);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.selectedServiceIds.size === 0) {
      return;
    }

    const v = this.form.value;
    const quotationNo = this.generateQuotationNo();
    const record: QuotationRecord = {
      quotationNo,
      date: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      customerName: v.customerName,
      company: v.company || '—',
      phone: v.phone,
      email: v.email || '—',
      address: v.address,
      brand: v.brand,
      equipmentDetails: v.equipmentDetails || '—',
      powerKVA: v.powerKVA || '—',
      selectedServices: this.selectedServiceNames,
      message: v.message || '—',
      urgency: v.urgency,
    };

    this.submitting = true;
    this.submitError = '';

    this.api.submitQuotation({
      quotationNo,
      customerName: v.customerName,
      email: v.email || undefined,
      phone: v.phone,
      company: v.company || undefined,
      address: v.address,
      brand: v.brand,
      equipmentDetails: v.equipmentDetails || undefined,
      powerKVA: v.powerKVA || undefined,
      selectedServices: this.selectedServiceNames,
      message: v.message || undefined,
      urgency: v.urgency,
    }).subscribe({
      next: () => {
        this.quotation = record;
        this.showForm = false;
        this.submitting = false;
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
      },
      error: () => {
        this.submitting = false;
        this.submitError = 'Could not save your request. Please ensure the server is running and try again.';
      },
    });
  }

  printQuotation(): void {
    window.print();
  }

  newQuotation(): void {
    this.quotation = null;
    this.showForm = true;
    this.selectedServiceIds.clear();
    this.form.reset({ brand: 'Cummins', urgency: 'Normal' });
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }

  private generateQuotationNo(): string {
    const d = new Date();
    const datePart = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
    const seq = String(Math.floor(Math.random() * 9000) + 1000);
    return `SRES/QR/${datePart}/${seq}`;
  }
}
