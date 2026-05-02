import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import { Tarea, TareaFormData } from '../types/tarea';
import { getTareas, saveTarea, updateTarea, deleteTarea } from '../storage/tareaStorage';
import { programarNotificacion, cancelarNotificacion } from '../hooks/useNotificaciones';

// ─── Helpers ────────────────────────────────────────────────────────────────

function generarId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function combinarFechaHora(fecha: Date, hora: Date): Date {
  const d = new Date(fecha);
  d.setHours(hora.getHours(), hora.getMinutes(), 0, 0);
  return d;
}

function formatHora(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

// ─── Tipos ──────────────────────────────────────────────────────────────────

interface TareasContextType {
  tareas: Tarea[];
  cargando: boolean;
  agregar: (form: TareaFormData) => Promise<void>;
  editar: (id: string, form: TareaFormData) => Promise<void>;
  toggleCompletada: (id: string) => Promise<void>;
  eliminar: (id: string) => Promise<void>;
  recargar: () => Promise<void>;
}

// ─── Contexto ───────────────────────────────────────────────────────────────

const TareasContext = createContext<TareasContextType | null>(null);

// ─── Provider ───────────────────────────────────────────────────────────────

export function TareasProvider({ children }: { children: ReactNode }) {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [cargando, setCargando] = useState(true);

  // ref para acceder al estado actual dentro de callbacks sin stale closure
  const tareasRef = useRef(tareas);
  useEffect(() => { tareasRef.current = tareas; }, [tareas]);

  const recargar = useCallback(async () => {
    const data = await getTareas();
    setTareas(data);
    setCargando(false);
  }, []);

  useEffect(() => { recargar(); }, [recargar]);

  // ── Agregar ─────────────────────────────────────────────────────────────

  const agregar = useCallback(async (form: TareaFormData): Promise<void> => {
    const fechaCompleta = combinarFechaHora(form.fechaEntrega, form.horaEntrega);
    const id = generarId();

    let notificacionId: string | undefined;
    if (form.recordatorio) {
      try {
        notificacionId = await programarNotificacion(
          id, form.titulo, form.categoria, fechaCompleta, form.tiempoRecordatorio
        );
      } catch { /* notificaciones no disponibles en Expo Go */ }
    }

    const nueva: Tarea = {
      id,
      titulo: form.titulo,
      descripcion: form.descripcion,
      categoria: form.categoria,
      fechaEntrega: fechaCompleta.toISOString(),
      horaEntrega: formatHora(form.horaEntrega),
      recordatorio: form.recordatorio,
      tiempoRecordatorio: form.tiempoRecordatorio,
      notificacionId,
      completada: false,
      creadaEn: new Date().toISOString(),
    };

    await saveTarea(nueva);
    setTareas((prev) => [...prev, nueva]);
  }, []);

  // ── Editar ──────────────────────────────────────────────────────────────

  const editar = useCallback(async (id: string, form: TareaFormData): Promise<void> => {
    const tareaActual = tareasRef.current.find((t) => t.id === id);
    if (!tareaActual) return;

    if (tareaActual.notificacionId) {
      try { await cancelarNotificacion(tareaActual.notificacionId); } catch { }
    }

    const fechaCompleta = combinarFechaHora(form.fechaEntrega, form.horaEntrega);
    let notificacionId: string | undefined;
    if (form.recordatorio) {
      try {
        notificacionId = await programarNotificacion(
          id, form.titulo, form.categoria, fechaCompleta, form.tiempoRecordatorio
        );
      } catch { }
    }

    const actualizada: Tarea = {
      ...tareaActual,
      titulo: form.titulo,
      descripcion: form.descripcion,
      categoria: form.categoria,
      fechaEntrega: fechaCompleta.toISOString(),
      horaEntrega: formatHora(form.horaEntrega),
      recordatorio: form.recordatorio,
      tiempoRecordatorio: form.tiempoRecordatorio,
      notificacionId,
    };

    await updateTarea(actualizada);
    setTareas((prev) => prev.map((t) => (t.id === id ? actualizada : t)));
  }, []);

  // ── Toggle completada ────────────────────────────────────────────────────

  const toggleCompletada = useCallback(async (id: string): Promise<void> => {
    const tarea = tareasRef.current.find((t) => t.id === id);
    if (!tarea) return;

    const actualizada = { ...tarea, completada: !tarea.completada };
    if (actualizada.completada && tarea.notificacionId) {
      try { await cancelarNotificacion(tarea.notificacionId); } catch { }
      actualizada.notificacionId = undefined;
    }

    await updateTarea(actualizada);
    setTareas((prev) => prev.map((t) => (t.id === id ? actualizada : t)));
  }, []);

  // ── Eliminar ─────────────────────────────────────────────────────────────

  const eliminar = useCallback(async (id: string): Promise<void> => {
    const tarea = tareasRef.current.find((t) => t.id === id);
    if (tarea?.notificacionId) {
      try { await cancelarNotificacion(tarea.notificacionId); } catch { }
    }
    await deleteTarea(id);
    setTareas((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <TareasContext.Provider
      value={{ tareas, cargando, agregar, editar, toggleCompletada, eliminar, recargar }}
    >
      {children}
    </TareasContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useTareas() {
  const ctx = useContext(TareasContext);
  if (!ctx) throw new Error('useTareas debe usarse dentro de <TareasProvider>');
  return ctx;
}
