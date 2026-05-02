import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTareas } from '../hooks/useTareas';
import { CATEGORIAS, LISTA_CATEGORIAS } from '../constants/categorias';
import TareaCard from '../components/TareaCard';
import EstadoVacio from '../components/EstadoVacio';
import { Tarea } from '../types/tarea';

function esHoy(iso: string): boolean {
  const fecha = new Date(iso);
  const hoy = new Date();
  return (
    fecha.getDate() === hoy.getDate() &&
    fecha.getMonth() === hoy.getMonth() &&
    fecha.getFullYear() === hoy.getFullYear()
  );
}

function esProximos7Dias(iso: string): boolean {
  const fecha = new Date(iso);
  const hoy = new Date();
  const en7dias = new Date(hoy);
  en7dias.setDate(hoy.getDate() + 7);
  return fecha > hoy && fecha <= en7dias;
}

function getDiaSemana(): string {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return dias[new Date().getDay()];
}

function getFechaLarga(): string {
  return new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function HomeScreen() {
  const router = useRouter();
  const { tareas, cargando, toggleCompletada, eliminar } = useTareas();

  const tareasHoy = useMemo(
    () => tareas.filter((t) => !t.completada && esHoy(t.fechaEntrega)),
    [tareas]
  );

  const tareasProximas = useMemo(
    () => tareas.filter((t) => !t.completada && esProximos7Dias(t.fechaEntrega)),
    [tareas]
  );

  const totalPendientes = tareas.filter((t) => !t.completada).length;
  const totalCompletadas = tareas.filter((t) => t.completada).length;

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#4A90D9" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.contenedor} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.saludo}>{getDiaSemana()}</Text>
            <Text style={styles.fecha}>{getFechaLarga()}</Text>
          </View>
          <View style={styles.statsHeader}>
            <View style={styles.statBadge}>
              <Text style={styles.statNumero}>{totalPendientes}</Text>
              <Text style={styles.statLabel}>pendientes</Text>
            </View>
            <View style={[styles.statBadge, styles.statCompletada]}>
              <Text style={[styles.statNumero, { color: '#2ECC71' }]}>{totalCompletadas}</Text>
              <Text style={styles.statLabel}>listas</Text>
            </View>
          </View>
        </View>

        {/* Resumen por categoría */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriasScroll} contentContainerStyle={styles.categoriasContenido}>
          {LISTA_CATEGORIAS.map((cat) => {
            const cantidad = tareas.filter((t) => t.categoria === cat && !t.completada).length;
            const config = CATEGORIAS[cat];
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoriaCard, { backgroundColor: config.colorClaro, borderColor: config.color }]}
                onPress={() => router.push('/tareas')}
                activeOpacity={0.8}
              >
                <Ionicons name={config.icono as any} size={20} color={config.color} />
                <Text style={[styles.categoriaNumero, { color: config.color }]}>{cantidad}</Text>
                <Text style={[styles.categoriaLabel, { color: config.color }]}>{config.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Tareas de hoy */}
        <SectionHeader titulo="Hoy" cantidad={tareasHoy.length} />
        {tareasHoy.length === 0 ? (
          <EstadoVacio mensaje="¡No tienes tareas para hoy!" submensaje="Disfruta tu día 🎉" />
        ) : (
          tareasHoy.map((t) => (
            <TareaCard key={t.id} tarea={t} onToggle={toggleCompletada} onEliminar={eliminar} />
          ))
        )}

        {/* Próximas */}
        {tareasProximas.length > 0 && (
          <>
            <SectionHeader titulo="Próximos 7 días" cantidad={tareasProximas.length} />
            {tareasProximas.map((t) => (
              <TareaCard key={t.id} tarea={t} onToggle={toggleCompletada} onEliminar={eliminar} />
            ))}
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/agregar')} activeOpacity={0.85}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function SectionHeader({ titulo, cantidad }: { titulo: string; cantidad: number }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitulo}>{titulo}</Text>
      {cantidad > 0 && (
        <View style={styles.sectionBadge}>
          <Text style={styles.sectionBadgeTexto}>{cantidad}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#F5F7FA' },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  saludo: { fontSize: 26, fontWeight: '700', color: '#2C3E50' },
  fecha: { fontSize: 13, color: '#8395A7', marginTop: 2 },
  statsHeader: { flexDirection: 'row', gap: 8 },
  statBadge: {
    alignItems: 'center',
    backgroundColor: '#EBF4FF',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statCompletada: { backgroundColor: '#E8FAF0' },
  statNumero: { fontSize: 20, fontWeight: '700', color: '#4A90D9' },
  statLabel: { fontSize: 10, color: '#8395A7' },
  categoriasScroll: { marginTop: 4 },
  categoriasContenido: { paddingHorizontal: 16, gap: 10 },
  categoriaCard: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minWidth: 80,
    gap: 4,
  },
  categoriaNumero: { fontSize: 20, fontWeight: '700' },
  categoriaLabel: { fontSize: 11, fontWeight: '500' },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionTitulo: { fontSize: 17, fontWeight: '700', color: '#2C3E50' },
  sectionBadge: {
    backgroundColor: '#4A90D9',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  sectionBadgeTexto: { fontSize: 11, fontWeight: '700', color: '#fff' },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#4A90D9',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#4A90D9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
});
