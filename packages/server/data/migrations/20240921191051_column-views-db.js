const generateUUID = require('../extends/UUID.js');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .table('workspaces', table => {
      table.json('views').defaultTo('[]');
    })
    .createTable('views', table => {
      table.uuid('id').defaultTo(generateUUID(knex));
      table.uuid('workspace_id').notNullable().references('id').inTable('workspaces').onDelete('CASCADE');
      table.string('name').notNullable();
      table.integer('position').notNullable();
      table.boolean('default').defaultTo(false);
    })
    .createTable('columns', table => {
      table.uuid('id').defaultTo(generateUUID(knex));
      table.uuid('view_id').notNullable().references('id').inTable('views').onDelete('CASCADE');
      table.string('name').notNullable();
      table.integer('color').nullable();
      table.integer('position').notNullable();
    })
    .table('tasks', table => {
      table.uuid('column_id').notNullable().references('id').inTable('columns').onDelete('CASCADE');
      table.integer('position').notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('views')
    .dropTableIfExists('columns')
    .table('tasks', table => {
      table.dropColumn('column_id');
    });
};
