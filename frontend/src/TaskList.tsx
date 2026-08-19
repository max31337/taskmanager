import { TaskItem } from './TaskItem'
import type { Task } from './types'

type TaskListProps = {
  tasks: Task[]
  editingTaskId: number | null
  editTitle: string
  editDescription: string
  onToggle: (id: number) => void
  onDelete: (id: number) => void
  onEdit: (id: number) => void
  onEditTitleChange: (value: string) => void
  onEditDescriptionChange: (value: string) => void
  onSaveEdit: (id: number) => void
  onCancelEdit: () => void
}

export function TaskList({
  tasks,
  editingTaskId,
  editTitle,
  editDescription,
  onToggle,
  onDelete,
  onEdit,
  onEditTitleChange,
  onEditDescriptionChange,
  onSaveEdit,
  onCancelEdit,
}: TaskListProps) {
  return (
    <ul className="task-list">
      {tasks.length === 0 ? (
        <li className="empty-state">Nothing here yet. Try another view or add an item.</li>
      ) : (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            isEditing={editingTaskId === task.id}
            editTitle={editTitle}
            editDescription={editDescription}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
            onEditTitleChange={onEditTitleChange}
            onEditDescriptionChange={onEditDescriptionChange}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
          />
        ))
      )}
    </ul>
  )
}
