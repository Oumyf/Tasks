import { HttpContext } from '@adonisjs/core/http';
import User from '#models/user';
import Role from '#models/role';
import { inject } from '@adonisjs/core';
import { FunService } from '#services/fun_service';
import { userStoreValidator, userUpdateValidator, userMessagesProvider } from '#validators/user';

@inject()
export default class UserController {
  constructor(protected funService: FunService) {
  }

  /**
   * Liste tous les utilisateurs (accessible uniquement aux administrateurs)
   */
  async index({auth, response}: HttpContext) {
    // Vérifier si l'utilisateur connecté est un administrateur
    if (!auth.user) {
      return response.status(401).json({status: 'error', message: 'Utilisateur non authentifié'});
    }
    const users = await User.query().preload('roles');

    return {
      status: 'success',
      users
    };
  }

  /**
   * Ajoute un nouvel utilisateur (accessible uniquement aux administrateurs)
   * Permet de créer des utilisateurs avec n'importe quel rôle, y compris admin
   */
  async store({request, auth, response}: HttpContext) {
    // Vérifier si l'utilisateur connecté est un administrateur
    if (!auth.user) {
      return response.status(401).json({status: 'error', message: 'Utilisateur non authentifié'});
    }

    try {
      // Valider les données d'entrée
      const data = await userStoreValidator.validate(request.all(), {
        messagesProvider: userMessagesProvider,
      });

      const user = await User.create({
        ...data,
      })

      // Obtenir tous les rôles disponibles
      const allRoles = await Role.all();
      const rolesMap = new Map(allRoles.map(role => [role.id, role]));

      // Si les rôles sont spécifiés, les attacher
      if (data.roleIds && Array.isArray(data.roleIds)) {
        await user.related('roles').attach(data.roleIds);

        // Vérifier si l'utilisateur a reçu le rôle d'administrateur
        const hasAdminRole = data.roleIds.some(roleId => {
          const role = rolesMap.get(roleId);
          return role && role.name === 'admin';
        });

        // Journaliser la création d'un admin (optionnel)
        if (hasAdminRole) {
          console.log(`Un nouvel administrateur a été créé par ${auth.user.email}: ${user.email}`);
        }
      }
      await user.load('roles');

      return {
        status: 'success',
        message: 'Utilisateur créé avec succès',
        user
      };
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: 'Erreur lors de la création de l\'utilisateur',
        error: error.messages
      });
    }
  }

  /**
   * Affiche les détails d'un utilisateur spécifique
   */
  async show({params, auth, response}: HttpContext) {
    if (!auth.user) {
      return response.status(401).json({status: 'error', message: 'Utilisateur non authentifié'});
    }
    const user = await User.query()
      .where('id', params.id)
      .preload('roles')
      .first();

    if (!user) {
      return response.status(404).json({
        status: 'not_found',
        message: 'Utilisateur non trouvé'
      });
    }

    return {
      status: 'success',
      user
    };
  }

  /**
   * Met à jour un utilisateur existant, y compris ses rôles
   */
  async update({params, request, auth, response}: HttpContext) {
    if (!auth.user) {
      return response.status(401).json({status: 'error', message: 'Utilisateur non authentifié'});
    }
    const user = await User.find(params.id);

    if (!user) {
      return response.status(404).json({
        status: 'not_found',
        message: 'Utilisateur non trouvé'
      });
    }

    try {
      // Valider les données d'entrée
      const data = await userUpdateValidator.validate(request.all(), {
        messagesProvider: userMessagesProvider,
      });

      // Mettre à jour les champs de l'utilisateur
      if (data.fullName) user.fullName = data.fullName;
      if (data.email) user.email = data.email;
      if (data.phone) user.phone = data.phone;
      if (data.password) user.password = data.password;

      await user.save();

      const allRoles = await Role.all();
      const rolesMap = new Map(allRoles.map(role => [role.id, role]));

      if (data.roleIds && Array.isArray(data.roleIds)) {
        await user.load('roles');
        const hadAdminRole = user.roles.some(role => role.code === 'admin');
        await user.related('roles').sync(data.roleIds);
        const hasAdminRole = data.roleIds.some((roleId: number) => {
          const role = rolesMap.get(roleId);
          return role && role.name === 'admin';
        });

        if (!hadAdminRole && hasAdminRole) {
          console.log(`Privilèges administrateur accordés à ${user.email} par ${auth.user.email}`);
        } else if (hadAdminRole && !hasAdminRole) {
          console.log(`Privilèges administrateur retirés à ${user.email} par ${auth.user.email}`);
        }
      }
      await user.load('roles');

      return {
        status: 'success',
        message: 'Utilisateur mis à jour avec succès',
        user
      };
    } catch (error) {
      return response.status(400).json({
        status: 'error',
        message: 'Erreur lors de la mise à jour de l\'utilisateur',
        error: error.message
      });
    }
  }

  /**
   * Supprime un utilisateur
   */
  async destroy({params, auth, response}: HttpContext) {
    if (!auth.user) {
      return response.status(401).json({status: 'error', message: 'Utilisateur non authentifié'});
    }


    const user = await User.find(params.id);

    if (!user) {
      return response.status(404).json({
        status: 'not_found',
        message: 'Utilisateur non trouvé'
      });
    }

    // Ne pas permettre de supprimer son propre compte
    if (user.id === auth.user.id) {
      return response.status(400).json({
        status: 'error',
        message: 'Vous ne pouvez pas supprimer votre propre compte'
      });
    }

    // Vérifier si l'utilisateur est un admin avant de le supprimer (optionnel)
    await user.load('roles');
    const isUserAdmin = user.roles.some(role => role.name === 'admin');

    if (isUserAdmin) {
      console.log(`Administrateur ${user.email} supprimé par ${auth.user.email}`);
      // Ici vous pourriez implémenter une notification ou un journal d'audit supplémentaire
    }

    await user.delete();

    return {
      status: 'success',
      message: 'Utilisateur supprimé avec succès'
    };
  }

  /**
   * Liste tous les rôles disponibles dans le système
   */
  async listRoles({auth}: HttpContext) {
    if (!auth.user) {
      return {
        status: 'error',
        message: 'Utilisateur non authentifié'
      };
    }

    const roles = await Role.all();

    return {
      status: 'success',
      roles
    };
  }

  /**
   * Méthode utilitaire pour vérifier si un utilisateur est administrateur
   */
  // private async checkIsAdmin(user: User): Promise<boolean> {
  //   await user.load('roles');
  //
  //   return user.roles.some(role => role.name === 'admin');
  // }

  public async activateOrDesactivateUser({request, response, params}: HttpContext) {
    try {
      const {userId} = params;
      const isActive = request.input('isActive');
      const user = await User.findOrFail(userId);

      if (!user) {
        return response.status(404).json({
          status: 'error',
          message: 'Utilisateur non trouvé'
        });
      }

      user.isActive = isActive;
      await user.save();

      return {
        status: 'success',
        message: `Utilisateur ${isActive ? 'activé' : 'désactivé'} avec succès`,
        user
      };
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: "Erreur lors de la modification du statut de l'utilisateur",
        error: error.message
      });
    }
  }
}
