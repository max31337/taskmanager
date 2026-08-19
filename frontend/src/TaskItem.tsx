import type { Task } from './types'

type TaskItemProps = {
  task: Task
  isEditing: boolean
  editTitle: string
  editDescription: string
  isTogglePending: boolean
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (id: number) => void
  onEditTitleChange: (value: string) => void
  onEditDescriptionChange: (value: string) => void
  onSaveEdit: (id: number) => void
  onCancelEdit: () => void
}

export function TaskItem({
  task,
  isEditing,
  editTitle,
  editDescription,
  isTogglePending,
  onToggle,
  onDelete,
  onEdit,
  onEditTitleChange,
  onEditDescriptionChange,
  onSaveEdit,
  onCancelEdit,
}: TaskItemProps) {
  if (isEditing) {
    return (
      <li className="task-item is-editing">
        <div className="task-edit-form">
          <input
            type="text"
            value={editTitle}
            onChange={(event) => onEditTitleChange(event.target.value)}
            aria-label="Edit task title"
          />
          <textarea
            value={editDescription}
            onChange={(event) => onEditDescriptionChange(event.target.value)}
            aria-label="Edit task description"
            rows={3}
          />
        </div>

        <div className="task-actions">
          <button type="button" className="save-button" onClick={() => onSaveEdit(task.id)}>
            Save
          </button>
          <button type="button" className="secondary-button" onClick={onCancelEdit}>
            Cancel
          </button>
        </div>
      </li>
    )
  }

  return (
    <li className={`task-item ${task.completed ? 'is-done' : ''}`} aria-busy={isTogglePending}>
      <label className="task-check">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          disabled={isTogglePending}
        />
        <div className="task-text">
          <span>{task.title}</span>
          {task.description && <small>{task.description}</small>}
        </div>
      </label>

      <div className="task-actions">
        <button type="button" className="edit-button" onClick={() => onEdit(task.id)}>
          Edit<span className="sr-only"> {task.title}</span>
        </button>
        <button
          type="button"
          className="delete-button"
          onClick={() => onDelete(task.id)}
          aria-label={`Delete ${task.title}`}
        >
          Delete
        </button>
      </div>
    </li>
  )
}
