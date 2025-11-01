// app/layout.js
export const metadata = { title: "NovaForge Pro" };

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head />
      <body>{children}</body>
    </html>
  );
}
