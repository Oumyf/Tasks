import { DateTime } from 'luxon'
import {BaseModel, column, manyToMany} from '@adonisjs/lucid/orm'
import type { ManyToMany} from '@adonisjs/lucid/types/relations'
import Role from "#models/role";

export default class Permission extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({columnName: 'permission_name'})
  declare name: string

  @column()
  declare code: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

 

  // Helper method to check if at least one permission type is set
  // public hasValidPermissionType(): boolean {
  //   return this.roleId !== null || this.userId !== null
  // }

  //Relations avec Roles
  @manyToMany(() => Role, {
    pivotTable: 'role_permissions',
    pivotForeignKey: 'permissions_id',
    pivotRelatedForeignKey: 'role_id',
  })
  declare roles: ManyToMany<typeof Role>

}