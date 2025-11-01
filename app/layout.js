import "./globals.css";

export const metadata = {
  title: "NovaForge Pro",
  description: "AI builder using Next.js + App Router",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ minHeight: "100vh", margin: 0 }}>{children}</body>
    </html>
  );
}
