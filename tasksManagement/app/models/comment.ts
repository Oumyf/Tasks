import { DateTime } from 'luxon'
import {BaseModel, column, belongsTo, hasMany} from '@adonisjs/lucid/orm'
import type {BelongsTo, HasMany} from "@adonisjs/lucid/types/relations";
import Task from '#models/task'
import User from '#models/user'
import File from "#models/file";

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare taskId: number | null

  @column()
  declare message: string

  @column.dateTime()
  declare dateCreation: DateTime | null

  @column()
  declare userId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relations
  @belongsTo(() => Task, {
    foreignKey: 'taskId',
  })
  declare task: BelongsTo<typeof Task>

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  declare user: BelongsTo<typeof User>

  @hasMany(() => File, {
    foreignKey: 'fileableId',
    onQuery: (query) => query.where('fileable_type', 'comment'),
  })
  declare files: HasMany<typeof File>


}