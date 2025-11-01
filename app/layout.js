// app/layout.js
import "./globals.css";

export const metadata = {
  title: "NovaForge Pro",
  description: "AI app builder with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
