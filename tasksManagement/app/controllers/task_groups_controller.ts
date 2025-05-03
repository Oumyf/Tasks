import {HttpContext} from "@adonisjs/core/http";
import {TaskGroupService} from "#services/task_group_service";
import {inject} from "@adonisjs/core";

@inject()

export default class TaskGroupController {
  constructor(protected taskGroupService: TaskGroupService) {
  }
  public async createTaskGroup({request, auth}:HttpContext)
  {
    try {
      const { projectId, ...taskData } = request.all()
      const task = await this.taskGroupService.createTaskGroup(taskData, auth, projectId)
      return {
        status: 'success',
        message: 'Groupe de Taches créé avec succes',
        task
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'La création de tache a échouée',
        error: error.message,
        details: error.messages,
      }
    }
  }

  public async listGroupTask({auth}:HttpContext)
  {
    try {
      const task_groups = await this.taskGroupService.listGroupTasks(auth)
      return {
        status: 'success',
        message: 'Liste des groupes de taches',
        task_groups
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'La récupération des groupes de taches a échouée',
        error: error.message,
        details: error.messages,
      }
    }
  }

  public async updateTaskGroup({request, auth, params}:HttpContext)
  {
    try {
      const taskGroup = await this.taskGroupService.updateTaskGroup(params.id, request.all(), auth)
      return {
        status: 'success',
        message: 'Groupe de taches mise à jour avec succes',
        taskGroup
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'La mise à jour de groupe de taches a échouée',
        error: error.message,
        details: error.messages,
      }
    }
  }

  public async deleteTaskGroup({ params, auth} : HttpContext) {
    try {
      const result = await this.taskGroupService.softDeleteTask(params.id , auth)
      return {
        status: 'success',
        message: 'Groupe de taches supprimé avec succes',
        result
      }
    } catch (error) {
      return {
        status: 'error',
        message: error.message ,
        error: error.message,
        details: error.messages,
      }

    }
  }
}
