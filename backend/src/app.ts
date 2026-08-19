import cors from 'cors'
import express, { type NextFunction, type Request, type Response } from 'express'
import { taskRouter } from './tasks/task.routes.js'

export const app = express()

app.use(cors())
app.use(express.json({ limit: '32kb' }))

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' })
})

app.use('/api/tasks', taskRouter)

app.use((_request, response) => {
  response.status(404).json({ error: 'Route not found.' })
})

app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  if (error instanceof SyntaxError && 'body' in error) {
    return response.status(400).json({ error: 'Request body must contain valid JSON.' })
  }

  console.error(error)
  return response.status(500).json({ error: 'An unexpected server error occurred.' })
})
