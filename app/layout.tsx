import type { Metadata, Viewport } from "next";
import { FloatingCart } from "@/components/floating-cart";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chiq-N-Grill | Order Chicken in Accra",
  description: "Order chicken combos, rice meals, reservations, and delivery from Chiq-N-Grill on Papa Monrovia Street, Accra.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Chiq Grill"
  },
  icons: {
    icon: "/icons/icon-192.svg",
    apple: "/icons/icon-192.svg"
  }
};

export const viewport: Viewport = {
  themeColor: "#d86b2b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {children}
        <FloatingCart />
        <PWAInstallPrompt />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
