// Formato estandar de respuesta JSON de la API
export interface RespuestaApi<T> {
  exito: number;
  mensaje: string;
  datos: T;
}
