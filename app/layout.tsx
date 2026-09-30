import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "./toast-provider";

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Personal Expense Tracker for managing income and expenses.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-surface text-text-primary">
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
