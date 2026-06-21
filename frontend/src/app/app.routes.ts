import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ServicesComponent } from './pages/services/services.component';
import { QuotationComponent } from './pages/quotation/quotation.component';
import { ContactComponent } from './pages/contact/contact.component';
import { GeneratorsComponent } from './pages/generators/generators.component';
import { AdminLoginComponent } from './pages/admin/admin-login/admin-login.component';
import { AdminGeneratorsComponent } from './pages/admin/admin-generators/admin-generators.component';
import { HistoryComponent } from './pages/history/history.component';
import { adminGuard, adminLoginGuard } from './guards/admin.guard';
import { COMPANY } from './data/site-data';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: `Home | ${COMPANY.shortName}` },
  { path: 'services', component: ServicesComponent, title: `Services | ${COMPANY.shortName}` },
  { path: 'generators', component: GeneratorsComponent, title: `Generators | ${COMPANY.shortName}` },
  { path: 'quotation', component: QuotationComponent, title: `Quotation | ${COMPANY.shortName}` },
  { path: 'contact', component: ContactComponent, title: `Contact | ${COMPANY.shortName}` },
  { path: 'history', component: HistoryComponent, title: `Our History | ${COMPANY.shortName}` },
  { path: 'admin/login', component: AdminLoginComponent, canActivate: [adminLoginGuard], title: `Admin Login | ${COMPANY.shortName}` },
  { path: 'admin', redirectTo: 'admin/generators', pathMatch: 'full' },
  { path: 'admin/generators', component: AdminGeneratorsComponent, canActivate: [adminGuard], title: `Admin | ${COMPANY.shortName}` },
  { path: '**', redirectTo: '' },
];
