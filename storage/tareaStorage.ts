import AsyncStorage from '@react-native-async-storage/async-storage';
import { Tarea } from '../types/tarea';

const STORAGE_KEY = '@study_control_tareas';

export async function getTareas(): Promise<Tarea[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

export async function saveTarea(tarea: Tarea): Promise<void> {
  const tareas = await getTareas();
  tareas.push(tarea);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tareas));
}

export async function updateTarea(tareaActualizada: Tarea): Promise<void> {
  const tareas = await getTareas();
  const index = tareas.findIndex((t) => t.id === tareaActualizada.id);
  if (index !== -1) {
    tareas[index] = tareaActualizada;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tareas));
  }
}

export async function deleteTarea(id: string): Promise<void> {
  const tareas = await getTareas();
  const filtradas = tareas.filter((t) => t.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtradas));
}
