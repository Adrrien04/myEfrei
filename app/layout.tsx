import "@/app/ui/global.css";
import { inter } from "@/app/ui/fonts";

export const metadata = {
  title: "myEfrei",
  description: "myEfrei",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
      <html lang="en">
      <head />
      <body className={`${inter.className} antialiased`}>{children}</body>
      </html>
  );
}
