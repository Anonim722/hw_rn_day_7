import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

export interface TodosState {
  items: Todo[];
}

const initialState: TodosState = {
  items: [],
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // Immer дозволяє «мутувати» draft — під капотом створюється новий незмінний стан
    addTodo(state, action: PayloadAction<Todo>) {
      state.items.unshift(action.payload);
    },
    removeTodo(state, action: PayloadAction<number>) {
      state.items = state.items.filter((todo) => todo.id !== action.payload);
    },
    toggleTodo(state, action: PayloadAction<number>) {
      const todo = state.items.find((item) => item.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    clearTodos(state) {
      state.items = [];
    },
  },
});

export const { addTodo, removeTodo, toggleTodo, clearTodos } = todosSlice.actions;

export default todosSlice.reducer;
