import MainLayout from '@/components/layout/MainLayout';
import MedicamentoFormulario from '@/components/medicamentos/MedicamentoFormulario';

export default async function EditarMedicamentoPage({ params }: PageProps<'/medicamentos/editar/[codigo]'>) {
  const { codigo } = await params;
  return (
    <MainLayout>
      <MedicamentoFormulario codigo={Number(codigo)} />
    </MainLayout>
  );
}
