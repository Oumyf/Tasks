import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_roles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('RESTRICT')
        .nullable()
      table.integer('role_id')
        .unsigned()
        .references('id')
        .inTable('roles')
        .onDelete('RESTRICT')
        .nullable()
        table.timestamp('created_at').defaultTo(this.now()).notNullable()
        table.timestamp('updated_at').defaultTo(this.now()).notNullable()
        
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}