import { HttpContext } from '@adonisjs/core/http'
import {createTaskValidator, taskMessagesProvider, updateTaskValidator} from '#validators/task'
import Task, {TaskStatus} from '#models/task'
import {DateTime} from "luxon";
import File from '#models/file';
import {TaskAssignmentEmailService} from "#services/task_assignment_email_service";
import {inject} from "@adonisjs/core";

@inject()
export class TaskService {

  constructor(protected taskAssignmentEmailService: TaskAssignmentEmailService) {}


  public async createTask(data: any, taskGroupId?: number)
  {
    // const userId = auth.user?.id;
    // if (!userId) {
    //   throw new Error("L'utilisateur n'est pas connecté");
    // }

    const { files, ...taskData } = data;

    const validatedTaskData = await createTaskValidator.validate(taskData, {
      messagesProvider: taskMessagesProvider,
    });

    // Création de la tâche
    const task = await Task.create({
      ...validatedTaskData,
      // createdBy: userId,
      taskGroupId: taskGroupId ?? null,
      dateDebut: validatedTaskData.dateDebut ? DateTime.fromJSDate(validatedTaskData.dateDebut) : null,
      dateFin: validatedTaskData.dateFin ? DateTime.fromJSDate(validatedTaskData.dateFin) : null,
    });

    // 📂 Gestion des fichiers
    if (files && files.length > 0) {
      try {
        for (const file of files) {
        

          // Enregistrer les informations du fichier dans la base de données
          await File.create({
            fileableId: task.id,
            fileableType: 'tasks',
            name: file.clientName,
          });
        }
      } catch (error) {
        // En cas d'erreur, supprimer la tâche créée
        await task.delete();
        throw new Error(`Erreur lors du traitement des fichiers: ${error.message}`);
      }
    }

    return task;
  }

  public convertToBase64(buffer: Buffer, mimeType: string): string {
    // Convertir le buffer en base64 et formaté correctement pour le service AWS
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
  }
  public createSecureFileName(originalName: string): string {
    return encodeURIComponent(originalName)
      .replace(/%20/g, '_')
      .replace(/%/g, '')
      .replace(/'/g, '')
      .replace(/ /g, '_');
  }
  public async listTasks() {
    // const userId = auth.user?.id
    // if (!userId) {
    //   throw new Error("L'utilisateur n'est pas connecté")
    // }

    // Récupérer toutes les tâches
    const tasks = await Task.query()
      // .where('createdBy', userId)
      .whereNull('deletedAt')

    // Récupérer tous les fichiers pour ces tâches
    const taskIds = tasks.map(task => task.id)
    if (taskIds.length > 0) {
      const allFiles = await File.query()
        .where('fileableType', 'tasks')
        .whereIn('fileableId', taskIds)

      for (const task of tasks) {
        task.$setRelated('files', allFiles.filter(file => file.fileableId === task.id))      }
    }

    return tasks
  }
  public async updateTask(taskId: number, data: any) {
    // const userId = auth.user?.id;
    // if (!userId) {
    //   throw new Error("L'utilisateur n'est pas connecté");
    // }

    const { files, ...taskData } = data;

    const validatedTaskData = await updateTaskValidator.validate(taskData, {
      messagesProvider: taskMessagesProvider,
    });

    const task = await Task.query()
    // .where('createdBy', userId)
    .where('id', taskId).first();
    if (!task) {
      throw new Error("La tâche n'existe pas ou ne vous appartient pas");
    }
    task.merge({
      ...validatedTaskData,
    });
    await task.save();

    // 📂 Gestion des fichiers
    if (files && files.length > 0) {
      try {
        for (const file of files) {
          

          await File.create({
            fileableId: task.id,
            fileableType: 'tasks',
            name: file.clientName,
          });
        }
      } catch (error) {
        throw new Error(`Erreur lors du traitement des fichiers: ${error.message}`);
      }
    }

    return task;
  }
  public async softDeleteTask(taskId: number,auth: HttpContext['auth']) {
    const userId = auth.user?.id
    if (!userId) {
      throw new Error("L'utilisateur n'est pas connecté")
    }
    const task = await Task.query().where('createdBy', userId).where('id', taskId).first()
    if (!task) {
      throw new Error("La tâche n'existe pas ou ne vous appartient pas")
    }
    // Supprimer les fichiers associés
    const files = await File.query().where('fileableId', task.id).where('fileableType', 'tasks');
    for (const file of files) {
      await file.delete();
    }
  if(task.deletedAt == null){
    task.deletedAt = DateTime.now()
    await task.save()
    return { message: 'Tâche supprimée avec succès' }
  }
    return { message: "La Tâche n'existe plus" }




  }

  public async updateTaskStatus(taskId: number, status: string, auth: HttpContext['auth']) {
    const userId = auth.user?.id;
    if (!userId) {
      throw new Error("L'utilisateur n'est pas connecté");
    }
    const task = await Task.query().where('createdBy', userId).where('id', taskId).first();
    if (!task) {
      throw new Error("La tâche n'existe pas ou ne vous appartient pas");
    }
    task.merge({
      status : status as TaskStatus,
    });
    await task.save();
  }

  public async updateTaskGroupTask(taskId: number, taskGroupId: number, auth: HttpContext['auth']) {
    const userId = auth.user?.id;
    if (!userId) {
      throw new Error("L'utilisateur n'est pas connecté");
    }
    const task = await Task.query().where('createdBy', userId).where('id', taskId).first();
    if (!task) {
      throw new Error("La tâche n'existe pas ou ne vous appartient pas");
    }
    task.merge({
      taskGroupId,
    });
    await task.save();
  }
  public async updateProgressionTask(taskId: number, progression: number, auth: HttpContext['auth']) {
    const userId = auth.user?.id;
    if (!userId) {
      throw new Error("L'utilisateur n'est pas connecté");
    }
    const task = await Task.query().where('createdBy', userId).where('id', taskId).first();
    if (!task) {
      throw new Error("La tâche n'existe pas ou ne vous appartient pas");
    }
    task.merge({
      progression,
    });
    await task.save();
  }


  public async getTaskInLate() {
    const tasks = await Task.query()
      .where('dateFin', '<', DateTime.now().toJSDate())
      .whereNull('deletedAt')
      .where('status', '!=', 'completed')
      .preload('assignees')
    // for (const task of tasks) {
    //   for (const user of task.assignees) {
    //     await this.taskAssignmentEmailService.sendLateTaskEmail(task, user)
    //   }
    // }
    return tasks
  }

  public async sendMailToAssigneesTaskInLate(tasks: Task[]) {
    // Utilisation de Promise.all pour envoyer les emails en parallèle
    const emailPromises = tasks.flatMap(task =>
      task.assignees.map(user => this.taskAssignmentEmailService.sendLateTaskEmail(task, user))
    )

    try {
      await Promise.all(emailPromises)
      console.log(`📧 Emails envoyés pour ${tasks.length} tâches en retard`)
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi groupé des emails :", error)
      throw error
    }
  }

}
