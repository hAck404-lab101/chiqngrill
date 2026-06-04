import { menuItems as fallbackMenuItems, restaurant as fallbackRestaurant } from "@/lib/restaurant-data";
import type { MenuItem } from "@/lib/restaurant-data";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

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

export type AdminLoginResponse = {
  token: string;
  admin: { email: string; role: string };
};

export type AdminDashboard = {
  totals: {
    orders: number;
    reservations: number;
    menuItems: number;
    galleryItems: number;
    revenue: number;
  };
  recentOrders: Array<{ reference: string; customerName: string; status: string; subtotal: number; orderMode: string }>;
  recentReservations: Array<{ reference: string; name: string; status: string; date: string; time: string; guests: number }>;
  homepageContent: Record<string, string>;
  restaurant: typeof fallbackRestaurant;
};

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {})
      }
    });
  } catch {
    throw new Error(`Backend is not reachable. Start the API with npm run dev:api, then test ${API_BASE.replace(/\/api$/, "")}/health`);
  }

  let payload: { success?: boolean; message?: string; data?: T };

  try {
    payload = await response.json();
  } catch {
    throw new Error("Backend returned an invalid response. Check the API server terminal for errors.");
  }

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || "Request failed");
  }

  return payload.data as T;
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}` };
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

export async function adminLogin(email: string, password: string) {
  return apiFetch<AdminLoginResponse>("/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

export async function fetchAdminMe(token: string) {
  return apiFetch<{ email: string; role: string }>("/admin/me", { headers: authHeaders(token) });
}

export async function fetchAdminDashboard(token: string) {
  return apiFetch<AdminDashboard>("/admin/dashboard", { headers: authHeaders(token) });
}

export async function fetchAdminMenu(token: string) {
  return apiFetch<MenuItem[]>("/admin/menu", { headers: authHeaders(token) });
}

export async function createAdminMenuItem(token: string, payload: Partial<MenuItem>) {
  return apiFetch<MenuItem>("/admin/menu", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  });
}

export async function updateAdminMenuItem(token: string, id: string, payload: Partial<MenuItem>) {
  return apiFetch<MenuItem>(`/admin/menu/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  });
}

export async function fetchAdminGallery(token: string) {
  return apiFetch<Array<{ id: string; title: string; category: string; imageUrl: string; isFeatured: boolean }>>("/admin/gallery", { headers: authHeaders(token) });
}

export async function createAdminGalleryItem(token: string, payload: { title: string; category?: string; imageUrl?: string; isFeatured?: boolean }) {
  return apiFetch("/admin/gallery", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  });
}

export async function updateAdminHomepage(token: string, payload: Record<string, string>) {
  return apiFetch("/admin/homepage", {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  });
}

export async function updateAdminSettings(token: string, payload: Record<string, string>) {
  return apiFetch("/admin/settings", {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(payload)
  });
}

export async function resetAdminDemoData(token: string) {
  return apiFetch("/admin/reset-demo", {
    method: "POST",
    headers: authHeaders(token)
  });
}
