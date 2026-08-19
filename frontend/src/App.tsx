import { useEffect, useMemo, useState, type FormEvent } from 'react'
import './App.css'
import { ApiError, taskApi } from './api'
import { TaskFilters } from './TaskFilters'
import { TaskForm } from './TaskForm'
import { TaskList } from './TaskList'
import { TaskSearch } from './TaskSearch'
import type { FilterType, Task } from './types'

type Notification = {
  message: string
  tone: 'success' | 'error'
}

function messageFor(error: unknown) {
  return error instanceof ApiError ? error.message : 'Something went wrong. Please try again.'
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [taskPendingDeletion, setTaskPendingDeletion] = useState<Task | null>(null)
  const [notification, setNotification] = useState<Notification | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadTasks() {
      try {
        setTasks(await taskApi.list())
      } catch (error) {
        setNotification({ message: messageFor(error), tone: 'error' })
      } finally {
        setIsLoading(false)
      }
    }

    void loadTasks()
  }, [])

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const title = newTitle.trim()
    const description = newDescription.trim()

    if (!title) return

    try {
      const task = await taskApi.create({ title, description })
      setTasks((currentTasks) => [task, ...currentTasks])
      setNewTitle('')
      setNewDescription('')
      setNotification({ message: `Added "${title}".`, tone: 'success' })
    } catch (error) {
      setNotification({ message: messageFor(error), tone: 'error' })
    }
  }

  const toggleTask = async (id: number) => {
    const task = tasks.find((item) => item.id === id)
    if (!task) return

    try {
      const updatedTask = await taskApi.update(id, { completed: !task.completed })
      setTasks((currentTasks) => currentTasks.map((item) => (item.id === id ? updatedTask : item)))
    } catch (error) {
      setNotification({ message: messageFor(error), tone: 'error' })
    }
  }

  const removeTask = (id: number) => {
    const task = tasks.find((item) => item.id === id)
    if (task) setTaskPendingDeletion(task)
  }

  const confirmRemoveTask = async () => {
    if (!taskPendingDeletion) return

    const { id, title } = taskPendingDeletion
    try {
      await taskApi.remove(id)
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id))
      if (editingTaskId === id) setEditingTaskId(null)
      setTaskPendingDeletion(null)
      setNotification({ message: `Deleted "${title}".`, tone: 'success' })
    } catch (error) {
      setNotification({ message: messageFor(error), tone: 'error' })
    }
  }

  useEffect(() => {
    if (!taskPendingDeletion) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setTaskPendingDeletion(null)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [taskPendingDeletion])

  useEffect(() => {
    if (!notification) return
    const timeout = window.setTimeout(() => setNotification(null), 3500)
    return () => window.clearTimeout(timeout)
  }, [notification])

  const startEditing = (id: number) => {
    const task = tasks.find((item) => item.id === id)
    if (!task) return

    setEditingTaskId(id)
    setEditTitle(task.title)
    setEditDescription(task.description)
  }

  const saveEditedTask = async (id: number) => {
    const title = editTitle.trim()
    const description = editDescription.trim()
    if (!title) return

    try {
      const updatedTask = await taskApi.update(id, { title, description })
      setTasks((currentTasks) => currentTasks.map((task) => (task.id === id ? updatedTask : task)))
      setEditingTaskId(null)
      setEditTitle('')
      setEditDescription('')
      setNotification({ message: `Saved changes to "${title}".`, tone: 'success' })
    } catch (error) {
      setNotification({ message: messageFor(error), tone: 'error' })
    }
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
            <strong>{activeTasks}</strong> open <span aria-hidden="true">&middot;</span> {completedTasks} complete
          </p>
        </div>

        <div className="workspace-grid">
          <aside className="task-composer" aria-label="Create a task">
            <p className="section-label">Add an item</p>
            <TaskForm title={newTitle} description={newDescription} onTitleChange={setNewTitle} onDescriptionChange={setNewDescription} onSubmit={handleSubmit} />
          </aside>

          <section className="task-workspace" aria-label="Task list">
            <div className="list-tools">
              <TaskSearch value={searchTerm} onChange={setSearchTerm} />
              <TaskFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
            </div>

            <div className="list-heading">
              <p className="section-label">{activeFilter === 'all' ? 'All items' : activeFilter === 'active' ? 'Open items' : 'Completed items'}</p>
              <span>{isLoading ? 'Loading' : `${filteredTasks.length} shown`}</span>
            </div>

            {isLoading ? (
              <p className="loading-state" aria-live="polite">Loading tasks...</p>
            ) : (
              <TaskList tasks={filteredTasks} editingTaskId={editingTaskId} editTitle={editTitle} editDescription={editDescription} onToggle={toggleTask} onDelete={removeTask} onEdit={startEditing} onEditTitleChange={setEditTitle} onEditDescriptionChange={setEditDescription} onSaveEdit={saveEditedTask} onCancelEdit={cancelEdit} />
            )}
          </section>
        </div>
      </section>

      {taskPendingDeletion && (
        <div className="confirmation-backdrop" role="presentation">
          <section className="confirmation-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title" aria-describedby="delete-dialog-description">
            <p className="section-label">Remove item</p>
            <h2 id="delete-dialog-title">Delete this task?</h2>
            <p id="delete-dialog-description">"{taskPendingDeletion.title}" will be removed permanently.</p>
            <div className="confirmation-actions">
              <button type="button" className="secondary-button" onClick={() => setTaskPendingDeletion(null)}>Keep task</button>
              <button type="button" className="delete-confirm-button" onClick={confirmRemoveTask}>Delete task</button>
            </div>
          </section>
        </div>
      )}

      {notification && (
        <div className={`toast ${notification.tone === 'error' ? 'is-error' : ''}`} role="status" aria-live="polite">
          <span>{notification.message}</span>
          <button type="button" onClick={() => setNotification(null)} aria-label="Dismiss notification">Dismiss</button>
        </div>
      )}
    </main>
  )
}

export default App
