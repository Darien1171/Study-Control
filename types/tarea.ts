export type Categoria = 'tarea' | 'trabajo' | 'evaluacion' | 'actividad';

export type TiempoRecordatorio = 15 | 30 | 60 | 1440;

export interface Tarea {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: Categoria;
  fechaEntrega: string;       // ISO string
  horaEntrega: string;        // "HH:mm"
  recordatorio: boolean;
  tiempoRecordatorio: TiempoRecordatorio; // minutos antes
  notificacionId?: string;    // ID de expo-notifications
  completada: boolean;
  creadaEn: string;           // ISO string
}

export interface TareaFormData {
  titulo: string;
  descripcion: string;
  categoria: Categoria;
  fechaEntrega: Date;
  horaEntrega: Date;
  recordatorio: boolean;
  tiempoRecordatorio: TiempoRecordatorio;
}
