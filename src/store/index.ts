import { configureStore } from '@reduxjs/toolkit';

import { todosApi } from '../services/todosApi';
import todosReducer from './slices/todosSlice';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    [todosApi.reducerPath]: todosApi.reducer,
  },
  // Middleware RTK Query керує кешем, інвалідацією тегів та життєвим циклом підписок
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(todosApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
