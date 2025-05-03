import { DateTime } from 'luxon'
import {BaseModel, column, belongsTo, hasMany, manyToMany,} from '@adonisjs/lucid/orm'
import type {BelongsTo, HasMany, ManyToMany} from "@adonisjs/lucid/types/relations";
import TaskGroup from '#models/task_group'
import User from '#models/user'
import Comment from "#models/comment";
import File from "#models/file";

export type TaskStatus = 'pending' | 'completed' | 'in_progress'
export type TaskPriority = 'low' | 'medium' | 'high'

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column.dateTime()
  declare dateDebut: DateTime | null

  @column.dateTime()
  declare dateFin: DateTime | null

  @column()
  declare status: TaskStatus

  @column()
  declare priorite: TaskPriority

  @column()
  declare progression: number

  @column()
  declare description: string | null

  @column()
  declare couleur: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column()
  declare parentId: number | null

  @column()
  declare taskGroupId: number | null

  @column()
  declare createdBy: number | null

  @column.dateTime()
  declare deletedAt: DateTime | null

  // Relations
  @belongsTo(() => Task, {
    foreignKey: 'parentId',
  })
  declare parent: BelongsTo<typeof Task>

  @hasMany(() => Task, {
    foreignKey: 'parentId',
  })
  declare subtasks: HasMany<typeof Task>

  @belongsTo(() => TaskGroup, {
    foreignKey: 'taskGroupId',
  })
  declare taskGroup: BelongsTo<typeof TaskGroup>

  @belongsTo(() => User, {
    foreignKey: 'createdBy',
  })
  declare creator: BelongsTo<typeof User>

  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>

  @hasMany(() => File, {
    foreignKey: 'fileableId',
    onQuery: (query) => query.where('fileable_type', 'task'),
  })
  declare files: HasMany<typeof File>

  @manyToMany(() => User, {
    pivotTable: 'task_users',
    pivotForeignKey: 'task_id',
    pivotRelatedForeignKey: 'user_id',
  })
  declare assignees: ManyToMany<typeof User>


}
