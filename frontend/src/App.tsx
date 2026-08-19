import { useEffect, useMemo, useState, type FormEvent } from 'react'
import './App.css'
import { TaskFilters } from './TaskFilters'
import { TaskForm } from './TaskForm'
import { TaskList } from './TaskList'
import { TaskSearch } from './TaskSearch'
import type { FilterType, Task } from './types'

const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Review project brief',
    description: 'Read the requirement summary and note important points.',
    completed: false,
  },
  {
    id: 2,
    title: 'Prepare meeting notes',
    description: 'Summarize the discussion and follow-up actions.',
    completed: true,
  },
  {
    id: 3,
    title: 'Finish landing page mockup',
    description: 'Complete the high-fidelity mockup for the homepage layout.',
    completed: false,
  },
]

type Notification = {
  message: string
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [taskPendingDeletion, setTaskPendingDeletion] = useState<Task | null>(null)
  const [notification, setNotification] = useState<Notification | null>(null)

  const filteredTasks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return tasks.filter((task) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        task.title.toLowerCase().includes(normalizedSearch) ||
        task.description.toLowerCase().includes(normalizedSearch)

      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'active' && !task.completed) ||
        (activeFilter === 'completed' && task.completed)

      return matchesSearch && matchesFilter
    })
  }, [tasks, searchTerm, activeFilter])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const title = newTitle.trim()
    const description = newDescription.trim()

    if (!title) {
      return
    }

    setTasks((currentTasks) => [
      {
        id: Date.now(),
        title,
        description,
        completed: false,
      },
      ...currentTasks,
    ])

    setNewTitle('')
    setNewDescription('')
    setNotification({ message: `Added “${title}”.` })
  }

  const toggleTask = (id: number) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  const removeTask = (id: number) => {
    const task = tasks.find((item) => item.id === id)

    if (!task) {
      return
    }

    setTaskPendingDeletion(task)
  }

  const confirmRemoveTask = () => {
    if (!taskPendingDeletion) {
      return
    }

    const { id } = taskPendingDeletion
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id))

    if (editingTaskId === id) {
      setEditingTaskId(null)
      setEditTitle('')
      setEditDescription('')
    }

    setTaskPendingDeletion(null)
    setNotification({ message: `Deleted “${taskPendingDeletion.title}”.` })
  }

  useEffect(() => {
    if (!taskPendingDeletion) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setTaskPendingDeletion(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [taskPendingDeletion])

  useEffect(() => {
    if (!notification) {
      return
    }

    const timeout = window.setTimeout(() => setNotification(null), 3500)
    return () => window.clearTimeout(timeout)
  }, [notification])

  const startEditing = (id: number) => {
    const task = tasks.find((item) => item.id === id)

    if (!task) {
      return
    }

    setEditingTaskId(id)
    setEditTitle(task.title)
    setEditDescription(task.description)
  }

  const saveEditedTask = (id: number) => {
    const title = editTitle.trim()
    const description = editDescription.trim()

    if (!title) {
      return
    }

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, title, description } : task,
      ),
    )

    setEditingTaskId(null)
    setEditTitle('')
    setEditDescription('')
    setNotification({ message: `Saved changes to “${title}”.` })
  }

  const cancelEdit = () => {
    setEditingTaskId(null)
    setEditTitle('')
    setEditDescription('')
  }

  const completedTasks = tasks.filter((task) => task.completed).length
  const activeTasks = tasks.length - completedTasks

  return (
    <main className="app-shell">
      <section className="task-panel" aria-labelledby="page-title">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Personal worklist</p>
            <h1 id="page-title">Tasks</h1>
          </div>
          <p className="task-summary">
            <strong>{activeTasks}</strong> open <span aria-hidden="true">·</span> {completedTasks} complete
          </p>
        </div>

        <div className="workspace-grid">
          <aside className="task-composer" aria-label="Create a task">
            <p className="section-label">Add an item</p>
            <TaskForm
              title={newTitle}
              description={newDescription}
              onTitleChange={setNewTitle}
              onDescriptionChange={setNewDescription}
              onSubmit={handleSubmit}
            />
          </aside>

          <section className="task-workspace" aria-label="Task list">
            <div className="list-tools">
              <TaskSearch value={searchTerm} onChange={setSearchTerm} />
              <TaskFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
            </div>

            <div className="list-heading">
              <p className="section-label">{activeFilter === 'all' ? 'All items' : activeFilter === 'active' ? 'Open items' : 'Completed items'}</p>
              <span>{filteredTasks.length} shown</span>
            </div>

            <TaskList
              tasks={filteredTasks}
              editingTaskId={editingTaskId}
              editTitle={editTitle}
              editDescription={editDescription}
              onToggle={toggleTask}
              onDelete={removeTask}
              onEdit={startEditing}
              onEditTitleChange={setEditTitle}
              onEditDescriptionChange={setEditDescription}
              onSaveEdit={saveEditedTask}
              onCancelEdit={cancelEdit}
            />
          </section>
        </div>
      </section>

      {taskPendingDeletion && (
        <div className="confirmation-backdrop" role="presentation">
          <section
            className="confirmation-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <p className="section-label">Remove item</p>
            <h2 id="delete-dialog-title">Delete this task?</h2>
            <p id="delete-dialog-description">
              “{taskPendingDeletion.title}” will be removed permanently.
            </p>
            <div className="confirmation-actions">
              <button type="button" className="secondary-button" onClick={() => setTaskPendingDeletion(null)}>
                Keep task
              </button>
              <button type="button" className="delete-confirm-button" onClick={confirmRemoveTask}>
                Delete task
              </button>
            </div>
          </section>
        </div>
      )}

      {notification && (
        <div className="toast" role="status" aria-live="polite">
          <span>{notification.message}</span>
          <button type="button" onClick={() => setNotification(null)} aria-label="Dismiss notification">
            Dismiss
          </button>
        </div>
      )}
    </main>
  )
}

export default App
