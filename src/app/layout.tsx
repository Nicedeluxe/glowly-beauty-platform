import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import { BookingProvider } from "../contexts/BookingContext";

// Sofia Pro font
const sofiaPro = {
  variable: "--font-sofia-pro",
  family: "Sofia Pro",
  src: [
    {
      path: "https://fonts.gstatic.com/s/sofiapro/v1/3JnySDDxiSz32j4YQVIb2hZmBvI.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "https://fonts.gstatic.com/s/sofiapro/v1/3JnySDDxiSz32j4YQVIb2hZmBvI.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "https://fonts.gstatic.com/s/sofiapro/v1/3JnySDDxiSz32j4YQVIb2hZmBvI.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "https://fonts.gstatic.com/s/sofiapro/v1/3JnySDDxiSz32j4YQVIb2hZmBvI.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "https://fonts.gstatic.com/s/sofiapro/v1/3JnySDDxiSz32j4YQVIb2hZmBvI.woff2",
      weight: "700",
      style: "normal",
    },
  ],
};

export const metadata: Metadata = {
  title: "Glowly - Платформа для запису до майстрів краси",
  description: "Знайдіть найкращих майстрів краси та запишіться на процедури онлайн",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body
        className={`${sofiaPro.variable} antialiased`}
        style={{ fontFamily: 'Sofia Pro, sans-serif' }}
      >
        <AuthProvider>
          <BookingProvider>
            {children}
          </BookingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
