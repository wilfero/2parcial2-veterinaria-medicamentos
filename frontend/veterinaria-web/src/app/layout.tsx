import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Clínica Veterinaria - Medicamentos',
  description: 'CRUD de medicamentos con Next.js y NestJS',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
