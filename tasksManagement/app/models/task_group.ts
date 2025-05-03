import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type {BelongsTo, HasMany} from "@adonisjs/lucid/types/relations";
import User from '#models/user'
import Task from '#models/task'
import Tag from '#models/tag'

export default class TaskGroup extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string


  @column()
  declare projectId: number | null

  @column()
  declare createdBy: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null

  // Relations


  @belongsTo(() => User, {
    foreignKey: 'createdBy',
  })
  declare creator: BelongsTo<typeof User>

  @hasMany(() => Task, {
    foreignKey: 'taskGroupId',
  })
  declare tasks: HasMany<typeof Task>

  @hasMany(() => Tag, {
    foreignKey: 'taskGroupBy',
  })
  declare tags: HasMany<typeof Tag>
}
