import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

// Datos que se reciben para Agregar y Editar un medicamento
export class MedicamentoDto {
  @IsString({ message: 'nombreMedicamento debe ser texto' })
  @IsNotEmpty({ message: 'nombreMedicamento es obligatorio' })
  @MaxLength(150, { message: 'nombreMedicamento admite maximo 150 caracteres' })
  nombreMedicamento: string;

  @IsString({ message: 'laboratorio debe ser texto' })
  @IsNotEmpty({ message: 'laboratorio es obligatorio' })
  @MaxLength(100, { message: 'laboratorio admite maximo 100 caracteres' })
  laboratorio: string;

  @IsString({ message: 'presentacion debe ser texto' })
  @IsNotEmpty({ message: 'presentacion es obligatoria' })
  @MaxLength(100, { message: 'presentacion admite maximo 100 caracteres' })
  presentacion: string;

  @IsOptional()
  @IsString({ message: 'concentracion debe ser texto' })
  @MaxLength(50, { message: 'concentracion admite maximo 50 caracteres' })
  concentracion?: string;

  @IsOptional()
  @IsString({ message: 'viaAdministracion debe ser texto' })
  @MaxLength(50, { message: 'viaAdministracion admite maximo 50 caracteres' })
  viaAdministracion?: string;

  @IsInt({ message: 'existencia debe ser un numero entero' })
  @Min(0, { message: 'existencia no puede ser negativa' })
  existencia: number;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'precioCompra debe ser numerico (max. 2 decimales)' })
  @Min(0, { message: 'precioCompra no puede ser negativo' })
  precioCompra: number;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'precioVenta debe ser numerico (max. 2 decimales)' })
  @Min(0, { message: 'precioVenta no puede ser negativo' })
  precioVenta: number;

  @IsDateString({}, { message: 'fechaVencimiento debe tener formato YYYY-MM-DD' })
  fechaVencimiento: string;

  @IsOptional()
  @IsIn([0, 1], { message: 'requiereReceta debe ser 0 o 1' })
  requiereReceta?: number;

  @IsOptional()
  @IsIn([0, 1], { message: 'estado debe ser 0 o 1' })
  estado?: number;
}
