import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'roles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()

      table.string('name').notNullable()
      table.string('code').notNullable().unique()
      table.text('description').nullable()

      table.timestamp('created_at').defaultTo(this.now()).notNullable()
      table.timestamp('updated_at').defaultTo(this.now()).notNullable()
      
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}