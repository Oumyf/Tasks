import UserRole from "#models/user_role";
import {HttpContext} from "@adonisjs/core/http";

export class UserRoleService {
  /**
   * Assigne un rôle à un utilisateur
   */
  public async assignRoleToUser(auth: HttpContext['auth'], userId: number, roleId: number) {
    const ConnecteduserId = auth.user?.id;
    if (!ConnecteduserId) {
      throw new Error("L'utilisateur n'est pas connecté");
    }

    const userRole = await UserRole.create({
      userId,
      roleId,
    });

    return userRole;
  }

  /**
   * Assigne un rôle à plusieurs utilisateurs
   */
  public async assignRoleToUsers(auth: HttpContext['auth'], userIds: number[], roleId: number) {
    const ConnecteduserId = auth.user?.id;
    if (!ConnecteduserId) {
      throw new Error("L'utilisateur n'est pas connecté");
    }

    const userRoles = await UserRole.createMany(userIds.map(userId => ({
      userId,
      roleId,
    })));

    return userRoles;
  }

  /**
   * Retire l'assignation d'un rôle à un utilisateur
   */
  public async unassignRoleFromUser(auth: HttpContext['auth'], userId: number, roleId: number) {
    const ConnecteduserId = auth.user?.id;
    if (!ConnecteduserId) {
      throw new Error("L'utilisateur n'est pas connecté");
    }

    // Retourne le nombre d'enregistrements supprimés
    const result = await UserRole.query().where('userId', userId).where('roleId', roleId).delete();
    return result;
  }

  /**
   * Liste tous les rôles assignés à un utilisateur
   */
  public async listRolesForUser(auth: HttpContext['auth'], userId: number) {
    const ConnecteduserId = auth.user?.id;
    if (!ConnecteduserId) {
      throw new Error("L'utilisateur n'est pas connecté");
    }

    return await UserRole.query().where('userId', userId).preload('role');
  }

  /**
   * Liste tous les utilisateurs ayant un rôle spécifique
   */
  public async listUsersForRole(auth: HttpContext['auth'], roleId: number) {
    const ConnecteduserId = auth.user?.id;
    if (!ConnecteduserId) {
      throw new Error("L'utilisateur n'est pas connecté");
    }

    return await UserRole.query().where('roleId', roleId).preload('user');
  }

  /**
   * Assigne plusieurs rôles à un utilisateur
   */
  public async assignRolesToUser(auth: HttpContext['auth'], userId: number, roleIds: number[]) {
    const ConnecteduserId = auth.user?.id;
    if (!ConnecteduserId) {
      throw new Error("L'utilisateur n'est pas connecté");
    }

    const userRoles = await UserRole.createMany(roleIds.map(roleId => ({
      userId,
      roleId,
    })));

    return userRoles;
  }
}
