import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Polychat | Comunicação interna",
  description: "Plataforma de comunicação interna do Polychat para a FORD."
};

export const viewport: Viewport = {
  themeColor: "#003478",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
