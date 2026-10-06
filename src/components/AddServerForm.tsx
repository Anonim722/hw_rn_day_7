import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAddTodoMutation } from '../services/todosApi';
import { getErrorMessage } from '../utils/getErrorMessage';

export function AddServerForm() {
  const [addTodo, { data: created, error, isLoading, isSuccess, isError }] = useAddTodoMutation();
  const [text, setText] = useState('');

  const title = text.trim();
  const isDisabled = !title || isLoading;

  const handleAdd = async () => {
    if (isDisabled) return;
    try {
      await addTodo({ title, completed: false, userId: 1 }).unwrap();
      setText('');
    } catch {
      // Помилку показуємо через стан мутації (isError / error) нижче
    }
  };

  return (
    <View style={styles.block}>
      <View style={styles.row}>
        <TextInput
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleAdd}
          placeholder="Нове завдання на сервер"
          placeholderTextColor="#9CA3AF"
          returnKeyType="send"
          editable={!isLoading}
          style={styles.input}
        />
        <Pressable
          onPress={handleAdd}
          disabled={isDisabled}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
            isDisabled && styles.buttonDisabled,
          ]}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Додати на сервер</Text>
          )}
        </Pressable>
      </View>

      {isSuccess && created ? (
        <Text style={styles.success} numberOfLines={2}>
          ✅ Сервер створив #{created.id} «{created.title}»
        </Text>
      ) : null}
      {isError ? <Text style={styles.error}>⚠️ {getErrorMessage(error)}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 16,
    marginTop: 12,
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
    minWidth: 140,
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#2563EB',
  },
  buttonPressed: {
    backgroundColor: '#1D4ED8',
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
  success: {
    marginTop: 8,
    fontSize: 13,
    color: '#047857',
  },
  error: {
    marginTop: 8,
    fontSize: 13,
    color: '#DC2626',
  },
});
