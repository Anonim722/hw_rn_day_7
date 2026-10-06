import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { Todo } from '../store/slices/todosSlice';

export const todosApi = createApi({
  reducerPath: 'todosApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com' }),
  tagTypes: ['Todo'],
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], void>({
      query: () => '/todos?_limit=15',
      providesTags: ['Todo'],
    }),
    // Після успіху тег 'Todo' інвалідується → getTodos перезапитується автоматично
    addTodo: builder.mutation<Todo, Omit<Todo, 'id'>>({
      query: (body) => ({
        method: 'POST',
        url: '/todos',
        body,
      }),
      invalidatesTags: ['Todo'],
    }),
  }),
});

export const { useGetTodosQuery, useAddTodoMutation } = todosApi;
