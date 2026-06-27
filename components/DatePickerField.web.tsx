import React from 'react';

interface Props {
  value: Date;
  mode: 'date' | 'time';
  minimumDate?: Date;
  onChange: (date: Date) => void;
  formatValue: (date: Date) => string;
  icon: string;
}

function toDateInputValue(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function toTimeInputValue(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export default function DatePickerField({ value, mode, minimumDate, onChange, formatValue }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;
    if (mode === 'date') {
      const [year, month, day] = val.split('-').map(Number);
      const newDate = new Date(value);
      newDate.setFullYear(year, month - 1, day);
      onChange(newDate);
    } else {
      const [hours, minutes] = val.split(':').map(Number);
      const newDate = new Date(value);
      newDate.setHours(hours, minutes, 0, 0);
      onChange(newDate);
    }
  };

  const inputValue = mode === 'date' ? toDateInputValue(value) : toTimeInputValue(value);
  const minValue = minimumDate && mode === 'date' ? toDateInputValue(minimumDate) : undefined;

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
        padding: '12px',
        borderRadius: '10px',
        cursor: 'pointer',
        gap: '10px',
      }}
    >
      <span style={{ flex: 1, fontSize: '16px', color: '#2C3E50', fontWeight: '500', fontFamily: 'system-ui' }}>
        {formatValue(value)}
      </span>
      <span style={{ fontSize: '12px', color: '#BDC3C7' }}>›</span>
      <input
        type={mode}
        value={inputValue}
        min={minValue}
        onChange={handleChange}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: 'pointer',
          border: 'none',
          outline: 'none',
        }}
      />
    </div>
  );
}
