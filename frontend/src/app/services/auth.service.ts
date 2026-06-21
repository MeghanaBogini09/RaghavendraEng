import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AdminUser } from '../models/quotation';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private adminSubject = new BehaviorSubject<AdminUser | null>(null);
  admin$ = this.adminSubject.asObservable();

  constructor(
    private api: ApiService,
    private router: Router
  ) {
    const token = localStorage.getItem('admin_token');
    if (token) {
      this.api.getCurrentAdmin().subscribe({
        next: (res) => this.adminSubject.next(res.admin),
        error: () => this.logout(),
      });
    }
  }

  login(username: string, password: string): Observable<unknown> {
    return this.api.login(username, password).pipe(
      tap((res) => {
        localStorage.setItem('admin_token', res.token);
        this.adminSubject.next(res.admin);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('admin_token');
    this.adminSubject.next(null);
    this.router.navigate(['/admin/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('admin_token');
  }

  getAdmin(): AdminUser | null {
    return this.adminSubject.value;
  }
}
