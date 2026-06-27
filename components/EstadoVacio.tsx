import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  mensaje?: string;
  submensaje?: string;
}

export default function EstadoVacio({
  mensaje = 'Sin tareas pendientes',
  submensaje = 'Presiona + para agregar una nueva tarea',
}: Props) {
  return (
    <View style={styles.contenedor}>
      <View style={styles.icono}>
        <Ionicons name="checkmark-circle-outline" size={48} color="#C8D6E5" />
      </View>
      <Text style={styles.mensaje}>{mensaje}</Text>
      <Text style={styles.submensaje}>{submensaje}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 40,
    marginHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#E8ECF0',
    borderStyle: 'dashed',
    marginTop: 12,
  },
  icono: {
    width: 80,
    height: 80,
    backgroundColor: '#EBF4FF',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  mensaje: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8395A7',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  submensaje: {
    fontSize: 14,
    color: '#B2BEC3',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
