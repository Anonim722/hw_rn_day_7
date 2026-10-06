import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addTodo } from '../store/slices/todosSlice';

export function AddLocalForm() {
  const dispatch = useAppDispatch();
  const count = useAppSelector((state) => state.todos.items.length);
  const [text, setText] = useState('');

  const title = text.trim();

  const handleAdd = () => {
    if (!title) return;
    dispatch(addTodo({ id: Date.now(), title, completed: false, userId: 1 }));
    setText('');
  };

  return (
    <View style={styles.block}>
      <Text style={styles.label}>
        Локально — <Text style={styles.count}>{count}</Text>
      </Text>
      <View style={styles.row}>
        <TextInput
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleAdd}
          placeholder="Нове локальне завдання"
          placeholderTextColor="#9CA3AF"
          returnKeyType="done"
          style={styles.input}
        />
        <Pressable
          onPress={handleAdd}
          disabled={!title}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            !title && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.buttonText}>Додати локально</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  count: {
    color: '#7C3AED',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  button: {
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#7C3AED',
  },
  buttonPressed: {
    backgroundColor: '#6D28D9',
    transform: [{ scale: 0.97 }],
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
