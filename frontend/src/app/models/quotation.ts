export interface QuotationRequest {
  quotationNo: string;
  customerName: string;
  email?: string;
  phone: string;
  company?: string;
  address: string;
  brand?: string;
  equipmentDetails?: string;
  powerKVA?: string;
  selectedServices: string[];
  message?: string;
  urgency?: string;
}

export interface Quotation extends QuotationRequest {
  id: number;
  status: string;
  createdAt: string;
}

export interface AdminUser {
  id: number;
  username: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  admin: AdminUser;
}
