"use client";

import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";

import { NextAppProvider } from "@toolpad/core/nextjs";
import { SessionProvider } from "next-auth/react";
import ThemeRegistry from "@/theme/account/ThemeRegistry";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SessionProvider>
          <ThemeRegistry>
            <NextAppProvider>
              {children}
            </NextAppProvider>
          </ThemeRegistry>
        </SessionProvider>
      </body>
    </html>
  );
}
