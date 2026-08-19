import type { NextFunction, Request, Response } from 'express'
import * as taskRepository from './task.repository.js'
import { parseTaskId, validateCreateTask, validateUpdateTask } from './task.validation.js'

export async function getTasks(_request: Request, response: Response, next: NextFunction) {
  try {
    response.json(await taskRepository.listTasks())
  } catch (error) {
    next(error)
  }
}

export async function postTask(request: Request, response: Response, next: NextFunction) {
  const validation = validateCreateTask(request.body)
  if ('error' in validation) {
    return response.status(400).json({ error: validation.error })
  }

  try {
    const task = await taskRepository.createTask(validation.value)
    return response.status(201).json(task)
  } catch (error) {
    return next(error)
  }
}

export async function patchTask(request: Request, response: Response, next: NextFunction) {
  const id = parseTaskId(request.params.id)
  if (!id) {
    return response.status(400).json({ error: 'Task id must be a positive integer.' })
  }

  const validation = validateUpdateTask(request.body)
  if ('error' in validation) {
    return response.status(400).json({ error: validation.error })
  }

  try {
    const task = await taskRepository.updateTask(id, validation.value)
    if (!task) {
      return response.status(404).json({ error: 'Task not found.' })
    }
    return response.json(task)
  } catch (error) {
    return next(error)
  }
}

export async function removeTask(request: Request, response: Response, next: NextFunction) {
  const id = parseTaskId(request.params.id)
  if (!id) {
    return response.status(400).json({ error: 'Task id must be a positive integer.' })
  }

  try {
    const deleted = await taskRepository.deleteTask(id)
    if (!deleted) {
      return response.status(404).json({ error: 'Task not found.' })
    }
    return response.status(204).send()
  } catch (error) {
    return next(error)
  }
}