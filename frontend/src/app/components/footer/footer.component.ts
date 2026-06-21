import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { COMPANY } from '../../data/site-data';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  company = COMPANY;
  currentYear = new Date().getFullYear();
}
