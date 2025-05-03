import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const createCommentValidator = vine.compile(
  vine.object({
    message: vine.string().trim().minLength(3).maxLength(500),
    taskId: vine.number().exists({
      table: 'tasks',
      column: 'id',
    }).nullable().optional(),
    userId: vine.number().exists({
      table: 'users',
      column: 'id',
    }).nullable().optional(),
    dateCreation: vine.date().optional(),

  })

)

export const updateCommentValidator = vine.compile(
  vine.object({
    message: vine.string().trim().minLength(3).maxLength(500),
  })
)

export const createCommentMessagesProvider = new SimpleMessagesProvider({
  'message.required': 'Le message est obligatoire.',
  'message.minLength': 'Le message doit contenir au moins 3 caractères.',
  'message.maxLength': 'Le message ne peut pas dépasser 500 caractères.',

  'taskId.exists': "La tâche associée n'existe pas.",
  'userId.exists': "L'utilisateur associé n'existe pas.",
})

export const updateCommentMessagesProvider = new SimpleMessagesProvider({
  'message.required': 'Le message est obligatoire.',
  'message.minLength': 'Le message doit contenir au moins 3 caractères.',
  'message.maxLength': 'Le message ne peut pas dépasser 500 caractères.',
})
