import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chiq-N-Grill | Bold Chicken. Smooth Vibes.",
  description:
    "Premium chicken and grill restaurant web app concept for Chiq-N-Grill on Papa Monrovia Street, Accra."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
