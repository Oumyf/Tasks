import { HttpContext } from "@adonisjs/core/http"
import { inject } from '@adonisjs/core'
import { UserRoleService } from "#services/user_role_service"
import {
  createUserRoleValidator,
  userRoleMessagesProvider,
  createUserIdValidator,
  createRoleIdValidator,
  assignRolesToUserValidator,
  assignRoleToUsersValidator
} from "#validators/user_role"

@inject()
export default class UserRolesController {
  constructor(protected userRoleService: UserRoleService) {}

  /**
   * Assigne un rôle à un utilisateur
   */
  public async assignRoleToUser({ params, auth, response }: HttpContext) {
    try {
      // Validation
      const payload = await createUserRoleValidator.validate(params, {
        messagesProvider: userRoleMessagesProvider
      })

      const result = await this.userRoleService.assignRoleToUser(auth, payload.userId, payload.roleId)

      return response.status(200).json({
        success: true,
        message: "Rôle assigné avec succès",
        data: {
          assignment: result,
          userId: payload.userId,
          roleId: payload.roleId,
          assignedBy: auth.user?.id,
          timestamp: new Date().toISOString()
        }
      })
    } catch (error) {
      console.error('Erreur lors de l\'assignation du rôle:', error)

      return response.status(error.status || 500).json({
        success: false,
        message: error.message || 'Une erreur est survenue lors de l\'assignation du rôle',
        error: error.code || 'E_SERVER_ERROR',
        details: {
          context: 'assignRoleToUser',
          params: params,
          timestamp: new Date().toISOString(),
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }
      })
    }
  }

  /**
   * Assigne un rôle à plusieurs utilisateurs
   */
  public async assignRoleToUsers({ params, request, auth, response }: HttpContext) {
    try {
      const roleIdPayload = await createRoleIdValidator.validate(params, {
        messagesProvider: userRoleMessagesProvider
      })

      const userIdsPayload = await assignRoleToUsersValidator.validate(request.body(), {
        messagesProvider: userRoleMessagesProvider
      })

      const result = await this.userRoleService.assignRoleToUsers(auth, userIdsPayload.userIds, roleIdPayload.roleId)

      return response.status(200).json({
        success: true,
        message: "Rôle assigné à plusieurs utilisateurs avec succès",
        data: {
          assignments: result,
          userCount: userIdsPayload.userIds.length,
          userIds: userIdsPayload.userIds,
          roleId: roleIdPayload.roleId,
          assignedBy: auth.user?.id,
          timestamp: new Date().toISOString()
        }
      })
    } catch (error) {
      console.error('Erreur lors de l\'assignation multiple:', error)

      return response.status(error.status || 500).json({
        success: false,
        message: error.message || 'Une erreur est survenue lors de l\'assignation multiple',
        error: error.code || 'E_SERVER_ERROR',
        details: {
          context: 'assignRoleToUsers',
          params: params,
          requestBody: request.body(),
          timestamp: new Date().toISOString(),
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }
      })
    }
  }

  /**
   * Retire l'assignation d'un rôle à un utilisateur
   */
  public async unassignRoleFromUser({ params, auth, response }: HttpContext) {
    try {
      const payload = await createUserRoleValidator.validate(params, {
        messagesProvider: userRoleMessagesProvider
      })

      const result = await this.userRoleService.unassignRoleFromUser(auth, payload.userId, payload.roleId)

      return response.status(200).json({
        success: true,
        message: "Assignation du rôle retirée avec succès",
        data: {
          userId: payload.userId,
          roleId: payload.roleId,
          unassignedBy: auth.user?.id,
          recordsAffected: result,
          timestamp: new Date().toISOString()
        }
      })
    } catch (error) {
      console.error('Erreur lors du retrait de l\'assignation:', error)

      return response.status(error.status || 500).json({
        success: false,
        message: error.message || 'Une erreur est survenue lors du retrait de l\'assignation',
        error: error.code || 'E_SERVER_ERROR',
        details: {
          context: 'unassignRoleFromUser',
          params: params,
          timestamp: new Date().toISOString(),
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }
      })
    }
  }

  /**
   * Liste tous les rôles assignés à un utilisateur
   */
  public async listRolesForUser({ params, auth, response }: HttpContext) {
    try {
      const payload = await createUserIdValidator.validate(params, {
        messagesProvider: userRoleMessagesProvider
      })

      const roles = await this.userRoleService.listRolesForUser(auth, payload.userId)

      return response.status(200).json({
        success: true,
        message: `${roles.length} rôle(s) trouvé(s) pour l'utilisateur ${payload.userId}`,
        data: {
          roles,
          count: roles.length,
          userId: payload.userId,
          requestedBy: auth.user?.id,
          timestamp: new Date().toISOString()
        }
      })
    } catch (error) {
      console.error('Erreur lors de la récupération des rôles:', error)

      return response.status(error.status || 500).json({
        success: false,
        message: error.message || 'Une erreur est survenue lors de la récupération des rôles',
        error: error.code || 'E_SERVER_ERROR',
        details: {
          context: 'listRolesForUser',
          params: params,
          timestamp: new Date().toISOString(),
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }
      })
    }
  }

  /**
   * Liste tous les utilisateurs ayant un rôle spécifique
   */
  public async listUsersForRole({ params, auth, response }: HttpContext) {
    try {
      const payload = await createRoleIdValidator.validate(params, {
        messagesProvider: userRoleMessagesProvider
      })

      const users = await this.userRoleService.listUsersForRole(auth, payload.roleId)

      return response.status(200).json({
        success: true,
        message: `${users.length} utilisateur(s) trouvé(s) pour le rôle ${payload.roleId}`,
        data: {
          users,
          count: users.length,
          roleId: payload.roleId,
          requestedBy: auth.user?.id,
          timestamp: new Date().toISOString()
        }
      })
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error)

      return response.status(error.status || 500).json({
        success: false,
        message: error.message || 'Une erreur est survenue lors de la récupération des utilisateurs',
        error: error.code || 'E_SERVER_ERROR',
        details: {
          context: 'listUsersForRole',
          params: params,
          timestamp: new Date().toISOString(),
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }
      })
    }
  }

  /**
   * Assigne plusieurs rôles à un utilisateur
   */
  public async assignRolesToUser({ params, request, auth, response }: HttpContext) {
    try {
      const userIdPayload = await createUserIdValidator.validate(params, {
        messagesProvider: userRoleMessagesProvider
      })

      const roleIdsPayload = await assignRolesToUserValidator.validate(request.body(), {
        messagesProvider: userRoleMessagesProvider
      })

      const result = await this.userRoleService.assignRolesToUser(auth, userIdPayload.userId, roleIdsPayload.roleIds)

      return response.status(200).json({
        success: true,
        message: "Rôles assignés à l'utilisateur avec succès",
        data: {
          assignments: result,
          roleCount: roleIdsPayload.roleIds.length,
          roleIds: roleIdsPayload.roleIds,
          userId: userIdPayload.userId,
          assignedBy: auth.user?.id,
          timestamp: new Date().toISOString()
        }
      })
    } catch (error) {
      console.error('Erreur lors de l\'assignation des rôles:', error)

      return response.status(error.status || 500).json({
        success: false,
        message: error.message || 'Une erreur est survenue lors de l\'assignation des rôles',
        error: error.code || 'E_SERVER_ERROR',
        details: {
          context: 'assignRolesToUser',
          params: params,
          requestBody: request.body(),
          timestamp: new Date().toISOString(),
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }
      })
    }
  }
}
