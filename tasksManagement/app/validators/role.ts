import vine, { SimpleMessagesProvider } from '@vinejs/vine'



export const createRoleValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255),
    code: vine.string().trim(),
    description: vine.string().trim().maxLength(500).optional(),
  })
)


export const updateRoleValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3).maxLength(255).optional(),
  })
)


export const createRoleMessagesProvider = new SimpleMessagesProvider({
  'name.required': 'Le nom du fichier est obligatoire.',
  'name.minLength': 'Le nom doit contenir au moins 3 caractères.',
  'name.maxLength': 'Le nom ne peut pas dépasser 255 caractères.',

  'description.maxLength': "La description ne peut pas dépasser 500 caractères.",
})

export const updateRoleMessagesProvider = new SimpleMessagesProvider({
  'name.minLength': 'Le nom doit contenir au moins 3 caractères.',
  'name.maxLength': 'Le nom ne peut pas dépasser 255 caractères.',

  'description.maxLength': "La description ne peut pas dépasser 500 caractères.",
})
