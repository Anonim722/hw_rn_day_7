import { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddLocalForm } from '../components/AddLocalForm';
import { AddServerForm } from '../components/AddServerForm';
import { LocalTodoItem } from '../components/LocalTodoItem';
import { Separator } from '../components/Separator';
import { ServerTodoCard } from '../components/ServerTodoCard';
import { useGetTodosQuery } from '../services/todosApi';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearTodos, type Todo } from '../store/slices/todosSlice';
import { getErrorMessage } from '../utils/getErrorMessage';

const keyExtractor = (item: Todo) => String(item.id);

const renderServerTodo: ListRenderItem<Todo> = ({ item }) => <ServerTodoCard todo={item} />;

const renderLocalTodo: ListRenderItem<Todo> = ({ item }) => <LocalTodoItem todo={item} />;

export default function TodosScreen() {
  // Серверний стан — RTK Query (кеш у store.todosApi)
  const { data: serverTodos, error, isLoading, isFetching, isError, refetch } = useGetTodosQuery();

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  // Блоки 1–2 + заголовок блоку 3. Компоненти форм тримають власний стан інпутів,
  // тож header не перемонтовується і поля не втрачають фокус.
  const listHeader = (
    <View>
      <AddLocalForm />
      <AddServerForm />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Серверний список</Text>
        {isFetching && !isLoading ? <ActivityIndicator size="small" color="#2563EB" /> : null}
      </View>

      {/* Помилка повторного запиту, коли в кеші вже є дані */}
      {isError && serverTodos ? (
        <View style={styles.inlineError}>
          <Text style={styles.inlineErrorText}>⚠️ {getErrorMessage(error)}</Text>
          <Pressable
            onPress={handleRetry}
            accessibilityRole="button"
            style={({ pressed }) => [styles.linkButton, pressed && styles.linkButtonPressed]}
          >
            <Text style={styles.linkButtonText}>Повторити</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );

  // Стани серверного списку: loading → error → порожній результат
  let serverEmpty;
  if (isLoading) {
    serverEmpty = (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.hint}>Завантажуємо завдання…</Text>
      </View>
    );
  } else if (isError) {
    serverEmpty = (
      <View style={styles.center}>
        <Text style={styles.errorIcon}>😕</Text>
        <Text style={styles.errorTitle}>Не вдалося завантажити завдання</Text>
        <Text style={styles.hint}>{getErrorMessage(error)}</Text>
        <Pressable
          onPress={handleRetry}
          accessibilityRole="button"
          style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
        >
          <Text style={styles.retryText}>Повторити спробу</Text>
        </Pressable>
      </View>
    );
  } else {
    serverEmpty = (
      <View style={styles.center}>
        <Text style={styles.errorIcon}>📭</Text>
        <Text style={styles.hint}>Сервер не повернув жодного завдання</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <FlatList
        data={serverTodos ?? []}
        keyExtractor={keyExtractor}
        renderItem={renderServerTodo}
        ItemSeparatorComponent={Separator}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={serverEmpty}
        ListFooterComponent={<LocalTodosSection />}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            colors={['#2563EB']}
            tintColor="#2563EB"
          />
        }
      />
    </SafeAreaView>
  );
}

// Блок 4 — локальний список із Redux-слайсу
function LocalTodosSection() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.todos.items);

  return (
    <View style={styles.localBlock}>
      <View style={styles.localHeader}>
        <Text style={styles.sectionTitle}>Мої завдання</Text>
        {items.length > 0 ? (
          <Pressable
            onPress={() => dispatch(clearTodos())}
            accessibilityRole="button"
            style={({ pressed }) => [styles.linkButton, pressed && styles.linkButtonPressed]}
          >
            <Text style={styles.linkButtonText}>Очистити</Text>
          </Pressable>
        ) : null}
      </View>

      <FlatList
        data={items}
        keyExtractor={keyExtractor}
        renderItem={renderLocalTodo}
        ItemSeparatorComponent={LocalSeparator}
        scrollEnabled={false}
        contentContainerStyle={styles.localListContent}
        ListEmptyComponent={
          <View style={styles.localEmpty}>
            <Text style={styles.errorIcon}>🗒️</Text>
            <Text style={styles.hint}>Немає збережених завдань</Text>
          </View>
        }
      />
    </View>
  );
}

function LocalSeparator() {
  return <View style={styles.localSeparator} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  inlineError: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
  },
  inlineErrorText: {
    flex: 1,
    fontSize: 13,
    color: '#DC2626',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    marginHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  hint: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  errorIcon: {
    fontSize: 36,
  },
  errorTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: '#2563EB',
  },
  retryButtonPressed: {
    backgroundColor: '#1D4ED8',
    transform: [{ scale: 0.97 }],
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  linkButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  linkButtonPressed: {
    backgroundColor: '#E5E7EB',
  },
  linkButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
  localBlock: {
    marginTop: 24,
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
  },
  localHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  localListContent: {
    flexGrow: 1,
  },
  localSeparator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
  },
  localEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
});
