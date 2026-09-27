'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Pill,
  FileText,
  Plus,
  PawPrint,
  Stethoscope,
  CalendarDays,
  UserRound,
  Settings,
  ChevronDown,
} from 'lucide-react';

export default function Sidebar() {
  // ============================================================
  // OBTENER LA RUTA ACTUAL DEL SISTEMA
  // ============================================================
  const pathname = usePathname();

  // ============================================================
  // ESTADO DEL SUBMENÚ MEDICAMENTOS (true = abierto)
  // ============================================================
  const [medicamentosAbierto, setMedicamentosAbierto] = useState(true);

  // ============================================================
  // DETERMINAR QUÉ OPCIÓN ESTÁ ACTIVA
  // ============================================================
  const dashboardActivo = pathname === '/';
  const consultarActivo =
    pathname === '/medicamentos/consultar' || pathname.startsWith('/medicamentos/editar');
  const agregarActivo = pathname === '/medicamentos/agregar';

  return (
    <aside className="sidebar">
      <nav className="sidebar-menu" aria-label="Menú principal">
        {/* DASHBOARD */}
        <Link href="/" className={dashboardActivo ? 'sidebar-link sidebar-link-active' : 'sidebar-link'}>
          <LayoutDashboard size={21} strokeWidth={2} aria-hidden="true" />
          <span>Dashboard</span>
        </Link>

        {/* MÓDULO MEDICAMENTOS */}
        <div className="sidebar-module">
          <button
            type="button"
            className="sidebar-module-title"
            onClick={() => setMedicamentosAbierto(!medicamentosAbierto)}
            aria-expanded={medicamentosAbierto}
            aria-controls="submenu-medicamentos"
          >
            <Pill size={21} strokeWidth={2} aria-hidden="true" />
            <span>Medicamentos</span>
            <ChevronDown
              className={medicamentosAbierto ? 'sidebar-arrow sidebar-arrow-open' : 'sidebar-arrow'}
              size={18}
              strokeWidth={2}
              aria-hidden="true"
            />
          </button>

          {medicamentosAbierto && (
            <div id="submenu-medicamentos" className="sidebar-submenu">
              <Link
                href="/medicamentos/consultar"
                className={consultarActivo ? 'sidebar-sublink sidebar-sublink-active' : 'sidebar-sublink'}
              >
                <FileText size={19} strokeWidth={2} aria-hidden="true" />
                <span>Consultar</span>
              </Link>
              <Link
                href="/medicamentos/agregar"
                className={agregarActivo ? 'sidebar-sublink sidebar-sublink-active' : 'sidebar-sublink'}
              >
                <Plus size={20} strokeWidth={2.2} aria-hidden="true" />
                <span>Agregar</span>
              </Link>
            </div>
          )}
        </div>

        <div className="sidebar-divider" aria-hidden="true" />

        {/* OTROS MÓDULOS (visuales) */}
        <Link href="#" className="sidebar-link">
          <PawPrint size={21} strokeWidth={2} aria-hidden="true" />
          <span>Mascotas</span>
        </Link>
        <Link href="#" className="sidebar-link">
          <Stethoscope size={21} strokeWidth={2} aria-hidden="true" />
          <span>Veterinarios</span>
        </Link>
        <Link href="#" className="sidebar-link">
          <CalendarDays size={21} strokeWidth={2} aria-hidden="true" />
          <span>Citas</span>
        </Link>
        <Link href="#" className="sidebar-link">
          <UserRound size={21} strokeWidth={2} aria-hidden="true" />
          <span>Clientes</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <Link href="#" className="sidebar-link">
          <Settings size={21} strokeWidth={2} aria-hidden="true" />
          <span>Configuración</span>
        </Link>
      </div>
    </aside>
  );
}
