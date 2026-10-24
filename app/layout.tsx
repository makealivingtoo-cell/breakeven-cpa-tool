import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lead Recovery Snapshot | Home-Service Funnel Audit",
  description: "A fixed-price 48-hour audit for home-service businesses: find conversion leaks, improve inquiry flow, strengthen quote follow-up, and fix local/AI visibility gaps.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
