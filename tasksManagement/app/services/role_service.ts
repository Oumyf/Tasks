import {HttpContext} from "@adonisjs/core/http";
import {createRoleValidator} from "#validators/role";
import Role from "#models/role";
import {inject} from "@adonisjs/core";

@inject()

export class RoleService {
  public async createRole(data: any, auth: HttpContext['auth'])
  {
    const userId = auth.user?.id
    if (!userId) {
      throw new Error("L'utilisateur n'est pas connecté")
    }
    const validatedRoleData = await createRoleValidator.validate({
      ...data,
      createdBy: userId
    })

    try {
      // Créer le role
      const role = await Role.create({
        ...validatedRoleData,
      });
      return role
    }
    catch (error) {
      throw new Error(`Erreur lors de la création du role: ${error.message}`)
    }
  }

  public async listRoles()
  {
    try {
      const roles = await Role.query().preload('permissions')
      return roles
    }
    catch (error) {
      throw new Error(`Erreur lors de la récupération des roles: ${error.message}`)
    }
  }


  public async updateRoles(id: number, data: any, auth: HttpContext['auth'])
  {
    const userId = auth.user?.id
    if (!userId) {
      throw new Error("L'utilisateur n'est pas connecté")
    }
    const validatedRoleData = await createRoleValidator.validate({
      ...data,
      updatedBy: userId
    })
    try {
      const role = await Role.findOrFail(id)
      role.merge(validatedRoleData)
      await role.save()
      return role
    }
    catch (error) {
      throw new Error(`Erreur lors de la mise à jour du role: ${error.message}`)
    }
  }

  public async deleteRole(id: number, auth: HttpContext['auth'])
  {
    const userId = auth.user?.id
    if (!userId) {
      throw new Error("L'utilisateur n'est pas connecté")
    }
    try {
      const role = await Role.findOrFail(id)
      await role.delete()
      return {message: 'Role supprimé avec succès'}
    }
    catch (error) {
      throw new Error(`Erreur lors de la suppression du role: ${error.message}`)
    }
  }
}
