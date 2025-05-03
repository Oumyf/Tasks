import { HttpContext } from "@adonisjs/core/http";
import {
  createCommentValidator,
  createCommentMessagesProvider,
  updateCommentValidator,
  updateCommentMessagesProvider
} from "#validators/comment";
import Comment from "#models/comment";
import File from "#models/file";
import {TaskService} from "#services/task_service";
import {inject} from "@adonisjs/core";
import {DateTime} from "luxon";

@inject()
export class CommentService {
  constructor(protected taskService: TaskService) {}

  public async createComment(data: any, auth: HttpContext['auth'], taskId?: number) {
    const userId = auth.user?.id;

    if (!userId) {
      throw new Error("L'utilisateur n'est pas connecté");
    }

    const { files, ...commentData } = data;

    const validatedCommentData = await createCommentValidator.validate(commentData, {
      messagesProvider: createCommentMessagesProvider,
    });

    const comment = await Comment.create({
      ...validatedCommentData,
      userId: userId,
      taskId: taskId ?? null,
      dateCreation: validatedCommentData.dateCreation ? DateTime.fromJSDate(validatedCommentData.dateCreation) : null,
    });

    // 📂 Gestion des fichiers
    console.log('Fichiers recus:', files);

    if (files && files.length > 0) {
      try {
        for (const file of files) {
          console.log('Fichiers en cours:', file.clientName)
        
          const fileRecord = await File.create({
            fileableId: comment.id,
            fileableType: 'comments',
            name: file.clientName,
          });

          console.log('File record created:', fileRecord.toJSON());
        }
      } catch (error) {
        console.error('Error processing files:', error);
        await comment.delete();
        throw new Error(`Erreur lors du traitement des fichiers: ${error.message}`);
      }
    } else {
      console.log('No files to process');
    }

    return comment;
  }

  public async listComments(auth: HttpContext['auth']) {
    const userId = auth.user?.id
    if (!userId) {
      throw new Error("L'utilisateur n'est pas connecté")
    }

    // Récupérer tous les commentaires
    const comments = await Comment.query()
      .where('userId', userId)

    // Récupérer tous les fichiers pour ces tâches
    const commentIds = comments.map(comment => comment.id)
    if (commentIds.length > 0) {
      const allFiles = await File.query()
        .where('fileableType', 'comments')
        .whereIn('fileableId', commentIds)

      for (const comment of comments) {
        comment.$setRelated('files', allFiles.filter(file => file.fileableId === comment.id))      }
    }

    return comments
  }

  public async updateComment(commentId: number, data: any, auth: HttpContext['auth']) {
    const userId = auth.user?.id;
    if (!userId) {
      throw new Error("L'utilisateur n'est pas connecté");
    }

    const { files, ...commentData } = data;

    const validatedCommentData = await updateCommentValidator.validate(commentData, {
      messagesProvider: updateCommentMessagesProvider,
    });

    const comment = await Comment.query().where('userId', userId).where('id', commentId).first()
    if (!comment) {
      throw new Error("Le commentaire n'existe pas ou ne vous appartient pas")
    }
    comment.merge({
      ...validatedCommentData,
    });
    await comment.save();

    // 📂 Gestion des fichiers
    if (files && files.length > 0) {
      try {
        for (const file of files) {
          

          await File.create({
            fileableId: comment.id,
            fileableType: 'comments',
            name: file.clientName,
          });
        }
      } catch (error) {
        throw new Error(`Erreur lors du traitement des fichiers: ${error.message}`);
      }
    }

    return comment;
  }


  public async deleteComment(commentId: number, auth: HttpContext['auth']) {
    const userId = auth.user?.id;
    if (!userId) {
      throw new Error("L'utilisateur n'est pas connecté");
    }
    const comment = await Comment.query().where('userId', userId).where('id', commentId).first()
    if (!comment) {
      throw new Error("Le commentaire n'existe pas ou ne vous appartient pas")
    }
    await comment.delete();

    return { message: 'Commentaire supprimé avec succès' };
  }


}

