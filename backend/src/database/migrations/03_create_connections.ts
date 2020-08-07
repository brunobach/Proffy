import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('connections', (table) => {
    table.increments('id').primary(); // id da conexão
       
    table
      .integer('user_id').notNullable() // id do professor
      .references('id').inTable('users') // relacionamento com a tabela users
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
    
      table.timestamp('created_at')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
      .notNullable();
  })
}

export async function down(knex: Knex) {
  return knex.schema.dropTable('connections');
}