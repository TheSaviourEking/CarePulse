import type { Metadata } from "next";
import localFont from "next/font/local";
// import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

import { cn } from "@/lib/utils";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });

// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

// const fontSans = Plus_Jakarta_Sans({
//   subsets: ['latin'],
//   weight: ['200', '300', '400', '500', '600', '700'],
//   variable: '--font-sans'
// })

const fontSans = localFont({
  src: './fonts/Plus_Jakarta_Sans.woff2',
  weight: "200 300 400 500 600 700",
  variable: '--font-sans'
})

export const metadata: Metadata = {
  title: "CarePulse",
  description: "A healthcare management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <body className={`${geistSans.variable} ${geistMono.variable} ${fontSans.variable} antialiased`}> */}
      <body className={cn('min-h-screen bg-dark-300 font-sans antialiased', fontSans.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
        // enableSystem
        // disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
