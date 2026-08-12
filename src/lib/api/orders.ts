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

export interface CartItemProductSummary {
  id: number;
  name: string;
  slug: string;
  sku: string;
  image_url: string | null;
  is_active: boolean;
}

export interface CartItem {
  id: number;
  product: number;
  product_detail?: CartItemProductSummary;
  size: string;
  quantity: number;
  unit_price: string;
  line_total: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total_amount: string;
  total_items: number;
  updated_at: string;
}

export interface RazorpayOrderInfo {
  razorpay_order_id: string;
  amount: number;
  currency: string;
  key_id: string;
}

export interface CheckoutResponse {
  order: Order;
  razorpay: RazorpayOrderInfo;
}

export interface PaymentVerifyPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const ordersApi = {
  list: () => apiClient.get<OrdersResponse>("/orders/"),
  get: (id: number) => apiClient.get<Order>(`/orders/${id}/`),
};

export const cartApi = {
  /** GET /api/orders/cart/ — Returns current user's cart */
  getCart: () => apiClient.get<Cart>("/orders/cart/"),

  /** POST /api/orders/cart/items/ — Add item to cart */
  addItem: (productId: number, size = "", quantity = 1) =>
    apiClient.post<Cart>("/orders/cart/items/", { product_id: productId, size, quantity }),

  /** PATCH /api/orders/cart/items/{id}/ — Update item quantity */
  updateItem: (itemId: number, quantity: number) =>
    apiClient.patch<Cart>(`/orders/cart/items/${itemId}/`, { quantity }),

  /** DELETE /api/orders/cart/items/{id}/ — Remove item from cart */
  removeItem: (itemId: number) =>
    apiClient.delete<Cart>(`/orders/cart/items/${itemId}/`),

  /** POST /api/orders/checkout/ — Create order from cart with chosen address ID */
  checkout: (addressId: number) =>
    apiClient.post<CheckoutResponse>("/orders/checkout/", { address_id: addressId }),
};

export const paymentsApi = {
  /** POST /api/payments/verify/ — Verify Razorpay payment signature server-side */
  verifyPayment: (payload: PaymentVerifyPayload) =>
    apiClient.post<Order>("/payments/verify/", payload),
};