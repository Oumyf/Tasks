import Task from "#models/task"
import User from "#models/user"
import { Exception } from '@adonisjs/core/exceptions'
import {inject} from "@adonisjs/core";
import TaskUser from "#models/task_user";
import {TaskAssignmentEmailService} from "#services/task_assignment_email_service";

@inject()

export class TaskUserService {

  constructor(protected taskAssignmentEmailService: TaskAssignmentEmailService) {}

  public async assignTaskToUser(taskId: number, userId: number) {
    try {
      const task = await Task.findOrFail(taskId)
      const user = await User.findOrFail(userId)

      const isAlreadyAssigned = await this.isUserAssignedToTask(taskId, userId)

      if (isAlreadyAssigned) {
        return { success: false, message: 'L\'utilisateur est déjà assigné à cette tâche' }
      }

      await task.related('assignees').attach([user.id])

      // Envoi de l'e-mail d'assignation
      await this.taskAssignmentEmailService.sendTaskAssignmentEmail(task, user)

      return { success: true, message: 'Tâche assignée avec succès' }
    } catch (error) {
      throw new Exception(
        `Erreur lors de l'assignation de la tâche: ${error.message}`,
      )
    }
  }

  public async assignTaskToUsers(taskId: number, userIds: number[]) {
    try {
      const task = await Task.findOrFail(taskId)

      const currentAssignees = await this.listUsersForTask(taskId)
      const currentAssigneeIds = currentAssignees.map(user => user.id)

      const newUserIds = userIds.filter(id => !currentAssigneeIds.includes(id))

      if (newUserIds.length === 0) {
        return { success: true, message: 'Aucun nouvel utilisateur à assigner' }
      }

      // Attacher les nouveaux utilisateurs
      await task.related('assignees').attach(newUserIds)

      // Envoyer des e-mails à chaque nouvel utilisateur assigné
      for (const userId of newUserIds) {
        const user = await User.findOrFail(userId)
        await this.taskAssignmentEmailService.sendTaskAssignmentEmail(task, user)
      }

      return {
        success: true,
        message: `Tâche assignée à ${newUserIds.length} utilisateur(s)`,
        assignedUsers: newUserIds
      }
    } catch (error) {
      throw new Exception(
        `Erreur lors de l'assignation multiple: ${error.message}`,
      )
    }
  }

  public async unassignTaskFromUser(taskId: number, userId: number) {
    try {
      const task = await Task.findOrFail(taskId)
      const user = await User.findOrFail(userId)

      await task.related('assignees').detach([user.id])
      return { success: true, message: 'Assignation supprimée avec succès' }
    } catch (error) {
      throw new Exception(
        `Erreur lors de la suppression de l'assignation: ${error.message}`,
      )
    }
  }

  public async listUsersForTask(taskId: number) {
    try {
      const task = await Task.findOrFail(taskId)
      return await task.related('assignees').query()
    } catch (error) {
      throw new Exception(
        `Erreur lors de la récupération des utilisateurs: ${error.message}`,
      )
    }
  }
  public async listTasksForUser(userId: number) {
    try {
      const user = await User.findOrFail(userId)
      return await user.related('assignedTasks').query()
    } catch (error) {
      throw new Exception(
        `Erreur lors de la récupération des tâches: ${error.message}`,
      )
    }
  }
  public async isUserAssignedToTask(taskId: number, userId: number): Promise<boolean> {
    try {
      // Vérifier directement dans la table pivot
      const assignment = await TaskUser.query()
        .where('task_id', taskId)
        .where('user_id', userId)
        .first()

      return !!assignment
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'assignation:', error)
      throw error
    }
  }
}
