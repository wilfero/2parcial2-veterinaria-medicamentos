import { Injectable } from '@nestjs/common';
import { pool } from '../common/database.config';
import { MedicamentoDto } from './dto/medicamento.dto';

// Capa de acceso a datos: cada metodo consume una funcion almacenada
@Injectable()
export class MedicamentosService {
  // Consultar todos los medicamentos
  async consultar() {
    const resultado = await pool.query('SELECT * FROM Usp_Tbl_Medicamentos_Consultar()');
    return resultado.rows;
  }

  // Buscar un medicamento por codigo
  async buscar(codigo: number) {
    const resultado = await pool.query('SELECT * FROM Usp_Tbl_Medicamentos_Buscar($1)', [codigo]);
    return resultado.rows[0] ?? null;
  }

  // Agregar un medicamento
  async agregar(dto: MedicamentoDto) {
    const resultado = await pool.query(
      'SELECT * FROM Usp_Tbl_Medicamentos_Agregar($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
      this.parametros(dto),
    );
    return resultado.rows[0];
  }

  // Editar un medicamento
  async editar(codigo: number, dto: MedicamentoDto) {
    const resultado = await pool.query(
      'SELECT * FROM Usp_Tbl_Medicamentos_Editar($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
      [codigo, ...this.parametros(dto)],
    );
    return resultado.rows[0];
  }

  // Eliminar un medicamento
  async eliminar(codigo: number) {
    const resultado = await pool.query('SELECT * FROM Usp_Tbl_Medicamentos_Eliminar($1)', [codigo]);
    return resultado.rows[0];
  }

  private parametros(dto: MedicamentoDto) {
    return [
      dto.nombreMedicamento.trim(),
      dto.laboratorio.trim(),
      dto.presentacion.trim(),
      dto.concentracion?.trim() || null,
      dto.viaAdministracion?.trim() || null,
      dto.existencia,
      dto.precioCompra,
      dto.precioVenta,
      dto.fechaVencimiento,
      dto.requiereReceta ?? 0,
      dto.estado ?? 1,
    ];
  }
}
