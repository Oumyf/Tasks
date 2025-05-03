import vine, { SimpleMessagesProvider } from '@vinejs/vine'

/**
 * ✅ Validation pour la création d'un rôle d'utilisateur
 */
export const createUserRoleValidator = vine.compile(
  vine.object({
    userId: vine.number().positive().exists({ table: 'users', column: 'id' }),
    roleId: vine.number().positive().exists({ table: 'roles', column: 'id' }),
  })
)

/**
 * ✅ Validation pour l'ID d'utilisateur uniquement
 */
export const createUserIdValidator = vine.compile(
  vine.object({
    userId: vine.number().positive().exists({ table: 'users', column: 'id' }),
  })
)

/**
 * ✅ Validation pour l'ID de rôle uniquement
 */
export const createRoleIdValidator = vine.compile(
  vine.object({
    roleId: vine.number().positive().exists({ table: 'roles', column: 'id' }),
  })
)

/**
 * ✅ Validation pour assigner plusieurs rôles à un utilisateur
 */
export const assignRolesToUserValidator = vine.compile(
  vine.object({
    roleIds: vine.array(
      vine.number().positive().exists({ table: 'roles', column: 'id' })
    ).minLength(1)
  })
)

/**
 * ✅ Validation pour assigner un rôle à plusieurs utilisateurs
 */
export const assignRoleToUsersValidator = vine.compile(
  vine.object({
    userIds: vine.array(
      vine.number().positive().exists({ table: 'users', column: 'id' })
    ).minLength(1)
  })
)

/**
 * ✅ Validation pour la mise à jour du rôle d'un utilisateur
 */
export const updateUserRoleValidator = vine.compile(
  vine.object({
    userId: vine.number().positive().exists({ table: 'users', column: 'id' }).optional(),
    roleId: vine.number().positive().exists({ table: 'roles', column: 'id' }).optional(),
  })
)

/**
 * ✅ Messages personnalisés
 */
export const userRoleMessagesProvider = new SimpleMessagesProvider({
  'userId.exists': "L'utilisateur spécifié n'existe pas.",
  'roleId.exists': "Le rôle spécifié n'existe pas.",
  'userIds.minLength': "Vous devez spécifier au moins un utilisateur.",
  'roleIds.minLength': "Vous devez spécifier au moins un rôle.",
  'userId.positive': "L'identifiant de l'utilisateur doit être un nombre positif.",
  'roleId.positive': "L'identifiant du rôle doit être un nombre positif.",
})
