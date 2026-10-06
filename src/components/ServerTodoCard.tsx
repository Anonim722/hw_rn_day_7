import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addTodo, removeTodo, toggleTodo, type Todo } from '../store/slices/todosSlice';

interface ServerTodoCardProps {
  todo: Todo;
}

function ServerTodoCardComponent({ todo }: ServerTodoCardProps) {
  const dispatch = useAppDispatch();
  const localTodo = useAppSelector((state) =>
    state.todos.items.find((item) => item.id === todo.id),
  );

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {todo.title}
        </Text>
        <Text style={styles.status}>{todo.completed ? '✅' : '❌'}</Text>
      </View>
      <Text style={styles.meta}>
        #{todo.id} · користувач {todo.userId} · {todo.completed ? 'виконано' : 'не виконано'}
      </Text>

      {localTodo ? (
        <View style={styles.actions}>
          <Text style={styles.saved}>
            💾 Збережено {localTodo.completed ? '(локально ✅)' : '(локально ❌)'}
          </Text>
          <Pressable
            onPress={() => dispatch(toggleTodo(todo.id))}
            accessibilityRole="button"
            accessibilityLabel="Перемкнути статус локальної копії"
            hitSlop={6}
            style={({ pressed }) => [styles.iconButton, pressed && styles.iconButtonPressed]}
          >
            <Text style={styles.iconText}>⇄</Text>
          </Pressable>
          <Pressable
            onPress={() => dispatch(removeTodo(todo.id))}
            accessibilityRole="button"
            accessibilityLabel="Видалити з локального списку"
            hitSlop={6}
            style={({ pressed }) => [
              styles.iconButton,
              styles.removeButton,
              pressed && styles.removeButtonPressed,
            ]}
          >
            <Text style={[styles.iconText, styles.removeText]}>✕</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          onPress={() => dispatch(addTodo(todo))}
          accessibilityRole="button"
          style={({ pressed }) => [styles.saveButton, pressed && styles.saveButtonPressed]}
        >
          {({ pressed }) => (
            <Text style={[styles.saveText, pressed && styles.saveTextPressed]}>
              Зберегти локально
            </Text>
          )}
        </Pressable>
      )}
    </View>
  );
}

export const ServerTodoCard = memo(ServerTodoCardComponent);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  status: {
    fontSize: 16,
  },
  meta: {
    marginTop: 4,
    fontSize: 12,
    color: '#9CA3AF',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  saved: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#047857',
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
  },
  iconButtonPressed: {
    backgroundColor: '#C7D2FE',
    transform: [{ scale: 0.94 }],
  },
  iconText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4338CA',
  },
  removeButton: {
    backgroundColor: '#FEF2F2',
  },
  removeButtonPressed: {
    backgroundColor: '#FECACA',
    transform: [{ scale: 0.94 }],
  },
  removeText: {
    color: '#DC2626',
  },
  saveButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A78BFA',
    backgroundColor: '#F5F3FF',
  },
  saveButtonPressed: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
    transform: [{ scale: 0.97 }],
  },
  saveText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6D28D9',
  },
  saveTextPressed: {
    color: '#FFFFFF',
  },
});
