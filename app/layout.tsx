import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Time Series Forecasting App",
  description: "Upload CSV data and generate time-series predictions with interactive visualizations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
