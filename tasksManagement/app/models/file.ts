import {DateTime} from "luxon";
import {BaseModel, column} from '@adonisjs/lucid/orm'

export default class File extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare fileUrl: string

  @column()
  declare fileableId: number

  @column()
  declare fileableType: 'tasks' | 'comments'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime


}
