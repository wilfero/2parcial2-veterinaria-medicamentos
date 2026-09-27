import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ============================================================
  // PERMITIR COMUNICACION CON EL FRONTEND NEXT.JS
  // ============================================================
  app.enableCors({
    origin: 'http://localhost:3001',
  });

  // Configurar prefijo global para la API
  app.setGlobalPrefix('api');

  // Validar los datos obligatorios recibidos por las API
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
      exceptionFactory: (errores) =>
        new BadRequestException({
          exito: 0,
          mensaje: 'Datos invalidos: ' + errores.map((e) => Object.values(e.constraints ?? {}).join(', ')).join('; '),
          datos: null,
        }),
    }),
  );

  // Iniciar el servidor en el puerto 3000
  await app.listen(3000);
  console.log('Servidor Veterinaria corriendo en http://localhost:3000/api');
}
bootstrap();
