import {
  Medicamento,
  MedicamentoFormulario,
  RespuestaApi,
} from '@/interfaces/medicamentos/medicamento.interface';

const API_URL = 'http://localhost:3000/api';

// Ejecuta la peticion y devuelve el JSON; si la API responde error, lanza su mensaje
async function peticion<T>(ruta: string, opciones: RequestInit = {}): Promise<RespuestaApi<T>> {
  let respuesta: Response;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      ...opciones,
    });
  } catch {
    throw new Error('No fue posible conectar con el backend (http://localhost:3000).');
  }

  const json = await respuesta.json();
  if (!respuesta.ok || json.exito !== 1) {
    throw new Error(json.mensaje ?? 'Ocurrio un error en la solicitud.');
  }
  return json;
}

export function consultarMedicamentos() {
  return peticion<Medicamento[]>('/medicamentosConsultar', { method: 'GET' });
}

export function buscarMedicamento(codigo: number) {
  return peticion<Medicamento>(`/medicamentosBuscar/${codigo}`, { method: 'GET' });
}

export function agregarMedicamento(datos: MedicamentoFormulario) {
  return peticion<{ codigoMedicamento: number }>('/medicamentosAgregar', {
    method: 'POST',
    body: JSON.stringify(datos),
  });
}

export function editarMedicamento(codigo: number, datos: MedicamentoFormulario) {
  return peticion<{ codigoMedicamento: number }>(`/medicamentosEditar/${codigo}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  });
}

export function eliminarMedicamento(codigo: number) {
  return peticion<{ codigoMedicamento: number }>(`/medicamentosEliminar/${codigo}`, {
    method: 'DELETE',
  });
}
