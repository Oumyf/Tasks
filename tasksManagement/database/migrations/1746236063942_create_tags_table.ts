import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tags'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('name').notNullable().unique()
      table.string('slug').nullable().unique()
      table.text('description').nullable()
      table.integer('task_group_by')
        .unsigned()
        .references('id')
        .inTable('task_groups')
        .onDelete('RESTRICT')
        .nullable()
        table.timestamp('created_at').defaultTo(this.now()).notNullable()
        table.timestamp('updated_at').defaultTo(this.now()).notNullable()
        
      table.timestamp('deleted_at').nullable()

    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}