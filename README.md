# React Native Day 7 — Redux Toolkit та RTK Query

Expo SDK 57 · React Native 0.86 · TypeScript (strict) · @reduxjs/toolkit 2 · react-redux 9 · React Navigation 7.

Один Todo-проєкт із двома рівнями стану в одному сторі: **локальний** (`todosSlice`) і **серверний** (RTK Query + JSONPlaceholder). Обидва працюють з однією сутністю `Todo`.

## Запуск

```bash
npm install
npx expo start        # Expo Go: відскануйте QR-код
npx expo start --web  # React Native Web preview
```

## Структура

```text
index.ts                        registerRootComponent(src/App)
src/
├── App.tsx                     Provider (найвищий) → SafeAreaProvider → NavigationContainer → Stack «Todos»
├── store/
│   ├── index.ts                configureStore: todos + todosApi.reducer, todosApi.middleware; RootState, AppDispatch
│   ├── hooks.ts                useAppDispatch / useAppSelector (.withTypes)
│   └── slices/todosSlice.ts    Todo, TodosState; addTodo (на початок), removeTodo, toggleTodo, clearTodos
├── services/todosApi.ts        createApi: getTodos (providesTags ['Todo']), addTodo POST (invalidatesTags ['Todo'])
├── screens/TodosScreen.tsx     FlatList: header = блоки 1–2, items = блок 3, footer = блок 4
├── components/
│   ├── AddLocalForm.tsx        Блок 1: «Локально — N» + поле + «Додати локально»
│   ├── AddServerForm.tsx       Блок 2: поле + «Додати на сервер» (useAddTodoMutation)
│   ├── ServerTodoCard.tsx      Картка блоку 3: «Зберегти локально» / «Збережено» + ⇄ toggle + ✕ remove
│   ├── LocalTodoItem.tsx       Рядок блоку 4: чекбокс completed + ✕
│   └── Separator.tsx           ItemSeparatorComponent
└── utils/getErrorMessage.ts    FetchBaseQueryError | SerializedError → текст
```

## Як це працює

- **Блок 3 (серверний список)** — `useGetTodosQuery()`:
  - `isLoading` → центрований `ActivityIndicator`;
  - `isError` без даних → текст помилки + «Повторити спробу» (`refetch`);
  - успіх → картки; `RefreshControl.refreshing = isFetching && !isLoading`.
  - Якщо повторний запит упав, а в кеші є дані — список лишається, над ним банер із кнопкою «Повторити».
- **Інвалідація**: після `addTodo` RTK Query сам перезапитує `getTodos` (видно спінер біля заголовка і в `RefreshControl`). Ручного `refetch` після мутації немає.
- **Весь екран прокручується** як один `FlatList` (`contentContainerStyle: { flexGrow: 1 }`); локальний список — вкладений `FlatList` зі `scrollEnabled={false}` у `ListFooterComponent`, з `ListEmptyComponent` «Немає збережених завдань».

> **Особливість JSONPlaceholder.** Це фейковий API: `POST /todos` повертає створений об'єкт (`id: 201`), але **не зберігає** його. Тому після автоматичного перезапиту `getTodos` сервер повертає ті самі 15 завдань. Ланцюжок «мутація → інвалідація тегу → автоматичний refetch» працює (видно індикатор оновлення), а відповідь сервера показується під формою: «✅ Сервер створив #201 «…»». Оптимістичні оновлення кешу свідомо не використовуються — за умовою ДЗ.

## Перевірка за чек-листом

| Сценарій | Як перевірити |
| --- | --- |
| loading → success | Запустити застосунок: спінер → 15 карток |
| Pull-to-refresh | Потягнути список униз — показується індикатор оновлення |
| Створення на сервері | Ввести текст у блоці 2 → «Додати на сервер»: поле очищується, `getTodos` перезапитується сам |
| «Зберегти локально» | На картці → з'являється «Збережено», лічильник у блоці 1 зростає, завдання в «Мої завдання» |
| Toggle | Натиснути на рядок у «Мої завдання» або ⇄ на картці |
| Видалення | ✕ у «Мої завдання» або на картці |
| Порожній локальний список | «Очистити» → «Немає збережених завдань» |
| Екран помилки | Вимкнути інтернет (або DevTools → Offline) і перезапустити → «Повторити спробу» |

## Перевірки

```bash
npx tsc --noEmit   # без помилок
npx expo-doctor    # 21/21 checks passed
```
