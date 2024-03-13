import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/provider/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import ModalProvider from "@/provider/modal-provider";

const inter = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Builder",
  description: "All in one Agency Solution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ModalProvider>{children}
          <Toaster />
          </ModalProvider>
         
        </ThemeProvider>
      </body>
    </html>
  );
}
