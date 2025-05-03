import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'task_groups'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.text('description').nullable()
      table.integer('created_by')
        .unsigned()
        .references('id')
        .inTable('users')
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