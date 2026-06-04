"use client";

import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/bottom-nav";
import { FloatingCart } from "@/components/floating-cart";
import { PWAInstallPrompt } from "@/components/pwa-install-prompt";

export function CustomerShell() {
  const pathname = usePathname();
  const isAdminArea = pathname.startsWith("/admin") || pathname.startsWith("/kitchen");

  if (isAdminArea) return null;

  return (
    <>
      <FloatingCart />
      <PWAInstallPrompt />
      <BottomNav />
    </>
  );
}
