// import type { HttpContext } from '@adonisjs/core/http'
import {
    createRolePermissionMessagesProvider,
    createRoleProjectRessourcePermissionValidator
  } from "#validators/role_permission";
  import {HttpContext} from "@adonisjs/core/http";
  import {RolePermissionService} from "#services/role_permission_service";
  import {inject} from "@adonisjs/core";
  
  @inject()
  export default class RoleProjectRessourcePermissionsController {
    constructor(protected rolePermissionService: RolePermissionService) {
    }
  
  // Dans le contrôleur
    public async assignPermissionsToRole({ auth, request, response }: HttpContext) {
      const connectedUserId = auth.user?.id;
      if (!connectedUserId) {
        throw new Error("L'utilisateur n'est pas connecté");
      }
  
      try {
        const payload = await createRoleProjectRessourcePermissionValidator.validate(request.all(), {
          messagesProvider: createRolePermissionMessagesProvider
        });
  
        const { roleId, projectRessourcePermissionsIds } = payload;
        const result = await this.rolePermissionService.assignPermissionsToRole(auth, roleId, projectRessourcePermissionsIds);
  
        return response.created({
          status: 'success',
          payload,
          assignedPermissions: result.assignedPermissions.map(p => p.name),
          message: result.message,
          data: result.role
        });
      } catch (error) {
        return response.status(error.status || 500).json({
          success: false,
          message: error.message || "Une erreur est survenue lors de l'assignation du rôle",
          error: error.code || 'E_SERVER_ERROR'
        });
      }
    }
  
    public async removePermissionFromRole({ auth, request, response }: HttpContext) {
      const connectedUserId = auth.user?.id;
      if (!connectedUserId) {
        throw new Error("L'utilisateur n'est pas connecté");
      }
  
      try {
        const payload = await createRoleProjectRessourcePermissionValidator.validate(request.all(), {
          messagesProvider: createRolePermissionMessagesProvider
        });
  
        const { roleId, projectRessourcePermissionsIds } = payload;
        const result = await this.rolePermissionService.removePermissionFromRole(auth, roleId, projectRessourcePermissionsIds);
  
        return response.created({
          status: 'success',
          payload,
          removedPermissions: result.removedPermissions.map(p => p.name),
          message: result.message,
          data: result.role
        });
      } catch (error) {
        return response.status(error.status || 500).json({
          success: false,
          message: error.message || "Une erreur est survenue lors de la suppression du rôle",
          error: error.code || 'E_SERVER_ERROR'
        });
      }
    }
  
    public async getRolePermissions({ auth, response , params }: HttpContext) {
      const connectedUserId = auth.user?.id;
      if (!connectedUserId) {
        throw new Error("L'utilisateur n'est pas connecté");
      }
  
      try {
        const roleId  = params.roleId;
        const result = await this.rolePermissionService.getRolePermissions(auth, roleId);
  
        return response.ok({
          status: 'success',
          data: result
        });
      } catch (error) {
        return response.status(error.status || 500).json({
          success: false,
          message: error.message || "Une erreur est survenue lors de la récupération des permissions du rôle",
          error: error.code || 'E_SERVER_ERROR'
        });
      }
    }
  
  
  }
  