import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { TiempoRecordatorio } from '../types/tarea';

export async function solicitarPermisos(): Promise<boolean> {
  // Se configura aquí, después de que el runtime esté listo
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('recordatorios', {
      name: 'Recordatorios de tareas',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function programarNotificacion(
  id: string,
  titulo: string,
  categoria: string,
  fechaEntrega: Date,
  minutosAntes: TiempoRecordatorio
): Promise<string | undefined> {
  const fechaNotificacion = new Date(fechaEntrega.getTime() - minutosAntes * 60 * 1000);
  if (fechaNotificacion <= new Date()) return undefined;

  const notifId = await Notifications.scheduleNotificationAsync({
    content: {
      title: `Recordatorio: ${titulo}`,
      body: `Tu ${categoria} vence pronto. No olvides entregarla!`,
      data: { tareaId: id },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: fechaNotificacion,
    },
  });
  return notifId;
}

export async function cancelarNotificacion(notificacionId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificacionId);
}
