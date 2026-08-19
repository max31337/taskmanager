import type { Task } from './types'

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'

export class ApiError extends Error {}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      ...options,
    })
  } catch {
    throw new ApiError('Unable to reach the Task Manager API. Check that the backend is running.')
  }

  if (response.status === 204) {
    return undefined as T
  }

  const body: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const message =
      typeof body === 'object' && body !== null && 'error' in body && typeof body.error === 'string'
        ? body.error
        : 'The request could not be completed.'
    throw new ApiError(message)
  }

  return body as T
}

export const taskApi = {
  list: () => request<Task[]>('/tasks'),
  create: (task: Pick<Task, 'title' | 'description'>) =>
    request<Task>('/tasks', { method: 'POST', body: JSON.stringify(task) }),
  update: (id: number, updates: Partial<Pick<Task, 'title' | 'description' | 'completed'>>) =>
    request<Task>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(updates) }),
  remove: (id: number) => request<void>(`/tasks/${id}`, { method: 'DELETE' }),
}
