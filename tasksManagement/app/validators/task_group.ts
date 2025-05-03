import vine, { SimpleMessagesProvider } from '@vinejs/vine'

/**
 * ✅ Validation pour la création d'un groupe de tâches
 */
export const createTaskGroupValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(100),
    description: vine.string().trim().maxLength(500).optional(),
    projectId: vine.number().positive().exists({ table: 'projects', column: 'id' }).optional(),
    createdBy: vine.number().positive().exists({ table: 'users', column: 'id' }).optional(),
  })
)

/**
 * ✅ Validation pour la mise à jour d'un groupe de tâches
 */
export const updateTaskGroupValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(100).optional(),
    description: vine.string().trim().maxLength(500).optional(),
    projectId: vine.number().positive().exists({ table: 'projects', column: 'id' }).optional(),
    createdBy: vine.number().positive().exists({ table: 'users', column: 'id' }).optional(),
  })
)

/**
 * ✅ Messages personnalisés
 */
export const taskGroupMessagesProvider = new SimpleMessagesProvider({
  'name.required': "Le nom du groupe de tâches est obligatoire.",
  'name.minLength': "Le nom du groupe de tâches doit contenir au moins 3 caractères.",
  'name.maxLength': "Le nom du groupe de tâches ne peut pas dépasser 100 caractères.",

  'projectId.exists': "Le projet spécifié n'existe pas.",
  'createdBy.exists': "L'utilisateur créateur spécifié n'existe pas.",
})
