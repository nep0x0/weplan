import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/components/auth/auth-provider';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PlanWed - Beautiful Wedding Planner",
  description: "Plan your perfect wedding with our elegant, minimalist wedding planner app",
  keywords: ["wedding", "planner", "budget", "guests", "todo", "calendar"],
  authors: [{ name: "PlanWed Team" }],
  creator: "PlanWed",
  publisher: "PlanWed",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PlanWed",
  },
  openGraph: {
    type: "website",
    siteName: "PlanWed",
    title: "PlanWed - Beautiful Wedding Planner",
    description: "Plan your perfect wedding with our elegant, minimalist wedding planner app",
  },
  twitter: {
    card: "summary_large_image",
    title: "PlanWed - Beautiful Wedding Planner",
    description: "Plan your perfect wedding with our elegant, minimalist wedding planner app",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#E11D48",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
