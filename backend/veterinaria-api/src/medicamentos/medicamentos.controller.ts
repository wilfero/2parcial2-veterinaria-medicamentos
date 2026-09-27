import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { MedicamentosService } from './medicamentos.service';
import { MedicamentoDto } from './dto/medicamento.dto';
import { RespuestaApi } from '../common/interfaces/respuesta.interface';

const codigoPipe = new ParseIntPipe({
  exceptionFactory: () =>
    new HttpException(
      { exito: 0, mensaje: 'El codigo del medicamento debe ser un numero entero.', datos: null },
      HttpStatus.BAD_REQUEST,
    ),
});

@Controller()
export class MedicamentosController {
  constructor(private readonly medicamentosService: MedicamentosService) {}

  // GET /api/medicamentosConsultar
  @Get('medicamentosConsultar')
  async consultar(): Promise<RespuestaApi<any[]>> {
    try {
      const datos = await this.medicamentosService.consultar();
      return { exito: 1, mensaje: 'Medicamentos consultados correctamente.', datos };
    } catch (error) {
      throw this.errorServidor('consultar los medicamentos', error);
    }
  }

  // GET /api/medicamentosBuscar/:codigo
  @Get('medicamentosBuscar/:codigo')
  async buscar(@Param('codigo', codigoPipe) codigo: number): Promise<RespuestaApi<any>> {
    let datos;
    try {
      datos = await this.medicamentosService.buscar(codigo);
    } catch (error) {
      throw this.errorServidor('buscar el medicamento', error);
    }
    if (!datos) {
      throw new HttpException(
        { exito: 0, mensaje: `No existe el medicamento con codigo ${codigo}.`, datos: null },
        HttpStatus.NOT_FOUND,
      );
    }
    return { exito: 1, mensaje: 'Medicamento encontrado.', datos };
  }

  // POST /api/medicamentosAgregar
  @Post('medicamentosAgregar')
  async agregar(@Body() dto: MedicamentoDto): Promise<RespuestaApi<any>> {
    let resultado;
    try {
      resultado = await this.medicamentosService.agregar(dto);
    } catch (error) {
      throw this.errorServidor('agregar el medicamento', error);
    }
    return this.responder(resultado, { codigoMedicamento: resultado.codigoMedicamento });
  }

  // PUT /api/medicamentosEditar/:codigo
  @Put('medicamentosEditar/:codigo')
  async editar(
    @Param('codigo', codigoPipe) codigo: number,
    @Body() dto: MedicamentoDto,
  ): Promise<RespuestaApi<any>> {
    let resultado;
    try {
      resultado = await this.medicamentosService.editar(codigo, dto);
    } catch (error) {
      throw this.errorServidor('editar el medicamento', error);
    }
    return this.responder(resultado, { codigoMedicamento: codigo });
  }

  // DELETE /api/medicamentosEliminar/:codigo
  @Delete('medicamentosEliminar/:codigo')
  async eliminar(@Param('codigo', codigoPipe) codigo: number): Promise<RespuestaApi<any>> {
    let resultado;
    try {
      resultado = await this.medicamentosService.eliminar(codigo);
    } catch (error) {
      throw this.errorServidor('eliminar el medicamento', error);
    }
    return this.responder(resultado, { codigoMedicamento: codigo });
  }

  // Convierte la respuesta de la funcion almacenada (exito 1 / 0 / -1) en respuesta HTTP
  private responder(resultado: { exito: number; mensaje: string }, datos: any) {
    if (resultado.exito === 1) {
      return { exito: 1, mensaje: resultado.mensaje, datos };
    }
    const estado = resultado.exito === 0 ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;
    throw new HttpException({ exito: 0, mensaje: resultado.mensaje, datos: null }, estado);
  }

  private errorServidor(accion: string, error: any) {
    return new HttpException(
      { exito: 0, mensaje: `Ocurrio un error al ${accion}: ${error.message}`, datos: null },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
