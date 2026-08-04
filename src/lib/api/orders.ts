import { apiClient } from "./client";

export interface OrderItem {
  id: number;
  product: number | null;
  product_name: string;
  product_sku: string;
  product_price: string;
  size: string;
  quantity: number;
  line_total: string;
}

export interface Order {
  id: number;
  status: string;
  subtotal: string;
  tax_amount: string;
  total_amount: string;
  address_full_name: string;
  address_phone_number: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_postal_code: string;
  address_country: string;
  razorpay_order_id: string;
  reservation_expires_at: string | null;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrdersResponse {
  count: number;
  results: Order[];
}

export const ordersApi = {
  list: () => apiClient.get<OrdersResponse>("/orders/"),
  get: (id: number) => apiClient.get<Order>(`/orders/${id}/`),
};