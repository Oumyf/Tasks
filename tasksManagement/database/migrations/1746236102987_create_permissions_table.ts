import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'permissions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('permission_name').notNullable()
      table.string('code').notNullable()
      table.timestamp('created_at').defaultTo(this.now()).notNullable()
table.timestamp('updated_at').defaultTo(this.now()).notNullable()

    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}