import { DateTime } from 'luxon'
import {BaseModel, column, manyToMany} from '@adonisjs/lucid/orm'
import type {ManyToMany} from "@adonisjs/lucid/types/relations";
import User from "#models/user";
import Permission from "#models/permission";

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare code: string

  @column()
  declare description: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

// Relations avec Users
  @manyToMany(() => User, {
    pivotTable: 'user_roles',
    pivotForeignKey: 'role_id',
    pivotRelatedForeignKey: 'user_id',
  })
  declare users: ManyToMany<typeof User>


  //Relations avec Permissions
  @manyToMany(() => Permission, {
    pivotTable: 'role_permissions',
    pivotForeignKey: 'role_id',
    pivotRelatedForeignKey: 'permissions_id',
  })
  declare permissions: ManyToMany<typeof Permission>
  
  // @manyToMany(() => Role, {
  //   pivotTable: 'role_permissions',
  //   pivotForeignKey: 'project_ressource_permissions_id',
  //   pivotRelatedForeignKey: 'role_id',
  // })
  // declare roles: ManyToMany<typeof Role>



}
