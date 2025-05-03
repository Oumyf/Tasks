import {
  createTagMessagesProvider,
  createTagValidator,
  updateTagMessagesProvider,
  updateTagValidator
} from "#validators/tag";
import Tag from "#models/tag";
import {HttpContext} from "@adonisjs/core/http";
import {inject} from "@adonisjs/core";
import {DateTime} from "luxon";
@inject()
export class TagService {

  public generateSlug(name: string): string {
    // Transforme le nom en minuscule, enlève les espaces et remplace par des tirets
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  }
  public async createTag(data: any, auth: HttpContext['auth'] , taskGroupId?: number) {
    const userId = auth.user?.id
    if (!userId) {
      throw new Error("L'utilisateur n'est pas connecté")
    }

    const tagData = await createTagValidator.validate(data, {
      messagesProvider: createTagMessagesProvider,
    })

    const slug = this.generateSlug(tagData.name)

    const tag = await Tag.create({
      ...tagData,
      slug,
      taskGroupBy: taskGroupId,
    })

    return tag
  }

  public async listTags(auth: HttpContext['auth']) {
    const userId = auth.user?.id
    if (!userId) {
      throw new Error("L'utilisateur n'est pas connecté")
    }

    const tags = await Tag.query()
    return tags
  }

  public async updateTag(tagId: number, data: any, auth: HttpContext['auth']) {
    const userId = auth.user?.id
    if (!userId) {
      throw new Error("L'utilisateur n'est pas connecté")
    }

    const tagData = await updateTagValidator.validate(data, {
      messagesProvider: updateTagMessagesProvider,
    })


    const tag = await Tag.findOrFail(tagId)
    tag.merge({
      ...tagData,
    })
    await tag.save()
    return tag
  }

  public async softDeleteTag(tagId: number,auth: HttpContext['auth']) {
    const userId = auth.user?.id
    if (!userId) {
      throw new Error("L'utilisateur n'est pas connecté")
    }
    const tag = await Tag.query().where('id', tagId).first()
    if (!tag) {
      throw new Error("L'étiquette n'existe pas")
    }

    tag.deletedAt = DateTime.now()
    await tag.save()

    return { message: 'Etiquette supprimée avec succès' }
  }


}
