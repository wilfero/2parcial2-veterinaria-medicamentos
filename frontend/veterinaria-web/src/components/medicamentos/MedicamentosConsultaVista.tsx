'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Pill,
  CheckCircle2,
  PauseCircle,
  FileWarning,
  Boxes,
  Search,
  Plus,
  Pencil,
  Trash2,
  Activity,
} from 'lucide-react';
import { Medicamento } from '@/interfaces/medicamentos/medicamento.interface';
import {
  buscarMedicamento,
  consultarMedicamentos,
  eliminarMedicamento,
} from '@/services/medicamentos/medicamentos.service';

const moneda = (valor: number) => `Q ${valor.toFixed(2)}`;

export default function MedicamentosConsultaVista() {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [filtro, setFiltro] = useState('');
  const [codigoBuscar, setCodigoBuscar] = useState('');
  const [mensaje, setMensaje] = useState('Cargando medicamentos...');
  const [error, setError] = useState(false);

  // ============================================================
  // CONSULTAR: carga todos los registros desde la API
  // ============================================================
  async function cargar(textoExito?: string) {
    try {
      const respuesta = await consultarMedicamentos();
      setMedicamentos(respuesta.datos);
      setMensaje(textoExito ?? respuesta.mensaje);
      setError(false);
    } catch (e) {
      setMensaje((e as Error).message);
      setError(true);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  // ============================================================
  // BUSCAR: por llave primaria usando la API Buscar
  // ============================================================
  async function buscarPorCodigo() {
    if (!codigoBuscar.trim()) {
      cargar();
      return;
    }
    try {
      const respuesta = await buscarMedicamento(Number(codigoBuscar));
      setMedicamentos([respuesta.datos]);
      setMensaje(respuesta.mensaje);
      setError(false);
    } catch (e) {
      setMedicamentos([]);
      setMensaje((e as Error).message);
      setError(true);
    }
  }

  // ============================================================
  // ELIMINAR: con confirmación
  // ============================================================
  async function eliminar(medicamento: Medicamento) {
    if (!confirm(`¿Eliminar el medicamento "${medicamento.nombreMedicamento}"?`)) return;
    try {
      const respuesta = await eliminarMedicamento(medicamento.codigoMedicamento);
      await cargar(respuesta.mensaje);
    } catch (e) {
      setMensaje((e as Error).message);
      setError(true);
    }
  }

  // Filtro local por nombre, laboratorio o presentación
  const visibles = useMemo(() => {
    const texto = filtro.trim().toLowerCase();
    if (!texto) return medicamentos;
    return medicamentos.filter((m) =>
      [m.nombreMedicamento, m.laboratorio, m.presentacion].some((v) => v.toLowerCase().includes(texto)),
    );
  }, [medicamentos, filtro]);

  const activos = medicamentos.filter((m) => m.estado === 1).length;
  const conReceta = medicamentos.filter((m) => m.requiereReceta === 1).length;
  const existenciaTotal = medicamentos.reduce((total, m) => total + m.existencia, 0);

  const resumen = [
    { etiqueta: 'Medicamentos registrados', valor: medicamentos.length, icono: Pill, color: 'summary-icon-blue' },
    { etiqueta: 'Medicamentos activos', valor: activos, icono: CheckCircle2, color: 'summary-icon-green' },
    { etiqueta: 'Medicamentos inactivos', valor: medicamentos.length - activos, icono: PauseCircle, color: 'summary-icon-yellow' },
    { etiqueta: 'Requieren receta', valor: conReceta, icono: FileWarning, color: 'summary-icon-blue' },
    { etiqueta: 'Unidades en existencia', valor: existenciaTotal, icono: Boxes, color: 'summary-icon-blue' },
  ];

  return (
    <section className="modulo-page">
      {/* ENCABEZADO */}
      <div className="modulo-hero">
        <div className="modulo-hero-text">
          <h1>Consulta de medicamentos</h1>
          <p>Administra el inventario de medicamentos de la clínica veterinaria.</p>
        </div>
        <div className="modulo-hero-decoration" aria-hidden="true">
          <div className="medical-line" />
          <Activity size={46} strokeWidth={1.4} />
          <div className="medical-circle medical-circle-one" />
          <div className="medical-circle medical-circle-two" />
          <div className="medical-circle medical-circle-three" />
        </div>
      </div>

      {/* TARJETAS DE RESUMEN */}
      <div className="summary-grid">
        {resumen.map(({ etiqueta, valor, icono: Icono, color }) => (
          <article className="summary-card" key={etiqueta}>
            <div className={`summary-icon ${color}`}>
              <Icono size={29} strokeWidth={2} aria-hidden="true" />
            </div>
            <div className="summary-info">
              <span className="summary-label">{etiqueta}</span>
              <strong className="summary-value">{valor}</strong>
            </div>
          </article>
        ))}
      </div>

      {/* LISTADO */}
      <section className="branches-panel">
        <div className="branches-panel-header">
          <div className="branches-panel-title">
            <div className="branches-title-icon">
              <Pill size={25} strokeWidth={2} aria-hidden="true" />
            </div>
            <h2>Listado de medicamentos</h2>
          </div>

          <div className="branches-toolbar">
            <div className="branches-search">
              <Search size={20} strokeWidth={2} aria-hidden="true" />
              <input
                type="search"
                placeholder="Filtrar por nombre..."
                aria-label="Filtrar medicamentos"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
              />
            </div>
            <div className="branches-search">
              <input
                type="number"
                min={1}
                placeholder="Buscar por código"
                aria-label="Buscar por código"
                value={codigoBuscar}
                onChange={(e) => setCodigoBuscar(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && buscarPorCodigo()}
              />
              <button type="button" className="action-button action-edit" onClick={buscarPorCodigo} aria-label="Buscar">
                <Search size={18} aria-hidden="true" />
              </button>
            </div>
            <Link href="/medicamentos/agregar" className="button-new-branch">
              <Plus size={21} strokeWidth={2.3} aria-hidden="true" />
              <span>Nuevo medicamento</span>
            </Link>
          </div>
        </div>

        {mensaje && (
          <div className={error ? 'alert alert-error' : 'alert alert-success'} style={{ margin: '0 26px 16px' }}>
            {mensaje}
          </div>
        )}

        <div className="branches-table-container">
          <table className="branches-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Medicamento</th>
                <th>Laboratorio</th>
                <th>Presentación</th>
                <th>Vía</th>
                <th>Existencia</th>
                <th>P. Compra</th>
                <th>P. Venta</th>
                <th>Vencimiento</th>
                <th>Receta</th>
                <th>Estado</th>
                <th className="actions-column">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibles.length === 0 && (
                <tr>
                  <td colSpan={12} className="table-empty">No hay medicamentos para mostrar.</td>
                </tr>
              )}
              {visibles.map((m) => (
                <tr key={m.codigoMedicamento}>
                  <td>{m.codigoMedicamento}</td>
                  <td>
                    {m.nombreMedicamento}
                    {m.concentracion && <small style={{ display: 'block', opacity: 0.7 }}>{m.concentracion}</small>}
                  </td>
                  <td>{m.laboratorio}</td>
                  <td>{m.presentacion}</td>
                  <td>{m.viaAdministracion ?? '-'}</td>
                  <td>{m.existencia}</td>
                  <td>{moneda(m.precioCompra)}</td>
                  <td>{moneda(m.precioVenta)}</td>
                  <td>{m.fechaVencimiento}</td>
                  <td>{m.requiereReceta === 1 ? 'Sí' : 'No'}</td>
                  <td>
                    <span className={m.estado === 1 ? 'status-badge status-active' : 'status-badge status-inactive'}>
                      <span className="status-dot" aria-hidden="true" />
                      {m.estado === 1 ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link
                        href={`/medicamentos/editar/${m.codigoMedicamento}`}
                        className="action-button action-edit"
                        aria-label={`Editar ${m.nombreMedicamento}`}
                      >
                        <Pencil size={18} strokeWidth={2.2} aria-hidden="true" />
                      </Link>
                      <button
                        type="button"
                        className="action-button action-delete"
                        aria-label={`Eliminar ${m.nombreMedicamento}`}
                        onClick={() => eliminar(m)}
                      >
                        <Trash2 size={18} strokeWidth={2.2} aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="branches-table-footer">
          <p>
            Mostrando {visibles.length} de {medicamentos.length} resultados
          </p>
        </div>
      </section>
    </section>
  );
}
