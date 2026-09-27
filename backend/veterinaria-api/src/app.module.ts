import { Module } from '@nestjs/common';
import { MedicamentosModule } from './medicamentos/medicamentos.module';

@Module({
  imports: [MedicamentosModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
