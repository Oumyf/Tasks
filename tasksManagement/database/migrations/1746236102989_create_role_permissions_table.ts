import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'role_permissions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('role_id')
        .unsigned()
        .references('id')
        .inTable('roles')
        .onDelete('RESTRICT')
        .nullable()
      table.integer('permissions_id')
        .unsigned()
        .references('id')
        .inTable('permissions')
        .onDelete('RESTRICT')
        .nullable()
        .withKeyName('rol_perm_id_fk')
        table.timestamp('created_at').defaultTo(this.now()).notNullable()
        table.timestamp('updated_at').defaultTo(this.now()).notNullable()
        
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}