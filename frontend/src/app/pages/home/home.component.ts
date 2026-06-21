import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { COMPANY, SERVICES, HIGHLIGHTS, SPECIALIST_BRANDS } from '../../data/site-data';
import { ApiService } from '../../services/api.service';
import { Generator } from '../../models/generator';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  company = COMPANY;
  services = SERVICES.slice(0, 4);
  highlights = HIGHLIGHTS;
  brands = SPECIALIST_BRANDS.filter((b) => b !== 'Other');
  featuredGenerators: Generator[] = [];

  constructor(public api: ApiService) {}

  ngOnInit(): void {
    this.api.getGenerators().subscribe({
      next: (data) => {
        this.featuredGenerators = data.slice(0, 4);
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
