import vine, { SimpleMessagesProvider } from '@vinejs/vine'



export const createFileValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),
    fileUrl: vine.string().trim().url(),
    fileableId: vine.number().positive(),
    fileableType: vine.enum(['tasks', 'comments']),
  })
)


export const updateFileValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255).optional(),
    fileUrl: vine.string().trim().url().optional(),
  })
)


export const createFileMessagesProvider = new SimpleMessagesProvider({
  'name.required': 'Le nom du fichier est obligatoire.',
  'name.minLength': 'Le nom doit contenir au moins 3 caractères.',
  'name.maxLength': 'Le nom ne peut pas dépasser 255 caractères.',

  'fileUrl.required': "L'URL du fichier est obligatoire.",
  'fileUrl.url': "L'URL du fichier doit être valide.",

  'fileableId.required': "L'ID de l'élément associé est obligatoire.",
  'fileableId.positive': "L'ID doit être un nombre positif.",

  'fileableType.required': "Le type de fichier est obligatoire.",
  'fileableType.enum': "Le type doit être 'tasks' ou 'comments'.",
})

export const updateFileMessagesProvider = new SimpleMessagesProvider({
  'name.minLength': 'Le nom doit contenir au moins 3 caractères.',
  'name.maxLength': 'Le nom ne peut pas dépasser 255 caractères.',

  'fileUrl.url': "L'URL du fichier doit être valide.",
})
