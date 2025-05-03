import vine, { SimpleMessagesProvider } from '@vinejs/vine'

/**
 * ✅ Validation pour la création d'un tag
 */
export const createTagValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(50),
    slug: vine.string().trim().maxLength(100).optional(),
    description: vine.string().trim().maxLength(255).optional(),
    taskGroupBy: vine.number().positive().exists({
      table: 'task_groups',
      column: 'id',
    }).optional(),
  })
)

/**
 * ✅ Validation pour la mise à jour d'un tag
 */
export const updateTagValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(50).optional(),
    slug: vine.string().trim().maxLength(100).optional(),
    description: vine.string().trim().maxLength(255).optional(),
    taskGroupBy: vine.number().positive().exists({
      table: 'task_groups',
      column: 'id',
    }).optional(),
  })
)

/**
 * ✅ Messages personnalisés
 */
export const createTagMessagesProvider = new SimpleMessagesProvider({
  'name.required': "Le nom du tag est obligatoire.",
  'name.minLength': "Le nom du tag doit contenir au moins 3 caractères.",
  'name.maxLength': "Le nom du tag ne peut pas dépasser 50 caractères.",

  'slug.maxLength': "Le slug ne peut pas dépasser 100 caractères.",

  'description.maxLength': "La description ne peut pas dépasser 255 caractères.",

  'taskGroupBy.exists': "Le groupe de tâches spécifié n'existe pas.",
})

export const updateTagMessagesProvider = new SimpleMessagesProvider({
  'name.minLength': "Le nom du tag doit contenir au moins 3 caractères.",
  'name.maxLength': "Le nom du tag ne peut pas dépasser 50 caractères.",

  'slug.maxLength': "Le slug ne peut pas dépasser 100 caractères.",

  'description.maxLength': "La description ne peut pas dépasser 255 caractères.",

  'taskGroupBy.exists': "Le groupe de tâches spécifié n'existe pas.",
})
