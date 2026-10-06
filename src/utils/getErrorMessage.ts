import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export function getErrorMessage(error: FetchBaseQueryError | SerializedError | undefined): string {
  if (!error) return 'Невідома помилка';

  if ('status' in error) {
    if (typeof error.status === 'number') return `Сервер відповів зі статусом ${error.status}`;
    if (error.status === 'FETCH_ERROR') return 'Немає з’єднання з сервером';
    if (error.status === 'PARSING_ERROR') return 'Не вдалося розібрати відповідь сервера';
    if (error.status === 'TIMEOUT_ERROR') return 'Час очікування вичерпано';
    return error.error;
  }

  return error.message ?? 'Невідома помилка';
}
