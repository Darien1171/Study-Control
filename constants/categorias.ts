import { Categoria } from '../types/tarea';

export interface ConfigCategoria {
  label: string;
  color: string;
  colorClaro: string;
  icono: string;
}

export const CATEGORIAS: Record<Categoria, ConfigCategoria> = {
  tarea: {
    label: 'Tarea',
    color: '#4A90D9',
    colorClaro: '#EBF4FF',
    icono: 'create-outline',
  },
  trabajo: {
    label: 'Trabajo',
    color: '#7B68EE',
    colorClaro: '#F0EEFF',
    icono: 'document-text-outline',
  },
  evaluacion: {
    label: 'Evaluación',
    color: '#E74C3C',
    colorClaro: '#FEECEB',
    icono: 'bar-chart-outline',
  },
  actividad: {
    label: 'Actividad',
    color: '#2ECC71',
    colorClaro: '#E8FAF0',
    icono: 'flag-outline',
  },
};

export const LISTA_CATEGORIAS: Categoria[] = ['tarea', 'trabajo', 'evaluacion', 'actividad'];

export const OPCIONES_RECORDATORIO: { label: string; value: number }[] = [
  { label: '15 minutos antes', value: 15 },
  { label: '30 minutos antes', value: 30 },
  { label: '1 hora antes', value: 60 },
  { label: '1 día antes', value: 1440 },
];
