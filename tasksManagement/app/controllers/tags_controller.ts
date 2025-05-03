import {TagService} from "#services/tag_service";
import {HttpContext} from "@adonisjs/core/http";
import {inject} from "@adonisjs/core";


@inject()
export default class TagsController {

  constructor(protected tagService: TagService) {}
  public async createTag({request, auth}:HttpContext)
  {
    try {
      const { taskGroupBy, ...tagData } = request.all()
      const tag = await this.tagService.createTag(tagData, auth , taskGroupBy)
      return {
        status: 'success',
        message: 'Etiquette créée avec succes',
        tag
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'La création de tag a échouée',
        error: error.message,
        details: error.messages,
      }
    }
  }

  public async listTags({auth}:HttpContext)
  {
    try {
      const tags = await this.tagService.listTags(auth)
      return {
        status: 'success',
        message: 'Liste des étiquettes récupérée avec succès',
        tags
      }
    } catch (error) {
      return {
        message: 'La récupération des tags a échouée',
        error: error.message,
        details: error.messages,
      }
    }
  }

  public async updateTag({request, auth, params}:HttpContext)
  {
    try {
      const tag = await this.tagService.updateTag(params.id, request.all(), auth)
      return {
        status: 'success',
        message: 'Etiquette mise à jour avec succes',
        tag}
    } catch (error) {
      return {
        status: 'error',
        message: 'La mise à jour de étiquette a échouée',
        error: error.message,
        details: error.messages,
      }
    }
  }

  public async deleteTag({ params, auth } : HttpContext) {
    try {
      const result = await this.tagService.softDeleteTag(params.id , auth)
      return {
        status: 'success',
        message: 'Etiquette supprimée avec succes',
        result
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'La suppression de étiquette a échouée',
        error: error.message,
        details: error.messages,
      }
    }
  }
}
