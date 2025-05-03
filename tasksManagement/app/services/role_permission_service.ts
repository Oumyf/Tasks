import {HttpContext} from "@adonisjs/core/http";
import Role from "#models/role";
import {inject} from "@adonisjs/core";
import ProjectRessourcePermission from "#models/permission";

@inject()

export class RolePermissionService {
  public async assignPermissionsToRole(auth: HttpContext['auth'], roleId: number, permissionIds: number[]) {
    const connectedUserId = auth.user?.id;
    if (!connectedUserId) {
      throw new Error("L'utilisateur n'est pas connecté");
    }

    const role = await Role.findOrFail(roleId);

    const existingPermissions = await role.related('permissions').query().select('id');
    const existingPermissionIds = existingPermissions.map(p => p.id);

    const newPermissionIds = permissionIds.filter(id => !existingPermissionIds.includes(id));

    if (newPermissionIds.length > 0) {
      await role.related('permissions').attach(newPermissionIds);
    }

    const assignedPermissions = await ProjectRessourcePermission.query()
      .whereIn('id', newPermissionIds)
      .select('id', 'name');

    return {
      role,
      assignedPermissions,
      message: assignedPermissions.length > 0
        ? `Permissions ${assignedPermissions.map(p => p.name).join(', ')} assignées avec succès.`
        : "Toutes les permissions étaient déjà assignées."
    };
  }


  public async removePermissionFromRole(auth: HttpContext['auth'], roleId: number, permissionIds: number[]) {
    const connectedUserId = auth.user?.id;
    if (!connectedUserId) {
      throw new Error("L'utilisateur n'est pas connecté");
    }

    // Récupérer le rôle
    const role = await Role.findOrFail(roleId);

    // Récupérer les permissions associées au rôle
    const assignedPermissions = await role.related('permissions')
      .query()
      .whereIn('project_ressource_permissions.id', permissionIds) // ✅ Correction ici
      .select('project_ressource_permissions.id', 'project_ressource_permissions.permission_name');

    if (assignedPermissions.length === 0) {
      return {
        role,
        removedPermissions: [],
        message: "Aucune de ces permissions n'était attribuée à ce rôle."
      };
    }

    // Supprimer les permissions
    await role.related('permissions').detach(permissionIds);

    return {
      role,
      removedPermissions: assignedPermissions,
      message: `Permissions ${assignedPermissions.map(p => p.name).join(', ')} supprimées avec succès.`
    };
  }

  async getRolePermissions(auth: any, roleId: any) {
    const connectedUserId = auth.user?.id;
    if (!connectedUserId) {
      throw new Error("L'utilisateur n'est pas connecté");
    }

    const role = await Role.findOrFail(roleId);

    const permissions = await role.related('permissions').query().select('id', 'permission_name');

    return permissions;

  }
}
