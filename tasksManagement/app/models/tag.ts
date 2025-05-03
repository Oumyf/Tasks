import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type {BelongsTo} from "@adonisjs/lucid/types/relations";
import TaskGroup from '#models/task_group'

export default class Tag extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string | null

  @column()
  declare description: string | null

  @column()
  declare taskGroupBy: number | null

  @column.dateTime()
  declare deletedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relations
  @belongsTo(() => TaskGroup, {
    foreignKey: 'taskGroupBy',
  })
  declare taskGroup: BelongsTo<typeof TaskGroup>
}
