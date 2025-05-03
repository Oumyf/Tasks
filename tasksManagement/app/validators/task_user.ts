import vine, { SimpleMessagesProvider } from '@vinejs/vine'

/**
 * ✅ Validation pour la création de l'affectation d'une tâche à un utilisateur
 */
export const createTaskUserValidator = vine.compile(
  vine.object({
    taskId: vine.number().positive().exists({ table: 'tasks', column: 'id' }),
    userId: vine.number().positive().exists({ table: 'users', column: 'id' }),
  })
)

/**
 * ✅ Validation pour l'ID de tâche uniquement
 */
export const createTaskIdValidator = vine.compile(
  vine.object({
    taskId: vine.number().positive().exists({ table: 'tasks', column: 'id' }),
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
 * ✅ Validation pour assigner une tâche à plusieurs utilisateurs
 */
export const assignTaskToUsersValidator = vine.compile(
  vine.object({
    userIds: vine.array(
      vine.number().positive().exists({ table: 'users', column: 'id' })
    ).minLength(1)
  })
)

/**
 * ✅ Messages personnalisés
 */
export const taskUserMessagesProvider = new SimpleMessagesProvider({
  'taskId.exists': "La tâche spécifiée n'existe pas.",
  'userId.exists': "L'utilisateur spécifié n'existe pas.",
  'userIds.minLength': "Vous devez spécifier au moins un utilisateur.",
  'taskId.positive': "L'identifiant de la tâche doit être un nombre positif.",
  'userId.positive': "L'identifiant de l'utilisateur doit être un nombre positif.",
})
