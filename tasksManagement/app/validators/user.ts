import vine, { SimpleMessagesProvider } from '@vinejs/vine'

/**
 * Validation pour l'ajout d'un utilisateur
 */
export const userStoreValidator = vine.compile(
  vine.object({
    email: vine.string().email().unique({
      table: 'users',
      column: 'email',
    }),
    password: vine.string().minLength(6),
    fullName: vine
      .string()
      .trim()
      .regex(/^[A-Za-z]+(?:[\s_][A-Za-z]+)*\s[A-Za-z]+$/),
    // .regex(/^[A-Za-z]+(?:[\s-_][A-Za-z]+)*$/),
    phone: vine
      .string()
      .regex(/^\+[1-9]{1}[0-9]{1,3}[1-9]{1}[0-9]{6,14}$/)
      .trim(),
    roleIds: vine.array(vine.number().positive().exists({
      table: 'roles',
      column: 'id',
    })),
  })
)

/**
 * Validation pour la mise à jour d'un utilisateur
 */
export const userUpdateValidator = vine.compile(
  vine.object({
    email: vine.string().email().unique({
      table: 'users',
      column: 'email',
    }).optional(),
    fullName: vine
      .string()
      .trim()
      .regex(/^[A-Za-z]+(?:[\s_][A-Za-z]+)*\s[A-Za-z]+$/)
      .optional(),
    password:vine.string().minLength(6),
    phone: vine
      .string()
      .regex(/^\+[1-9]{1}[0-9]{1,3}[1-9]{1}[0-9]{6,14}$/)
      .trim()
      .optional(),
    roleIds: vine.array(vine.number().positive().exists({
      table: 'roles',
      column: 'id',
    })),
  })
)

export const userMessagesProvider = new SimpleMessagesProvider({
  // Pour l'email
  'email.required': "L'adresse email est obligatoire.",
  'email.email': "L'adresse email n'est pas valide.",
  'email.database.unique': "L'adresse email est déjà utilisée.",

  // Pour le mot de passe
  'password.required': 'Le mot de passe est obligatoire.',
  'password.minLength': 'Le mot de passe doit comporter au moins 6 caractères.',

  // Pour le nom complet
  'fullName.required': 'Le nom complet est obligatoire.',
  'fullName.regex': 'Le nom complet doit être au format Prénom Nom.',

  // Pour le téléphone
  'phone.required': 'Le numéro de téléphone est obligatoire.',
  'phone.regex': "Le numéro de téléphone doit inclure l'indicatif du pays et être valide (ex. : +221778128426).",

  // Pour les rôles
  'roleIds.array': 'Les rôles doivent être un tableau.',
  'roleIds.members': 'Les rôles doivent être des identifiants valides existants dans la base de données.'
})
