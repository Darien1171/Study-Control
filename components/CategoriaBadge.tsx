import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Categoria } from '../types/tarea';
import { CATEGORIAS } from '../constants/categorias';

interface Props {
  categoria: Categoria;
  pequeno?: boolean;
}

export default function CategoriaBadge({ categoria, pequeno = false }: Props) {
  const config = CATEGORIAS[categoria];
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: config.colorClaro, borderColor: config.color },
        pequeno && styles.pequeno,
      ]}
    >
      <Ionicons name={config.icono as any} size={pequeno ? 10 : 12} color={config.color} />
      <Text style={[styles.texto, { color: config.color }, pequeno && styles.textoPequeno]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  texto: {
    fontSize: 12,
    fontWeight: '600',
  },
  pequeno: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  textoPequeno: {
    fontSize: 10,
  },
});
