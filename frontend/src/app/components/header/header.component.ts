import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { COMPANY } from '../../data/site-data';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  company = COMPANY;
  menuOpen = false;

  navLinks = [
    { path: '/', label: 'Home', exact: true },
    { path: '/services', label: 'Services', exact: false },
    { path: '/generators', label: 'Generators', exact: false },
    { path: '/history', label: 'History', exact: false },
    { path: '/quotation', label: 'Quotation', exact: false },
    { path: '/contact', label: 'Contact', exact: false },
  ];

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }
}
