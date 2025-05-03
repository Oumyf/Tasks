import { DateTime } from 'luxon'
import { BaseModel, column} from '@adonisjs/lucid/orm'


export default class TaskUser extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare taskId: number | null

  @column()
  declare userId: number | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime


}
