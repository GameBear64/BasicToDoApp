const generateUUID = require('../extends/UUID.js');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('tasks', table => {
      table.uuid('id').defaultTo(generateUUID(knex));
      table.uuid('author').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.string('title').notNullable();
      table.string('description').nullable();
      table.boolean('completed').defaultTo(false);
      table.timestamps(true, true);
    })
    .then(() => {
      return knex.raw(`
        CREATE TRIGGER update_tasks_timestamp
        BEFORE UPDATE ON tasks
        FOR EACH ROW
        BEGIN
          UPDATE tasks
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
  return knex.schema.dropTableIfExists('tasks').then(() => {
    return knex.raw(`DROP TRIGGER IF EXISTS update_task_timestamp;`);
  });
};
