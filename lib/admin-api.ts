const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
const ADMIN_TOKEN_KEY = "chiqngrill-admin-token";

export type AdminDashboard = {
  totals: {
    orders: number;
    reservations: number;
    menuItems: number;
    galleryItems: number;
    revenue: number;
  };
  recentOrders: Array<{ reference: string; customerName: string; status: string; subtotal: number; orderMode: string }>;
  recentReservations: Array<{ reference: string; name: string; status: string; date: string; time: string }>;
  homepageContent: {
    heroTitle: string;
    heroSubtitle: string;
    featuredMealId: string;
    heroImageUrl: string;
    announcement: string;
  };
  restaurant: Record<string, string | string[]>;
};

export function getAdminToken() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(ADMIN_TOKEN_KEY) || "";
}

export function saveAdminToken(token: string) {
  window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken() {
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
}

async function adminFetch<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAdminToken()}`,
        ...(options?.headers || {})
      }
    });
  } catch {
    throw new Error(`Backend is not reachable. Start the API with npm run dev:api, then test ${API_BASE.replace(/\/api$/, "")}/health`);
  }

  const payload = await response.json();

  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || "Admin request failed");
  }

  return payload.data;
}

export async function adminLogin(email: string, password: string) {
  const result = await fetch(`${API_BASE}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const payload = await result.json();
  if (!result.ok || payload.success === false) {
    throw new Error(payload.message || "Invalid admin login");
  }

  saveAdminToken(payload.data.token);
  return payload.data;
}

export async function fetchAdminDashboard() {
  return adminFetch<AdminDashboard>("/admin/dashboard");
}

export async function fetchAdminMenu() {
  return adminFetch<Array<Record<string, string | number | boolean>>>("/admin/menu");
}

export async function createAdminMenuItem(payload: Record<string, string | number | boolean>) {
  return adminFetch<Record<string, string | number | boolean>>("/admin/menu", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function updateHomepageContent(payload: Record<string, string>) {
  return adminFetch<Record<string, string>>("/admin/homepage", {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export async function updateSiteSettings(payload: Record<string, string>) {
  return adminFetch<Record<string, string>>("/admin/settings", {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export async function resetDemoData() {
  return adminFetch<{ message?: string }>("/admin/reset-demo", { method: "POST" });
}
