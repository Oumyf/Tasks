import vine, { SimpleMessagesProvider } from '@vinejs/vine'


export const createRoleProjectRessourcePermissionValidator = vine.compile(
  vine.object({
    roleId: vine.number().positive().exists({
      table: 'roles',
      column: 'id',
    }),
    projectRessourcePermissionsIds: vine.array(vine.number().positive().exists({
      table: 'project_ressource_permissions',
      column: 'id',
    })),
  })
)

export const updateRoleProjectRessourcePermissionValidator = vine.compile(
  vine.object({
    roleId: vine.number().positive().exists({
      table: 'roles',
      column: 'id',
    }).optional(),
    projectRessourcePermissionsId: vine.number().positive().exists({
      table: 'permissions',
      column: 'id',
    }).optional(),
  })
)


export const createRolePermissionMessagesProvider = new SimpleMessagesProvider({
  'roleId.required': "L'ID du rôle est obligatoire.",
  'roleId.positive': "L'ID du rôle doit être un nombre positif.",
  'roleId.exists': "Le rôle spécifié n'existe pas.",

  'projectRessourcePermissionsIds.required': "Les IDs des permissions sont obligatoires.",
  'projectRessourcePermissionsIds.*.positive': "Chaque ID de permission doit être un nombre positif.",
  'projectRessourcePermissionsIds.*.exists': "Une ou plusieurs permissions spécifiées n'existent pas.",
})

export const updateRoleProjectRessourcePermissionMessagesProvider = new SimpleMessagesProvider({
  'roleId.positive': "L'ID du rôle doit être un nombre positif.",
  'roleId.exists': "Le rôle spécifié n'existe pas.",

  'projectRessourcePermissionsId.positive': "L'ID de la permission doit être un nombre positif.",
  'projectRessourcePermissionsId.exists': "La permission spécifiée n'existe pas.",
})
