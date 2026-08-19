const MAX_TITLE_LENGTH = 200
const MAX_DESCRIPTION_LENGTH = 2_000

export type CreateTaskInput = {
  title: string
  description: string
}

export type UpdateTaskInput = Partial<CreateTaskInput> & {
  completed?: boolean
}

type ValidationResult<T> = { value: T } | { error: string }

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function validateText(value: unknown, field: string, required: boolean, maxLength: number): ValidationResult<string | undefined> {
  if (value === undefined && !required) {
    return { value: undefined }
  }

  if (typeof value !== 'string') {
    return { error: `${field} must be a string.` }
  }

  const trimmed = value.trim()
  if (required && !trimmed) {
    return { error: `${field} is required.` }
  }

  if (trimmed.length > maxLength) {
    return { error: `${field} must be ${maxLength} characters or fewer.` }
  }

  return { value: trimmed }
}

export function validateCreateTask(body: unknown): ValidationResult<CreateTaskInput> {
  if (!isPlainObject(body)) {
    return { error: 'Request body must be a JSON object.' }
  }

  const title = validateText(body.title, 'title', true, MAX_TITLE_LENGTH)
  const description = validateText(body.description ?? '', 'description', false, MAX_DESCRIPTION_LENGTH)
  if ('error' in title) return title
  if ('error' in description) return description

  return { value: { title: title.value ?? '', description: description.value ?? '' } }
}

export function validateUpdateTask(body: unknown): ValidationResult<UpdateTaskInput> {
  if (!isPlainObject(body)) {
    return { error: 'Request body must be a JSON object.' }
  }

  const updates: UpdateTaskInput = {}

  if ('title' in body) {
    const title = validateText(body.title, 'title', true, MAX_TITLE_LENGTH)
    if ('error' in title) return title
    updates.title = title.value
  }

  if ('description' in body) {
    const description = validateText(body.description, 'description', false, MAX_DESCRIPTION_LENGTH)
    if ('error' in description) return description
    updates.description = description.value ?? ''
  }

  if ('completed' in body) {
    if (typeof body.completed !== 'boolean') {
      return { error: 'completed must be a boolean.' }
    }
    updates.completed = body.completed
  }

  if (Object.keys(updates).length === 0) {
    return { error: 'Provide at least one task field to update.' }
  }

  return { value: updates }
}

export function parseTaskId(value: string | string[]): string | null {
  if (typeof value !== 'string') {
    return null
  }

  if (!/^\d+$/.test(value) || BigInt(value) < 1n) {
    return null
  }

  return value
}
