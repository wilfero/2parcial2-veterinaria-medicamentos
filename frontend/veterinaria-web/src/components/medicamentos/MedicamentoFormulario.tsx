'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Activity } from 'lucide-react';
import { MedicamentoFormulario as Datos } from '@/interfaces/medicamentos/medicamento.interface';
import {
  agregarMedicamento,
  buscarMedicamento,
  editarMedicamento,
} from '@/services/medicamentos/medicamentos.service';

const vacio: Datos = {
  nombreMedicamento: '',
  laboratorio: '',
  presentacion: '',
  concentracion: '',
  viaAdministracion: '',
  existencia: 0,
  precioCompra: 0,
  precioVenta: 0,
  fechaVencimiento: '',
  requiereReceta: 0,
  estado: 1,
};

interface Props {
  // Si viene codigo, el formulario funciona en modo Editar
  codigo?: number;
}

export default function MedicamentoFormulario({ codigo }: Props) {
  const router = useRouter();
  const editando = codigo !== undefined;
  const [datos, setDatos] = useState<Datos>(vacio);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // En modo Editar se cargan los datos con la API Buscar
  useEffect(() => {
    if (!editando) return;
    buscarMedicamento(codigo)
      .then((respuesta) => {
        const { codigoMedicamento, ...resto } = respuesta.datos;
        void codigoMedicamento;
        setDatos({ ...resto, concentracion: resto.concentracion ?? '', viaAdministracion: resto.viaAdministracion ?? '' });
      })
      .catch((e: Error) => {
        setMensaje(e.message);
        setError(true);
      });
  }, [codigo, editando]);

  function cambiar<K extends keyof Datos>(campo: K, valor: Datos[K]) {
    setDatos((anterior) => ({ ...anterior, [campo]: valor }));
  }

  async function guardar(evento: FormEvent) {
    evento.preventDefault();
    setGuardando(true);
    try {
      const respuesta = editando
        ? await editarMedicamento(codigo, datos)
        : await agregarMedicamento(datos);
      setMensaje(respuesta.mensaje);
      setError(false);
      if (!editando) setDatos(vacio);
      setTimeout(() => router.push('/medicamentos/consultar'), 900);
    } catch (e) {
      setMensaje((e as Error).message);
      setError(true);
    } finally {
      setGuardando(false);
    }
  }

  const texto = (campo: keyof Datos, etiqueta: string, obligatorio = false, max = 100) => (
    <div className="form-field">
      <label htmlFor={campo}>
        {etiqueta} {obligatorio && <span className="form-required">*</span>}
      </label>
      <input
        id={campo}
        type="text"
        required={obligatorio}
        maxLength={max}
        value={datos[campo] as string}
        onChange={(e) => cambiar(campo, e.target.value as never)}
      />
    </div>
  );

  const numero = (campo: keyof Datos, etiqueta: string, paso = '1') => (
    <div className="form-field">
      <label htmlFor={campo}>
        {etiqueta} <span className="form-required">*</span>
      </label>
      <input
        id={campo}
        type="number"
        required
        min={0}
        step={paso}
        value={datos[campo] as number}
        onChange={(e) => cambiar(campo, Number(e.target.value) as never)}
      />
    </div>
  );

  return (
    <section className="modulo-page">
      <div className="modulo-hero">
        <div className="modulo-hero-text">
          <h1>{editando ? `Editar medicamento #${codigo}` : 'Agregar medicamento'}</h1>
          <p>{editando ? 'Modifica los datos del medicamento.' : 'Registra un nuevo medicamento en el inventario.'}</p>
        </div>
        <div className="modulo-hero-decoration" aria-hidden="true">
          <div className="medical-line" />
          <Activity size={46} strokeWidth={1.4} />
          <div className="medical-circle medical-circle-one" />
          <div className="medical-circle medical-circle-two" />
          <div className="medical-circle medical-circle-three" />
        </div>
      </div>

      <form className="form-panel" onSubmit={guardar}>
        <div className="form-grid">
          {texto('nombreMedicamento', 'Nombre del medicamento', true, 150)}
          {texto('laboratorio', 'Laboratorio', true)}
          {texto('presentacion', 'Presentación', true)}
          {texto('concentracion', 'Concentración', false, 50)}
          {texto('viaAdministracion', 'Vía de administración', false, 50)}
          {numero('existencia', 'Existencia')}
          {numero('precioCompra', 'Precio de compra (Q)', '0.01')}
          {numero('precioVenta', 'Precio de venta (Q)', '0.01')}
          <div className="form-field">
            <label htmlFor="fechaVencimiento">
              Fecha de vencimiento <span className="form-required">*</span>
            </label>
            <input
              id="fechaVencimiento"
              type="date"
              required
              value={datos.fechaVencimiento}
              onChange={(e) => cambiar('fechaVencimiento', e.target.value)}
            />
          </div>
          <div className="form-field">
            <label htmlFor="requiereReceta">Requiere receta</label>
            <select
              id="requiereReceta"
              value={datos.requiereReceta}
              onChange={(e) => cambiar('requiereReceta', Number(e.target.value))}
            >
              <option value={0}>No</option>
              <option value={1}>Sí</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="estado">Estado</label>
            <select id="estado" value={datos.estado} onChange={(e) => cambiar('estado', Number(e.target.value))}>
              <option value={1}>Activo</option>
              <option value={0}>Inactivo</option>
            </select>
          </div>
        </div>

        {mensaje && <div className={error ? 'alert alert-error' : 'alert alert-success'}>{mensaje}</div>}

        <div className="form-actions">
          <Link href="/medicamentos/consultar" className="button-secondary">
            <ArrowLeft size={19} aria-hidden="true" />
            Regresar
          </Link>
          <button type="submit" className="button-new-branch" disabled={guardando}>
            <Save size={20} aria-hidden="true" />
            <span>{guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Agregar medicamento'}</span>
          </button>
        </div>
      </form>
    </section>
  );
}
