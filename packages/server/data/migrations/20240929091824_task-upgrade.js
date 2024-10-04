const generateUUID = require('../extends/UUID.js');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('comments', table => {
      table.uuid('id').defaultTo(generateUUID(knex));
      table.uuid('author').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.uuid('task_id').notNullable().references('id').inTable('tasks').onDelete('CASCADE');
      table.string('body').notNullable();
      table.timestamps(true, true);
    })
    .createTable('task_types', table => {
      table.uuid('id').defaultTo(generateUUID(knex));
      table.uuid('workspace_id').notNullable().references('id').inTable('workspaces').onDelete('CASCADE');
      table.string('title').notNullable();
      table.string('icon').notNullable();
      table.string('color').notNullable();
    })
    .createTable('labels', table => {
      table.uuid('id').defaultTo(generateUUID(knex));
      table.uuid('workspace_id').notNullable().references('id').inTable('workspaces').onDelete('CASCADE');
      table.string('title').notNullable();
      table.string('color').nullable();
      table.string('icon').nullable();
    })
    .createTable('custom_fields', table => {
      table.uuid('id').defaultTo(generateUUID(knex));
      table.uuid('workspace_id').notNullable().references('id').inTable('workspaces').onDelete('CASCADE');
      table.string('title').notNullable();
    })
    .table('tasks', table => {
      table.integer('serial').defaultTo(1);
      table.uuid('type').nullable().references('id').inTable('task_type');
    })
    .createTable('task_labels', table => {
      table.uuid('task_id').notNullable().references('id').inTable('tasks').onDelete('CASCADE');
      table.uuid('label_id').notNullable().references('id').inTable('labels').onDelete('CASCADE');
      table.primary(['task_id', 'label_id']);
    })
    .createTable('task_custom_fields', table => {
      table.uuid('task_id').notNullable().references('id').inTable('tasks').onDelete('CASCADE');
      table.uuid('custom_field_id').notNullable().references('id').inTable('custom_fields').onDelete('CASCADE');
      table.string('value').notNullable();
      table.primary(['task_id', 'custom_field_id']);
    })
    .table('workspaces', table => {
      table.integer('max_serial').defaultTo(1);
    })
    .then(() => {
      return knex.raw(`
        CREATE TRIGGER update_comments_timestamp
        BEFORE UPDATE ON comments
        FOR EACH ROW
        BEGIN
        UPDATE comments
        SET updated_at = CURRENT_TIMESTAMP
        WHERE id = OLD.id;
        END;
      `);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('comments')
    .dropTableIfExists('task_type')
    .dropTableIfExists('labels')
    .dropTableIfExists('custom_fields')
    .table('tasks', table => {
      table.dropColumn('serial');
      table.dropColumn('type');
    })
    .dropTableIfExists('task_custom_fields')
    .dropTableIfExists('task_labels')
    .raw('DROP TRIGGER IF EXISTS update_comments_timestamp');
};
