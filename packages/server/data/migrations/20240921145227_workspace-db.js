const generateUUID = require('../extends/UUID.js');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('workspaces', table => {
      table.uuid('id').defaultTo(generateUUID(knex));
      table.uuid('owner').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.string('name').notNullable();
      table.string('color').notNullable();
      table.string('icon').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    .createTable('workspace_members', table => {
      table.uuid('workspace_id').notNullable().references('id').inTable('workspaces').onDelete('CASCADE');
      table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.primary(['workspace_id', 'user_id']);
      table.timestamp('added').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('workspaces_members').dropTableIfExists('workspaces');
};
