import vine, { SimpleMessagesProvider } from '@vinejs/vine'

/**
 * ✅ Validation pour la création d'une tâche
 */
export const createTaskValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(100),
    dateDebut: vine.date().optional(),
    dateFin: vine.date().afterField('dateDebut').optional(),
    status: vine.enum(['pending', 'completed', 'in_progress'] as const),
    priorite: vine.enum(['low', 'medium', 'high'] as const),
    progression: vine.number().min(0).max(100),
    description: vine.string().trim().maxLength(500).optional(),
    couleur: vine.string().trim().maxLength(7).optional(),
    parentId: vine.number().positive().exists({ table: 'tasks', column: 'id' }).optional(),
    taskGroupId: vine.number().positive().exists({ table: 'task_groups', column: 'id' }).optional(),
    createdBy: vine.number().positive().exists({ table: 'users', column: 'id' }).optional(),
  })
)

/**
 * ✅ Validation pour la mise à jour d'une tâche
 */
export const updateTaskValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(100).optional(),
    status: vine.enum(['pending', 'completed', 'in_progress'] as const).optional(),
    priorite: vine.enum(['low', 'medium', 'high'] as const).optional(),
    progression: vine.number().min(0).max(100).optional(),
    description: vine.string().trim().maxLength(500).optional(),
    couleur: vine.string().trim().maxLength(7).optional(),
    parentId: vine.number().positive().exists({ table: 'tasks', column: 'id' }).optional(),
    taskGroupId: vine.number().positive().exists({ table: 'task_groups', column: 'id' }).optional(),
    createdBy: vine.number().positive().exists({ table: 'users', column: 'id' }).optional(),
  })
)

/**
 * ✅ Messages personnalisés
 */
export const taskMessagesProvider = new SimpleMessagesProvider({
  'name.required': "Le nom de la tâche est obligatoire.",
  'name.minLength': "Le nom de la tâche doit contenir au moins 3 caractères.",
  'name.maxLength': "Le nom de la tâche ne peut pas dépasser 100 caractères.",

  'dateFin.afterField': "La date de fin doit être postérieure à la date de début.",

  'status.enum': "Le statut doit être 'pending', 'completed' ou 'in_progress'.",
  'priorite.enum': "La priorité doit être 'low', 'medium' ou 'high'.",

  'progression.min': "La progression doit être au minimum 0%.",
  'progression.max': "La progression ne peut pas dépasser 100%.",

  'description.maxLength': "La description ne peut pas dépasser 500 caractères.",

  'couleur.maxLength': "Le code couleur ne peut pas dépasser 7 caractères.",

  'parentId.exists': "La tâche parente spécifiée n'existe pas.",
  'taskGroupId.exists': "Le groupe de tâches spécifié n'existe pas.",
  'createdBy.exists': "L'utilisateur créateur spécifié n'existe pas.",
})
