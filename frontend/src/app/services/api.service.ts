import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Generator, GeneratorFilter } from '../models/generator';
import { Quotation, QuotationRequest, LoginResponse, AdminUser } from '../models/quotation';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  readonly baseUrl = environment.apiUrl;
  readonly assetUrl = environment.assetUrl;

  constructor(private http: HttpClient) {}

  imageUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${this.assetUrl}${path}`;
  }

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('admin_token');
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, { username, password });
  }

  getCurrentAdmin(): Observable<{ admin: AdminUser }> {
    return this.http.get<{ admin: AdminUser }>(`${this.baseUrl}/auth/me`, {
      headers: this.authHeaders(),
    });
  }

  getGenerators(filter?: GeneratorFilter): Observable<Generator[]> {
    let params = new HttpParams();
    if (filter?.type) params = params.set('type', filter.type);
    if (filter?.brand) params = params.set('brand', filter.brand);
    if (filter?.minKVA) params = params.set('minKVA', filter.minKVA);
    if (filter?.maxKVA) params = params.set('maxKVA', filter.maxKVA);
    return this.http.get<Generator[]>(`${this.baseUrl}/generators`, { params });
  }

  getAdminGenerators(): Observable<Generator[]> {
    return this.http.get<Generator[]>(`${this.baseUrl}/generators/admin/all`, {
      headers: this.authHeaders(),
    });
  }

  getGenerator(id: number): Observable<Generator> {
    return this.http.get<Generator>(`${this.baseUrl}/generators/${id}`);
  }

  createGenerator(formData: FormData): Observable<Generator> {
    return this.http.post<Generator>(`${this.baseUrl}/generators`, formData, {
      headers: this.authHeaders(),
    });
  }

  updateGeneratorImage(id: number, formData: FormData): Observable<Generator> {
    return this.http.put<Generator>(`${this.baseUrl}/generators/${id}/image`, formData, {
      headers: this.authHeaders(),
    });
  }

  deleteGenerator(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/generators/${id}`, {
      headers: this.authHeaders(),
    });
  }

  submitQuotation(request: QuotationRequest): Observable<Quotation> {
    return this.http.post<Quotation>(`${this.baseUrl}/quotations`, request);
  }

  getQuotations(): Observable<Quotation[]> {
    return this.http.get<Quotation[]>(`${this.baseUrl}/quotations`, {
      headers: this.authHeaders(),
    });
  }

  updateQuotationStatus(id: number, status: string): Observable<Quotation> {
    return this.http.patch<Quotation>(`${this.baseUrl}/quotations/${id}/status`, { status }, {
      headers: this.authHeaders(),
    });
  }
}
