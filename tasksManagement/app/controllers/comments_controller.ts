import {CommentService} from "#services/comment_service";
import {HttpContext} from "@adonisjs/core/http";
import {inject} from "@adonisjs/core";

@inject()
export default class CommentsController {

  constructor(protected commentService : CommentService) {
  }
  public async createComment({request, auth}:HttpContext)
  {
    try {
      const { taskId, ...commentData } = request.all()
      // Récupérer les fichiers envoyés
      const files = request.files("files", {
        extnames: ["jpg", "png", "pdf", "docx"],
        size: "5mb",
      });

      const comment = await this.commentService.createComment({...commentData, files }, auth, taskId)
      return {
        status: 'success',
        message: 'Commentaire créé avec succes',
        comment
      };
    } catch (error) {
      return {
        status : 'error',
        message: 'La création de commentaire a échouée',
        error: error.message,
        details: error.messages,
      }
    }
  }

  public async listComments({auth}:HttpContext)
  {
    try {
      const comments = await this.commentService.listComments(auth)
      return {
        status: 'success',
        message: 'Commentaires récupérés avec succes',
        comments
      };
    } catch (error) {
      return {
        status : 'error',
        message: 'La récupération des commentaires a échouée',
        error: error.message,
        details: error.messages,
      }
    }
  }


  public async updateComment({request, auth, params}:HttpContext)
  {
    try {
      const comment = await this.commentService.updateComment(params.id, request.all(), auth)
      return {
        status: 'success',
        message: 'Commentaire mis à jour avec succes',
        comment
      }

    } catch (error) {
      return {
        status : 'error',
        message: 'La mise à jour de commentaire a échouée',
        error: error.message,
        details: error.messages,
      }
    }
  }

  public async deleteComment({ params, auth } : HttpContext) {
    try {
      const result = await this.commentService.deleteComment(params.id, auth)
      return {
        status: 'success',
        message: 'Commentaire supprimé avec succes',
        result
      }
    }
    catch (error) {
      return {
        status : 'error',
        message: 'La suppression de commentaire a échouée',
        error: error.message,
        details: error.messages,
      }
    }
  }
}
