import {HttpContext} from "@adonisjs/core/http";
import {createTaskGroupValidator, taskGroupMessagesProvider} from "#validators/task_group";
import TaskGroup from "#models/task_group";
import {inject} from "@adonisjs/core";
import {DateTime} from "luxon";
import {updateTagValidator} from "#validators/tag";

@inject()

export class TaskGroupService {
  public async createTaskGroup(data: any, auth: HttpContext['auth'], projectId?: number) {
    const userId = auth.user?.id
    if (!userId) {
      throw new Error("L'utilisateur n'est pas connecté")
    }

    const taskData = await createTaskGroupValidator.validate(data, {
      messagesProvider: taskGroupMessagesProvider,
    })

    const taskGroup = await TaskGroup.create({
      ...taskData,
      createdBy: userId,
      projectId: projectId ?? null,
    })

    return taskGroup
  }

  public async listGroupTasks(auth: HttpContext['auth']) {
    const userId = auth.user?.id
    if (!userId) {
      throw new Error("L'utilisateur n'est pas connecté")
    }

    const task_groups = await TaskGroup.query().where('createdBy', userId).whereNull('deletedAt').preload('tags').preload('tasks');
    return task_groups
  }

  public async updateTaskGroup(taksGroupId: number, data: any, auth: HttpContext['auth']) {
    const userId = auth.user?.id
    if (!userId) {
      throw new Error("L'utilisateur n'est pas connecté")
    }

    const taskGroupData = await updateTagValidator.validate(data, {
      messagesProvider: taskGroupMessagesProvider,
    })


    const taskGroup = await TaskGroup.findOrFail(taksGroupId)
    taskGroup.merge({
      ...taskGroupData,
    })
    await taskGroup.save()
    return taskGroup
  }

  public async softDeleteTask(taskId: number , auth : HttpContext['auth']) {

    const userId = auth.user?.id
    if (!userId) {
      throw new Error("L'utilisateur n'est pas connecté")
    }
    const taskGroup = await TaskGroup.find(taskId)

    if (!taskGroup) {
      throw new Error('Groupe de Tâche non trouvé')
    }
    taskGroup.deletedAt = DateTime.now()
    await taskGroup.save()

    return { message: 'Groupe de Tâches supprimé avec succès' }
  }
}
