import { HttpContext } from "@adonisjs/core/http"
import { TaskUserService } from "#services/task_user_service"
import { inject } from '@adonisjs/core'
import {
  createTaskUserValidator,
  taskUserMessagesProvider,
  assignTaskToUsersValidator,
  createUserIdValidator
} from "#validators/task_user"
import {createTaskIdValidator} from "#validators/task_user";

@inject()
export default class TaskUsersController {
  constructor(protected taskUserService: TaskUserService) {}

  /**
   * Assigne une tâche à un utilisateur
   */
  public async assignTaskToUser({ params, response }: HttpContext) {
    try {
      // Validation
      const payload = await createTaskUserValidator.validate(params, {
        messagesProvider: taskUserMessagesProvider
      })

      const result = await this.taskUserService.assignTaskToUser(payload.taskId, payload.userId)
      return {
        status: 'success',
        data: result,
        payload
      }
    } catch (error) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message || 'Une erreur est survenue lors de l\'assignation de la tâche',
        error: error.code || 'E_SERVER_ERROR'
      })
    }
  }

  /**
   * Retire l'assignation d'une tâche à un utilisateur
   */
  public async unassignTaskFromUser({ params, response }: HttpContext) {
    try {
      const payload = await createTaskUserValidator.validate(params, {
        messagesProvider: taskUserMessagesProvider
      })

      const result = await this.taskUserService.unassignTaskFromUser(payload.taskId, payload.userId)
      return {
        status: 'success',
        data: result,
        payload
      }

    } catch (error) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message || 'Une erreur est survenue lors du retrait de l\'assignation',
        error: error.code || 'E_SERVER_ERROR'
      })
    }
  }

  /**
   * Assigne une tâche à plusieurs utilisateurs
   */
  public async assignTaskToUsers({ params, request, response }: HttpContext) {
    try {
      const taskIdPayload = await createTaskIdValidator.validate(params, {
        messagesProvider: taskUserMessagesProvider
      })

      const userIdsPayload = await assignTaskToUsersValidator.validate(request.body(), {
        messagesProvider: taskUserMessagesProvider
      })

      const result = await this.taskUserService.assignTaskToUsers(taskIdPayload.taskId, userIdsPayload.userIds)
      return {
        status: 'success',
        data: result,
        userIdsPayload
      }
    } catch (error) {
      return response.status(error.status || 500).json({
        success: false,
        message: error.message || 'Une erreur est survenue lors de l\'assignation multiple',
        error: error.code || 'E_SERVER_ERROR',
        details: error.details
      })
    }
  }

  /**
   * Liste tous les utilisateurs assignés à une tâche
   */
  public async listUsersForTask({ params, response }: HttpContext) {
    try {
      const payload = await createTaskIdValidator.validate(params, {
        messagesProvider: taskUserMessagesProvider
      })

      const users = await this.taskUserService.listUsersForTask(payload.taskId)
      return response.status(200).json({
        status: 'succees',
        data: users
      })
    } catch (error) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message || 'Une erreur est survenue lors de la récupération des utilisateurs',
        error: error.code || 'E_SERVER_ERROR',
        details: error.details

      })
    }
  }

  /**
   * Liste toutes les tâches assignées à un utilisateur
   */
  public async listTasksForUser({ params, response }: HttpContext) {
    try {
      const payload = await createUserIdValidator.validate(params, {
        messagesProvider: taskUserMessagesProvider
      })

      const tasks = await this.taskUserService.listTasksForUser(payload.userId)
      return response.status(200).json({
        status: 'succees',
        data: tasks
      })
    } catch (error) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message || 'Une erreur est survenue lors de la récupération des tâches',
        error: error.code || 'E_SERVER_ERROR',
        details: error.details
      })
    }
  }

  /**
   * Vérifie si un utilisateur est assigné à une tâche spécifique
   */
  public async checkUserAssignment({ params, response }: HttpContext) {
    try {
      const payload = await createTaskUserValidator.validate(params, {
        messagesProvider: taskUserMessagesProvider
      })

      const isAssigned = await this.taskUserService.isUserAssignedToTask(payload.taskId, payload.userId)
      return response.status(200).json({
        status: 'succees',
        isAssigned
      })
    } catch (error) {
      return response.status(error.status || 500).json({
        status: 'error',
        message: error.message || 'Une erreur est survenue lors de la vérification de l\'assignation',
        error: error.code || 'E_SERVER_ERROR',
        details: error.details
      })
    }
  }
}
