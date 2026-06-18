import type { Metadata } from "next";
import "./globals.css";
import { fontBody, fontHeading } from "./fonts";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Ahmad Farid Setiawan — Barber Portfolio",
  description: "Precision Cuts. Timeless Style.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${fontHeading.variable} ${fontBody.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-cream">
        {children}
        <Toaster
          richColors
          position="top-right"
          toastOptions={{
            style: {
              background: "#0D0D0D",
              color: "#F5ECD7",
              border: "1px solid rgba(201,168,76,0.25)",
            },
          }}
        />
      </body>
    </html>
  );
}
