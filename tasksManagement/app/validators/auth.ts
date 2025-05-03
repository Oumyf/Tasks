import vine, { SimpleMessagesProvider } from '@vinejs/vine'
/**
 * Validates the post's creation action
 */
export const registerPostValidator = vine.compile(
  vine.object({
    email: vine.string().email().unique({
      table: 'users',
      column: 'email',
    }),
    password: vine.string().minLength(6),
    fullName: vine
      .string()
      .trim()
      .regex(/^[A-Za-z]+(?:[\s_][A-Za-z]+)*\s[A-Za-z]+$/), // Pattern for first name, optional middle name, and last name
    phone: vine
      .string()
      .regex(/^\+[1-9]{1}[0-9]{1,3}[1-9]{1}[0-9]{6,14}$/)
      .trim()})
)

export const registerMessagesProvider = new SimpleMessagesProvider({
  // For email
  'email.required': "L'adresse email est obligatoire.",
  'email.email': "L'adresse email n'est pas valide.",
  'email.database.unique': "L'adresse email est déjà utilisée.", // Custom unique error message

  // For password
  'password.required': 'Le mot de passe est obligatoire.',
  'password.minLength': 'Le mot de passe doit comporter au moins 6 caractères.',

  // For role
  'role.required': 'Le rôle est obligatoire.',
  'role.in': "Le rôle doit être 'admin' ou 'user'.",

  // For fullName
  'fullName.required': 'Le nom complet est obligatoire.',
  'fullName.regex':
    'Le nom complet doit être au format Prénom Nom (avec un espace ou un underscore entre les prénoms et le nom).',

  // For phone
  'phone.required': 'Le numéro de téléphone est obligatoire.',
  'phone.regex': "Le numéro de téléphone doit inclure l'indicatif du pays et être au format valide (ex. : +221778128426).",
})


/**
 * Validates the post's creation action
 */
export const loginPostValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(6),
  })
)

export const loginMessagesProvider = new SimpleMessagesProvider({
  // For email
  'email.required': "L'adresse email est obligatoire.",
  'email.email': "L'adresse email n'est pas valide.",

  // For password
  'password.required': 'Le mot de passe est obligatoire.',
  'password.minLength': 'Le mot de passe doit comporter au moins 6 caractères.',
})
