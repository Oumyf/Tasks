import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from './user.js'
import * as relations from "@adonisjs/lucid/types/relations";

export default class Otp extends BaseModel {
  @column({isPrimary: true})
  declare id: number

  @column()
  declare userId: number

  @column()
  declare otp: string

  @column()
  declare token: string

  @column()
  declare attemptsLeft: number

  @column.dateTime()
  declare expiresAt: DateTime

  @column()
  declare isUsed: boolean

  @belongsTo(() => User)
  declare user: relations.BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime



}
