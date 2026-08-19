import type { FormEvent } from 'react'

type TaskFormProps = {
  title: string
  description: string
  onTitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function TaskForm({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  onSubmit,
}: TaskFormProps) {
  return (
    <form className="task-form" onSubmit={onSubmit}>
      <label htmlFor="task-title">Title</label>
      <input
        id="task-title"
        type="text"
        value={title}
        onChange={(event) => onTitleChange(event.target.value)}
        placeholder="What needs doing?"
      />

      <label htmlFor="task-description">Note <span>Optional</span></label>
      <textarea
        id="task-description"
        value={description}
        onChange={(event) => onDescriptionChange(event.target.value)}
        placeholder="Add context or a reminder"
        rows={4}
      />

      <button type="submit">Add item</button>
    </form>
  )
}
