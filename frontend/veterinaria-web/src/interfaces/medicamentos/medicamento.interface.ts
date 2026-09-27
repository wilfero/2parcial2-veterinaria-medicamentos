export interface Medicamento {
  codigoMedicamento: number;
  nombreMedicamento: string;
  laboratorio: string;
  presentacion: string;
  concentracion: string | null;
  viaAdministracion: string | null;
  existencia: number;
  precioCompra: number;
  precioVenta: number;
  fechaVencimiento: string;
  requiereReceta: number;
  estado: number;
}

// Datos que se envian para Agregar y Editar
export type MedicamentoFormulario = Omit<Medicamento, 'codigoMedicamento'>;

export interface RespuestaApi<T> {
  exito: number;
  mensaje: string;
  datos: T;
}
