import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VAYUSETU: AI-Powered Climate Digital Twin of India",
  description: "Fusing INSAT satellite observations and IMD weather datasets for real-time forecasting, scenario simulation, and decision support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
