import Link from 'next/link';
import { Pill } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

export default function Home() {
  return (
    <MainLayout>
      <div className="dashboard-page">
        <h1>Dashboard</h1>
        <p>Bienvenido al Sistema Administrativo de la Clínica Veterinaria.</p>
        <Link href="/medicamentos/consultar" className="button-new-branch">
          <Pill size={20} aria-hidden="true" />
          <span>Ir a Medicamentos</span>
        </Link>
      </div>
    </MainLayout>
  );
}
