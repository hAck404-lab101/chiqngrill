const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
const API_ORIGIN = API_BASE.replace(/\/api$/, "");
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

export type AdminMenuItem = Record<string, string | number | boolean>;
export type AdminGalleryItem = Record<string, string | boolean>;
export type AdminOrder = Record<string, string | number | boolean | Array<Record<string, string | number>>>;
export type AdminReservation = Record<string, string | number>;

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

export function resolveAssetUrl(url?: string) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) return url;
  return `${API_ORIGIN}${url.startsWith("/") ? url : `/${url}`}`;
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

export async function uploadAdminImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  let response: Response;

  try {
    response = await fetch(`${API_BASE}/uploads/image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAdminToken()}`
      },
      body: formData
    });
  } catch {
    throw new Error(`Backend is not reachable. Start the API with npm run dev:api, then test ${API_BASE.replace(/\/api$/, "")}/health`);
  }

  const payload = await response.json();
  if (!response.ok || payload.success === false) {
    throw new Error(payload.message || "Image upload failed");
  }
  return payload.data as { fileName: string; fileUrl: string; size: number; mimeType: string };
}

export async function fetchAdminDashboard() {
  return adminFetch<AdminDashboard>("/admin/dashboard");
}

export async function fetchAdminMenu() {
  return adminFetch<AdminMenuItem[]>("/admin/menu");
}

export async function createAdminMenuItem(payload: Record<string, string | number | boolean>) {
  return adminFetch<AdminMenuItem>("/admin/menu", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function updateAdminMenuItem(id: string, payload: Record<string, string | number | boolean>) {
  return adminFetch<AdminMenuItem>(`/admin/menu/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export async function deleteAdminMenuItem(id: string) {
  return adminFetch<AdminMenuItem>(`/admin/menu/${encodeURIComponent(id)}`, {
    method: "DELETE"
  });
}

export async function fetchAdminGallery() {
  return adminFetch<AdminGalleryItem[]>("/admin/gallery");
}

export async function createAdminGalleryItem(payload: Record<string, string | boolean>) {
  return adminFetch<AdminGalleryItem>("/admin/gallery", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function updateAdminGalleryItem(id: string, payload: Record<string, string | boolean>) {
  return adminFetch<AdminGalleryItem>(`/admin/gallery/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export async function fetchHomepageContent() {
  return adminFetch<Record<string, string>>("/admin/homepage");
}

export async function updateHomepageContent(payload: Record<string, string>) {
  return adminFetch<Record<string, string>>("/admin/homepage", {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export async function fetchSiteSettings() {
  return adminFetch<Record<string, string | string[]>>("/admin/settings");
}

export async function updateSiteSettings(payload: Record<string, string>) {
  return adminFetch<Record<string, string>>("/admin/settings", {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export async function fetchAdminOrders() {
  return adminFetch<AdminOrder[]>("/admin/orders");
}

export async function fetchAdminReservations() {
  return adminFetch<AdminReservation[]>("/admin/reservations");
}

export async function resetDemoData() {
  return adminFetch<{ message?: string }>("/admin/reset-demo", { method: "POST" });
}
