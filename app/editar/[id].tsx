import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTareas } from '../../hooks/useTareas';
import { CATEGORIAS, LISTA_CATEGORIAS, OPCIONES_RECORDATORIO } from '../../constants/categorias';
import { Categoria, TiempoRecordatorio } from '../../types/tarea';
import DatePickerField from '../../components/DatePickerField';

export default function EditarScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tareas, editar } = useTareas();

  const tarea = tareas.find((t) => t.id === id);

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState<Categoria>('tarea');
  const [fechaEntrega, setFechaEntrega] = useState(new Date());
  const [horaEntrega, setHoraEntrega] = useState(new Date());
  const [recordatorio, setRecordatorio] = useState(false);
  const [tiempoRecordatorio, setTiempoRecordatorio] = useState<TiempoRecordatorio>(30);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (tarea) {
      setTitulo(tarea.titulo);
      setDescripcion(tarea.descripcion);
      setCategoria(tarea.categoria);
      const fecha = new Date(tarea.fechaEntrega);
      setFechaEntrega(fecha);
      setHoraEntrega(fecha);
      setRecordatorio(tarea.recordatorio);
      setTiempoRecordatorio(tarea.tiempoRecordatorio);
    }
  }, [tarea]);

  if (!tarea) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#4A90D9" />
      </View>
    );
  }

  const formatearFecha = (d: Date) =>
    d.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'long' });

  const formatearHora = (d: Date) =>
    d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true });

  const guardar = async () => {
    if (!titulo.trim()) {
      Alert.alert('Campo requerido', 'Ingresa un título para la tarea.');
      return;
    }
    setGuardando(true);
    try {
      await editar(id!, {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        categoria,
        fechaEntrega,
        horaEntrega,
        recordatorio,
        tiempoRecordatorio,
      });
      router.back();
    } catch {
      Alert.alert('Error', 'No se pudo actualizar la tarea.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <SafeAreaView style={styles.contenedor} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.btnVolver}>
          <Ionicons name="arrow-back" size={24} color="#2C3E50" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Editar Tarea</Text>
        <TouchableOpacity
          style={[styles.btnGuardar, guardando && styles.btnGuardarDeshabilitado]}
          onPress={guardar}
          disabled={guardando}
          activeOpacity={0.85}
        >
          <Text style={styles.btnGuardarTexto}>{guardando ? 'Guardando...' : 'Guardar'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={styles.seccion}>
          <Text style={styles.label}>Título *</Text>
          <TextInput
            style={styles.input}
            value={titulo}
            onChangeText={setTitulo}
            maxLength={80}
          />
        </View>

        <View style={styles.seccion}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.inputMultilinea]}
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
            numberOfLines={3}
            maxLength={200}
          />
        </View>

        <View style={styles.seccion}>
          <Text style={styles.label}>Categoría</Text>
          <View style={styles.categoriasGrid}>
            {LISTA_CATEGORIAS.map((cat) => {
              const config = CATEGORIAS[cat];
              const activo = categoria === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoriaBtn, { borderColor: config.color }, activo && { backgroundColor: config.color }]}
                  onPress={() => setCategoria(cat)}
                  activeOpacity={0.8}
                >
                  <Ionicons name={config.icono as any} size={18} color={activo ? '#fff' : config.color} />
                  <Text style={[styles.categoriaBtnTexto, { color: activo ? '#fff' : config.color }]}>
                    {config.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.seccion}>
          <Text style={styles.label}>Fecha de entrega</Text>
          <DatePickerField
            value={fechaEntrega}
            mode="date"
            onChange={setFechaEntrega}
            formatValue={formatearFecha}
            icon="calendar-outline"
          />
        </View>

        <View style={styles.seccion}>
          <Text style={styles.label}>Hora de entrega</Text>
          <DatePickerField
            value={horaEntrega}
            mode="time"
            onChange={setHoraEntrega}
            formatValue={formatearHora}
            icon="time-outline"
          />
        </View>

        <View style={styles.seccion}>
          <View style={styles.recordatorioRow}>
            <View style={styles.recordatorioInfo}>
              <Ionicons name="notifications-outline" size={20} color="#4A90D9" />
              <Text style={styles.label}>Recordatorio</Text>
            </View>
            <Switch
              value={recordatorio}
              onValueChange={setRecordatorio}
              trackColor={{ false: '#E8ECF0', true: '#AED6F1' }}
              thumbColor={recordatorio ? '#4A90D9' : '#BDC3C7'}
            />
          </View>
          {recordatorio && (
            <View style={styles.opcionesRecordatorio}>
              {OPCIONES_RECORDATORIO.map((op) => (
                <TouchableOpacity
                  key={op.value}
                  style={[styles.opcionBtn, tiempoRecordatorio === op.value && styles.opcionBtnActivo]}
                  onPress={() => setTiempoRecordatorio(op.value as TiempoRecordatorio)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.opcionTexto, tiempoRecordatorio === op.value && styles.opcionTextoActivo]}>
                    {op.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: '#F5F7FA' },
  centrado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#F0F3F7',
  },
  btnVolver: { padding: 4, marginRight: 8 },
  titulo: { flex: 1, fontSize: 18, fontWeight: '700', color: '#2C3E50' },
  btnGuardar: { backgroundColor: '#4A90D9', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  btnGuardarDeshabilitado: { opacity: 0.6 },
  btnGuardarTexto: { color: '#fff', fontWeight: '700', fontSize: 14 },
  seccion: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 12, borderRadius: 14, padding: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#8395A7', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { fontSize: 16, color: '#2C3E50', borderBottomWidth: 1.5, borderBottomColor: '#E8ECF0', paddingVertical: 6 },
  inputMultilinea: { minHeight: 70, textAlignVertical: 'top' },
  categoriasGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoriaBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5 },
  categoriaBtnTexto: { fontSize: 14, fontWeight: '600' },
  recordatorioRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  recordatorioInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  opcionesRecordatorio: { marginTop: 12, gap: 8 },
  opcionBtn: { padding: 12, borderRadius: 10, backgroundColor: '#F5F7FA', borderWidth: 1.5, borderColor: 'transparent' },
  opcionBtnActivo: { backgroundColor: '#EBF4FF', borderColor: '#4A90D9' },
  opcionTexto: { fontSize: 14, color: '#7F8C8D', fontWeight: '500' },
  opcionTextoActivo: { color: '#4A90D9', fontWeight: '700' },
});
