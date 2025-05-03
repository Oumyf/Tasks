import {HttpContext} from "@adonisjs/core/http";
import {RoleService} from "#services/role_service";
import {inject} from "@adonisjs/core";

@inject()

export default class RolesController {

  constructor(protected roleService : RoleService) {
  }
  public async createRole({request, auth, response}: HttpContext) {
    try {
      const role = await this.roleService.createRole(request.all(), auth)
      return response.created({message: 'Role créé avec succès', role})
    } catch (error) {
      return {
        status: 'error',
        message: 'La création de role a échouée',
        error: error.message,
        details: error.messages
      }
    }
  }

  public async listRoles() {
    try {
      const roles = await this.roleService.listRoles()
      return {
        status: 'success',
        message: 'Liste des roles récupérée avec succès',
        roles
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'La récupération des roles a échouée',
        error: error.message,
        details: error.messages
      }
    }
  }

  public async updateRoles({request, auth, params}: HttpContext) {
    try {
      const role = await this.roleService.updateRoles(params.id, request.all(), auth)
      return {
        status: 'success',
        message: 'Role mis à jour avec succès',
        role
      }
    } catch (error) {
      return {
        message: 'La mise à jour de role a échouée',
        error: error.message,
        details: error.messages
      }
    }
  }

  public async deleteRole({params, auth}: HttpContext) {
    try {
      const result = await this.roleService.deleteRole(params.id, auth)
      return {
        status: 'success',
        message: 'Role supprimé avec succès',
        result
      }
    } catch (error) {
      return {
        status: 'error',
        message: 'La suppression de role a échouée',
        error: error.message,
        details: error.messages
      }
    }
  }
}
