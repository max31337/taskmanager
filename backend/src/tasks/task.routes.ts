import { Router } from 'express'
import { getTasks, patchTask, postTask, removeTask } from './task.controller.js'

export const taskRouter = Router()

taskRouter.route('/').get(getTasks).post(postTask)
taskRouter.route('/:id').patch(patchTask).delete(removeTask)
