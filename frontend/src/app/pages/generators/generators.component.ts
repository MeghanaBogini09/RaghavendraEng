import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Generator, GeneratorFilter } from '../../models/generator';

@Component({
  selector: 'app-generators',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './generators.component.html',
  styleUrl: './generators.component.scss',
})
export class GeneratorsComponent implements OnInit {
  generators: Generator[] = [];
  loading = true;
  loadError = '';
  filter: GeneratorFilter = {};

  types = ['', 'Diesel', 'Gas', 'Portable'];
  brands = ['', 'Cummins', 'Kirloskar', 'Caterpillar', 'Ashok Leyland', 'Mahindra', 'Rustom'];

  constructor(public api: ApiService) {}

  ngOnInit(): void {
    this.loadGenerators();
  }

  loadGenerators(): void {
    this.loading = true;
    this.loadError = '';
    this.api.getGenerators(this.filter).subscribe({
      next: (data) => {
        this.generators = data;
        this.loading = false;
      },
      error: () => {
        this.generators = [];
        this.loading = false;
        this.loadError = 'Cannot reach the server. Start the backend (port 3000) and MySQL, then refresh.';
      },
    });
  }

  applyFilter(): void {
    this.loadGenerators();
  }

  clearFilter(): void {
    this.filter = {};
    this.loadGenerators();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  }

  imageSrc(gen: Generator): string {
    return this.api.imageUrl(gen.imageUrl);
  }
}
