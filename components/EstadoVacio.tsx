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
      <Ionicons name="checkmark-circle-outline" size={64} color="#C8D6E5" />
      <Text style={styles.mensaje}>{mensaje}</Text>
      <Text style={styles.submensaje}>{submensaje}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 40,
  },
  mensaje: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8395A7',
    textAlign: 'center',
  },
  submensaje: {
    fontSize: 14,
    color: '#B2BEC3',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
