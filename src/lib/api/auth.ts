import { apiClient } from "./client";

export interface AuthUser {
  id: number;
  email: string;
  phone_number: string;
  is_staff: boolean;
  is_email_verified: boolean;
  created_at: string;
}

export interface VerifyOtpResponse {
  access: string;
  refresh: string;
  user: AuthUser;
}

export interface Address {
  id: number;
  full_name: string;
  phone_number: string;
  street_address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

export type AddressPayload = Omit<Address, "id">;

export const authApi = {
  /** POST /api/auth/otp/request/ — sends a 6-digit login code to the email. */
  requestOtp: (email: string) =>
    apiClient.post<{ detail: string }>("/auth/otp/request/", { email }),

  /** POST /api/auth/otp/verify/ — verifies the code; creates the account on first login. */
  verifyOtp: (email: string, code: string) =>
    apiClient.post<VerifyOtpResponse>("/auth/otp/verify/", { email, code }),

  /** POST /api/auth/admin/login/ — email+password login for staff/admin users. */
  adminLogin: (email: string, password: string) =>
    apiClient.post<VerifyOtpResponse>("/auth/admin/login/", { email, password }),

  /** POST /api/auth/logout/ — blacklists the refresh token server-side. */
  logout: (refresh: string) => apiClient.post("/auth/logout/", { refresh }),

  /** GET /api/auth/me/ */
  me: () => apiClient.get<AuthUser>("/auth/me/"),

  /** PATCH /api/auth/me/ — email is read-only on the backend, only phone_number can change. */
  updateMe: (payload: Partial<Pick<AuthUser, "phone_number">>) =>
    apiClient.patch<AuthUser>("/auth/me/", payload),

  /** GET /api/auth/addresses/ */
  listAddresses: () => apiClient.get<Address[] | { results: Address[] }>("/auth/addresses/"),

  /** POST /api/auth/addresses/ */
  createAddress: (payload: AddressPayload) => apiClient.post<Address>("/auth/addresses/", payload),

  /** PATCH /api/auth/addresses/{id}/ */
  updateAddress: (id: number, payload: Partial<AddressPayload>) =>
    apiClient.patch<Address>(`/auth/addresses/${id}/`, payload),

  /** DELETE /api/auth/addresses/{id}/ */
  deleteAddress: (id: number) => apiClient.delete(`/auth/addresses/${id}/`),
};
