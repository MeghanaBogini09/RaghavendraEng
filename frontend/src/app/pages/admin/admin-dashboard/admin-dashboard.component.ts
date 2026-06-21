import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { Quotation } from '../../../models/quotation';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  quotations: Quotation[] = [];
  loading = true;
  error = '';
  selected: Quotation | null = null;
  statusOptions = ['Pending', 'Reviewed', 'Quoted', 'Closed'];

  constructor(
    public auth: AuthService,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.loadQuotations();
  }

  loadQuotations(): void {
    this.loading = true;
    this.api.getQuotations().subscribe({
      next: (data) => {
        this.quotations = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load quotations. Ensure you are logged in and the API is running.';
        this.loading = false;
      },
    });
  }

  viewDetails(q: Quotation): void {
    this.selected = this.selected?.id === q.id ? null : q;
  }

  updateStatus(id: number, status: string): void {
    this.api.updateQuotationStatus(id, status).subscribe({
      next: (updated) => {
        const idx = this.quotations.findIndex((q) => q.id === id);
        if (idx >= 0) this.quotations[idx] = updated;
        if (this.selected?.id === id) this.selected = updated;
      },
    });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('en-IN');
  }
}
