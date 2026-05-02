import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

interface Props {
  value: Date;
  mode: 'date' | 'time';
  minimumDate?: Date;
  onChange: (date: Date) => void;
  formatValue: (date: Date) => string;
  icon: string;
}

export default function DatePickerField({ value, mode, minimumDate, onChange, formatValue, icon }: Props) {
  const [mostrar, setMostrar] = useState(false);
  // tempValue sólo se usa en iOS para acumular cambios del spinner antes de confirmar
  const [tempValue, setTempValue] = useState(value);

  const abrir = () => {
    setTempValue(value);
    setMostrar(true);
  };

  const handleChange = (_: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      // En Android el modal se cierra solo; el onChange se dispara una sola vez al confirmar
      setMostrar(false);
      if (date) onChange(date);
    } else {
      // En iOS el spinner dispara onChange con cada desplazamiento; solo actualizamos el temp
      if (date) setTempValue(date);
    }
  };

  const confirmarIOS = () => {
    setMostrar(false);
    onChange(tempValue);
  };

  const cancelarIOS = () => {
    setMostrar(false);
  };

  const display = mode === 'date'
    ? (Platform.OS === 'android' ? 'calendar' : 'spinner')
    : (Platform.OS === 'android' ? 'clock' : 'spinner');

  return (
    <View>
      <TouchableOpacity style={styles.selectorBtn} onPress={abrir} activeOpacity={0.8}>
        <Ionicons name={icon as any} size={20} color="#4A90D9" />
        <Text style={styles.selectorTexto}>{formatValue(value)}</Text>
        <Ionicons name="chevron-forward" size={18} color="#BDC3C7" />
      </TouchableOpacity>

      {mostrar && (
        <View style={Platform.OS === 'ios' ? styles.contenedorIOS : undefined}>
          {Platform.OS === 'ios' && (
            <View style={styles.barraBotonesIOS}>
              <TouchableOpacity onPress={cancelarIOS} style={styles.btnBarraIOS}>
                <Text style={styles.btnCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmarIOS} style={styles.btnBarraIOS}>
                <Text style={styles.btnListoTexto}>Listo</Text>
              </TouchableOpacity>
            </View>
          )}
          <DateTimePicker
            value={Platform.OS === 'ios' ? tempValue : value}
            mode={mode}
            display={display}
            minimumDate={minimumDate}
            is24Hour={false}
            onChange={handleChange}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  selectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F5F7FA',
    padding: 12,
    borderRadius: 10,
  },
  selectorTexto: { flex: 1, fontSize: 16, color: '#2C3E50', fontWeight: '500' },
  contenedorIOS: {
    marginTop: 8,
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    overflow: 'hidden',
  },
  barraBotonesIOS: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8ECF0',
    backgroundColor: '#fff',
  },
  btnBarraIOS: { paddingVertical: 2 },
  btnCancelarTexto: { color: '#8395A7', fontSize: 16, fontWeight: '500' },
  btnListoTexto: { color: '#4A90D9', fontSize: 16, fontWeight: '700' },
});
