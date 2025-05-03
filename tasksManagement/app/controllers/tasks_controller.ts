// import type { HttpContext } from '@adonisjs/core/http'

import {TaskService} from "#services/task_service";
import {HttpContext} from "@adonisjs/core/http";
import {inject} from "@adonisjs/core";
import Task from "#models/task";

@inject()
export default class TaskController {

  constructor(protected taskService: TaskService) {}
  public async createTask({request, auth}: HttpContext) {
    try {
      const { taskGroupId, ...taskData } = request.all();

      // Récupérer les fichiers envoyés
      const files = request.files("files", {
        extnames: ["jpg", "png", "pdf", "docx"],
        size: "5mb",
      });

      // Créer la tâche avec les fichiers
      const task = await this.taskService.createTask({ ...taskData, files }, auth, taskGroupId);

      return {
        status: 'success',
        message: 'Tâche créée avec succès',
        task
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'La création de la tâche a échoué',
        error: error.message,
        details: error.messages,
      };
    }
  }

  public async listTasks({auth}:HttpContext)
    {
      try {
        const tasks = await this.taskService.listTasks(auth)
        return {
          status: 'success',
          message: 'Tâches récupérées avec succès',
          tasks
        };
      } catch (error) {
        return {
          status: 'error',
          message: 'La récupération des taches a échouée',
          error: error.message,
          details: error.messages,
        }
      }
    }
    public async updateTask({request, auth, params}:HttpContext)
    {
      try {
        const task = await this.taskService.updateTask(params.id, request.all(), auth)
        return {
          status: 'success',
          message: 'Tache mise à jour avec succes',
          task
        }
      } catch (error) {
        return {
          status: 'error',
          message: 'La mise à jour de tache a échouée',
          error: error.message,
          details: error.messages,
        }
      }
    }

    public async changeTaskStatus({request, auth, params}:HttpContext)
    {
      try {
        const task = await this.taskService.updateTaskStatus(params.id, request.input('status'), auth)
        const updatedTask = await Task.query().where('id', params.id).first();
        return {
          status: 'success',
          message: 'Statut de la tâche mis à jour avec succès',
          task,
          updatedTask
        }
      } catch (error) {
        return {
          status: 'error',
          message: 'La mise à jour du statut de la tâche a échouée',
          error: error.message,
          details: error.messages,
        }
      }
    }

    public async changeTaskGroup({request, auth, params}:HttpContext)
    {
      try {
        const task = await this.taskService.updateTaskGroupTask(params.id, request.input('taskGroupId'), auth)
        const updatedTask = await Task.query().where('id', params.id).first();
        return {
          status: 'success',
          message: 'Groupe de la tâche mis à jour avec succès',
          task,
          updatedTask
        }
      } catch (error) {
        return {
          status: 'error',
          message: 'La mise à jour du groupe de la tâche a échouée',
          error: error.message,
          details: error.messages,
        }
      }
    }

    public async updateProgression({request, auth, params}:HttpContext)
    {
      try {
        const task = await this.taskService.updateProgressionTask(params.id, request.input('progression'), auth)
        const updatedTask = await Task.query().where('id', params.id).first();
        return {
          status: 'success',
          message: 'GProgression mise à jour avec succès',
          task,
          updatedTask
        }
      } catch (error) {
        return {
          status: 'error',
          message: 'La mise à jour de la progression a échouée',
          error: error.message,
          details: error.messages,
        }
      }
    }

    public async getTasksInLate()
    {
      try {
        const tasks = await this.taskService.getTaskInLate()
        return {
          status: 'success',
          message: 'Tâches en retard récupérées avec succès',
          tasks
        };
      } catch (error) {
        return {
          status: 'error',
          message: 'La récupération des taches a échouée',
          error: error.message,
          details: error.messages,
        }
      }
    }

  public async deleteTask({ params, auth } : HttpContext)
  {
    try {
      const result = await this.taskService.softDeleteTask(params.id , auth)
      return {
        status: 'success',
        message: 'Tâche supprimée avec succès',
        result
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        details: error.messages,
      }
    }
  }

  }
