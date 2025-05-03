import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'otps'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE') // Relation avec l'utilisateur
      table.string('otp', 6).notNullable()
      table.string('token', 50).notNullable()
      table.timestamp('expires_at', { useTz: true }).notNullable()
      table.boolean('is_used').defaultTo(false)
      table.integer('attempts_left').defaultTo(3) // 3 tentatives par défaut
      table.timestamp('created_at').defaultTo(this.now()).notNullable()
table.timestamp('updated_at').defaultTo(this.now()).notNullable()

    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}