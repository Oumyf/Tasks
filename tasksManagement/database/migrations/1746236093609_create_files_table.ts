import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'files'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('file_url').notNullable()
      table.integer('fileable_id').unsigned().notNullable() // ID de la tâche ou du commentaire
      table.enum('fileable_type', ['tasks', 'comments']).notNullable() // 'taches' ou 'commentaires'
      table.timestamp('created_at').defaultTo(this.now()).notNullable()
table.timestamp('updated_at').defaultTo(this.now()).notNullable()

    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}