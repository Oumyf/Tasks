import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tasks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.timestamp('date_debut')
      table.timestamp('date_fin').defaultTo(this.now()).notNullable()
      table.enum('status', ['pending', 'completed', 'in_progress']).defaultTo('pending')
      table.enum('priorite', ['low', 'medium', 'high']).defaultTo('medium')
      table.tinyint('progression').defaultTo(0)
      table.text('description')
      table.string('couleur')
      table.timestamp('created_at').defaultTo(this.now()).notNullable()
      table.timestamp('updated_at').defaultTo(this.now()).notNullable()
      
      table.timestamp('deleted_at').nullable()
      table.integer('parent_id')
        .unsigned()
        .references('id')
        .inTable('tasks')
        .onDelete('RESTRICT')
        .nullable()
      table.integer('task_group_id')
        .unsigned()
        .references('id')
        .inTable('task_groups')
        .onDelete('RESTRICT')
        .nullable()
      table.integer('created_by')
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('RESTRICT')
        .nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}