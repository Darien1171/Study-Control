import { TiempoRecordatorio } from '../types/tarea';

export async function solicitarPermisos(): Promise<boolean> {
  return false;
}

export async function programarNotificacion(
  _id: string,
  _titulo: string,
  _categoria: string,
  _fechaEntrega: Date,
  _minutosAntes: TiempoRecordatorio
): Promise<string | undefined> {
  return undefined;
}

export async function cancelarNotificacion(_notificacionId: string): Promise<void> {}
