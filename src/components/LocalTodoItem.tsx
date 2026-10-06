import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAppDispatch } from '../store/hooks';
import { removeTodo, toggleTodo, type Todo } from '../store/slices/todosSlice';

interface LocalTodoItemProps {
  todo: Todo;
}

function LocalTodoItemComponent({ todo }: LocalTodoItemProps) {
  const dispatch = useAppDispatch();

  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => dispatch(toggleTodo(todo.id))}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: todo.completed }}
        style={({ pressed }) => [styles.toggleArea, pressed && styles.toggleAreaPressed]}
      >
        <View style={[styles.checkbox, todo.completed && styles.checkboxChecked]}>
          {todo.completed ? <Text style={styles.checkmark}>✓</Text> : null}
        </View>
        <Text style={[styles.title, todo.completed && styles.titleDone]} numberOfLines={2}>
          {todo.title}
        </Text>
      </Pressable>
      <Pressable
        onPress={() => dispatch(removeTodo(todo.id))}
        accessibilityRole="button"
        accessibilityLabel={`Видалити «${todo.title}»`}
        hitSlop={6}
        style={({ pressed }) => [styles.removeButton, pressed && styles.removeButtonPressed]}
      >
        <Text style={styles.removeText}>✕</Text>
      </Pressable>
    </View>
  );
}

export const LocalTodoItem = memo(LocalTodoItemComponent);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  toggleArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  toggleAreaPressed: {
    backgroundColor: '#F3F4F6',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderColor: '#10B981',
    backgroundColor: '#10B981',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  title: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  titleDone: {
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
  },
  removeButtonPressed: {
    backgroundColor: '#FECACA',
    transform: [{ scale: 0.94 }],
  },
  removeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#DC2626',
  },
});
