import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Tarea } from '../types/tarea';
import { CATEGORIAS } from '../constants/categorias';
import CategoriaBadge from './CategoriaBadge';

interface Props {
  tarea: Tarea;
  onToggle: (id: string) => void;
  onEliminar: (id: string) => void;
}

function formatearFecha(iso: string): string {
  const fecha = new Date(iso);
  const hoy = new Date();
  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1);

  const mismoAno = fecha.getFullYear() === hoy.getFullYear();
  const esHoy =
    fecha.getDate() === hoy.getDate() &&
    fecha.getMonth() === hoy.getMonth() &&
    fecha.getFullYear() === hoy.getFullYear();
  const esManana =
    fecha.getDate() === manana.getDate() &&
    fecha.getMonth() === manana.getMonth() &&
    fecha.getFullYear() === manana.getFullYear();

  if (esHoy) return 'Hoy';
  if (esManana) return 'Mañana';

  return fecha.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
    year: mismoAno ? undefined : 'numeric',
  });
}

function estaVencida(iso: string): boolean {
  return new Date(iso) < new Date() ;
}

export default function TareaCard({ tarea, onToggle, onEliminar }: Props) {
  const router = useRouter();
  const config = CATEGORIAS[tarea.categoria];
  const vencida = !tarea.completada && estaVencida(tarea.fechaEntrega);

  const confirmarEliminar = () => {
    Alert.alert('Eliminar tarea', `¿Eliminar "${tarea.titulo}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => onEliminar(tarea.id) },
    ]);
  };

  return (
    <View style={[styles.card, tarea.completada && styles.cardCompletada, { borderLeftColor: config.color }]}>
      <TouchableOpacity style={styles.checkbox} onPress={() => onToggle(tarea.id)} activeOpacity={0.7}>
        <Ionicons
          name={tarea.completada ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={tarea.completada ? config.color : '#BDC3C7'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.contenido}
        onPress={() => router.push(`/editar/${tarea.id}`)}
        activeOpacity={0.8}
      >
        <Text style={[styles.titulo, tarea.completada && styles.tituloCompletado]} numberOfLines={1}>
          {tarea.titulo}
        </Text>

        {tarea.descripcion ? (
          <Text style={styles.descripcion} numberOfLines={1}>
            {tarea.descripcion}
          </Text>
        ) : null}

        <View style={styles.meta}>
          <CategoriaBadge categoria={tarea.categoria} pequeno />
          <View style={styles.fechaContainer}>
            <Ionicons
              name="calendar-outline"
              size={11}
              color={vencida ? '#E74C3C' : '#8395A7'}
            />
            <Text style={[styles.fecha, vencida && styles.fechaVencida]}>
              {formatearFecha(tarea.fechaEntrega)} · {tarea.horaEntrega}
            </Text>
          </View>
          {tarea.recordatorio && !tarea.completada && (
            <Ionicons name="notifications-outline" size={12} color="#8395A7" />
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={confirmarEliminar} style={styles.botonEliminar} activeOpacity={0.7}>
        <Ionicons name="trash-outline" size={18} color="#BDC3C7" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 5,
    padding: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardCompletada: {
    opacity: 0.6,
  },
  checkbox: {
    marginRight: 10,
  },
  contenido: {
    flex: 1,
    gap: 4,
  },
  titulo: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C3E50',
  },
  tituloCompletado: {
    textDecorationLine: 'line-through',
    color: '#95A5A6',
  },
  descripcion: {
    fontSize: 13,
    color: '#7F8C8D',
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
    flexWrap: 'wrap',
  },
  fechaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  fecha: {
    fontSize: 11,
    color: '#8395A7',
  },
  fechaVencida: {
    color: '#E74C3C',
    fontWeight: '600',
  },
  botonEliminar: {
    padding: 4,
    marginLeft: 8,
  },
});
