import { pool } from '../db.js'
import type { CreateTaskInput, UpdateTaskInput } from './task.validation.js'

export type Task = {
  id: number
  title: string
  description: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

const taskFields = 'id, title, description, completed, created_at AS "createdAt", updated_at AS "updatedAt"'

export async function listTasks(): Promise<Task[]> {
  const result = await pool.query<Task>(`SELECT ${taskFields} FROM tasks ORDER BY created_at DESC`)
  return result.rows
}

export async function createTask({ title, description }: CreateTaskInput): Promise<Task> {
  const result = await pool.query<Task>(
    `INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING ${taskFields}`,
    [title, description],
  )
  return result.rows[0]
}

export async function updateTask(id: string, updates: UpdateTaskInput): Promise<Task | null> {
  const fields: string[] = []
  const values: Array<string | boolean> = []

  if (updates.title !== undefined) {
    fields.push(`title = $${values.length + 1}`)
    values.push(updates.title)
  }
  if (updates.description !== undefined) {
    fields.push(`description = $${values.length + 1}`)
    values.push(updates.description)
  }
  if (updates.completed !== undefined) {
    fields.push(`completed = $${values.length + 1}`)
    values.push(updates.completed)
  }

  values.push(id)
  const result = await pool.query<Task>(
    `UPDATE tasks SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${values.length} RETURNING ${taskFields}`,
    values,
  )
  return result.rows[0] ?? null
}

export async function deleteTask(id: string): Promise<boolean> {
  const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING id', [id])
  return result.rowCount === 1
}
