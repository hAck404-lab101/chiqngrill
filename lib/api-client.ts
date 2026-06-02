import { menuItems as fallbackMenuItems, restaurant as fallbackRestaurant } from "@/lib/restaurant-data";
import type { MenuItem } from "@/lib/restaurant-data";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export type OrderPayload = {
  customerName: string;
  phone: string;
  orderMode: string;
  deliveryAddress?: string;
  notes?: string;
  items: Array<{ menuItemId: string; quantity: number }>;
};

export type ReservationPayload = {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  occasion?: string;
  notes?: string;
};

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {})
    }
  });

  const payload = await response.json();

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || "Request failed");
  }

  return payload.data;
}

export async function fetchMenu(): Promise<MenuItem[]> {
  try {
    return await apiFetch<MenuItem[]>("/menu");
  } catch {
    return fallbackMenuItems;
  }
}

export async function fetchRestaurant() {
  try {
    return await apiFetch<typeof fallbackRestaurant>("/menu/restaurant");
  } catch {
    return fallbackRestaurant;
  }
}

export async function createOrder(payload: OrderPayload) {
  return apiFetch<{
    reference: string;
    subtotal: number;
    status: string;
    orderMode: string;
  }>("/orders", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function createReservation(payload: ReservationPayload) {
  return apiFetch<{
    reference: string;
    status: string;
    date: string;
    time: string;
  }>("/reservations", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function fetchOrder(reference: string) {
  return apiFetch<{
    reference: string;
    status: string;
    subtotal: number;
    orderMode: string;
    items: Array<{ name: string; quantity: number; lineTotal: number }>;
  }>(`/orders/${encodeURIComponent(reference)}`);
}

export async function fetchDashboard() {
  return apiFetch<{
    totals: {
      menuItems: number;
      orders: number;
      reservations: number;
      todaysOrders: number;
      todaysRevenue: number;
    };
    recentOrders: Array<{ reference: string; customerName: string; status: string; subtotal: number }>;
    recentReservations: Array<{ reference: string; name: string; status: string; date: string; time: string }>;
  }>("/dashboard");
}
