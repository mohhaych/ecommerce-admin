// layout.js
"use client";

import { SessionProvider } from "next-auth/react";
import './globals.css'; // Import global styles if any

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
