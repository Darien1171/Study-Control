import React, { useState, useMemo } from 'react';
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
import { Categoria } from '../types/tarea';
import TareaCard from '../components/TareaCard';
import EstadoVacio from '../components/EstadoVacio';

type FiltroEstado = 'todas' | 'pendientes' | 'completadas';

export default function TareasScreen() {
  const router = useRouter();
  const { tareas, cargando, toggleCompletada, eliminar } = useTareas();
  const [filtroCategoria, setFiltroCategoria] = useState<Categoria | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>('pendientes');

  const tareasFiltradas = useMemo(() => {
    let resultado = [...tareas];

    if (filtroCategoria) {
      resultado = resultado.filter((t) => t.categoria === filtroCategoria);
    }

    if (filtroEstado === 'pendientes') {
      resultado = resultado.filter((t) => !t.completada);
    } else if (filtroEstado === 'completadas') {
      resultado = resultado.filter((t) => t.completada);
    }

    return resultado.sort(
      (a, b) => new Date(a.fechaEntrega).getTime() - new Date(b.fechaEntrega).getTime()
    );
  }, [tareas, filtroCategoria, filtroEstado]);

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#4A90D9" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.contenedor} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Mis Tareas</Text>
        <Text style={styles.subtitulo}>{tareasFiltradas.length} {tareasFiltradas.length === 1 ? 'tarea' : 'tareas'}</Text>
      </View>

      {/* Filtro de estado */}
      <View style={styles.filtroEstadoContainer}>
        {(['pendientes', 'todas', 'completadas'] as FiltroEstado[]).map((estado) => (
          <TouchableOpacity
            key={estado}
            style={[styles.filtroEstadoBtn, filtroEstado === estado && styles.filtroEstadoBtnActivo]}
            onPress={() => setFiltroEstado(estado)}
            activeOpacity={0.8}
          >
            <Text style={[styles.filtroEstadoTexto, filtroEstado === estado && styles.filtroEstadoTextoActivo]}>
              {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Filtros de categoría */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtroCatScroll}
        contentContainerStyle={styles.filtroCatContenido}
      >
        <TouchableOpacity
          style={[styles.filtroCatBtn, filtroCategoria === null && styles.filtroCatBtnActivo]}
          onPress={() => setFiltroCategoria(null)}
          activeOpacity={0.8}
        >
          <Text style={[styles.filtroCatTexto, filtroCategoria === null && styles.filtroCatTextoActivo]}>
            Todas
          </Text>
        </TouchableOpacity>

        {LISTA_CATEGORIAS.map((cat) => {
          const config = CATEGORIAS[cat];
          const activo = filtroCategoria === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.filtroCatBtn,
                activo && { backgroundColor: config.color, borderColor: config.color },
                !activo && { borderColor: config.color },
              ]}
              onPress={() => setFiltroCategoria(activo ? null : cat)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={config.icono as any}
                size={13}
                color={activo ? '#fff' : config.color}
              />
              <Text style={[styles.filtroCatTexto, activo ? { color: '#fff' } : { color: config.color }]}>
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Lista */}
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        {tareasFiltradas.length === 0 ? (
          <EstadoVacio
            mensaje={filtroEstado === 'completadas' ? 'Nada completado aún' : 'Sin tareas aquí'}
            submensaje={filtroEstado === 'completadas' ? 'Completa tareas para verlas acá' : 'Presiona + para agregar una tarea'}
          />
        ) : (
          tareasFiltradas.map((t) => (
            <TareaCard key={t.id} tarea={t} onToggle={toggleCompletada} onEliminar={eliminar} />
          ))
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

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#F5F7FA' },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 },
  titulo: { fontSize: 26, fontWeight: '700', color: '#2C3E50' },
  subtitulo: { fontSize: 13, color: '#8395A7', marginTop: 2 },
  filtroEstadoContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#E8ECF0',
    borderRadius: 10,
    padding: 3,
  },
  filtroEstadoBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 8,
  },
  filtroEstadoBtnActivo: { backgroundColor: '#fff', elevation: 2 },
  filtroEstadoTexto: { fontSize: 13, color: '#8395A7', fontWeight: '500' },
  filtroEstadoTextoActivo: { color: '#2C3E50', fontWeight: '700' },
  filtroCatScroll: { marginTop: 10, maxHeight: 44 },
  filtroCatContenido: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
    paddingVertical: 4,
  },
  filtroCatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#BDC3C7',
  },
  filtroCatBtnActivo: { backgroundColor: '#2C3E50', borderColor: '#2C3E50' },
  filtroCatTexto: { fontSize: 13, fontWeight: '600', color: '#7F8C8D' },
  filtroCatTextoActivo: { color: '#fff' },
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
