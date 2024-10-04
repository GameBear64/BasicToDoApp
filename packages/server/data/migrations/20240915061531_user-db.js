const generateUUID = require('../extends/UUID.js');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('users', table => {
      table.uuid('id').defaultTo(generateUUID(knex));
      // == required ==
      table.string('name').notNullable();
      table.string('email').unique().notNullable();
      table.string('password').notNullable();
      // ==============
      table.string('theme').defaultTo('dark');
      table.string('accent').defaultTo('green');
      table.string('force_accent').defaultTo(false);
      table.timestamp('password_changed_at').nullable();
      table.timestamps(true, true);
    })
    .then(() => {
      return knex.raw(`
        CREATE TRIGGER update_users_timestamp
        BEFORE UPDATE ON users
        FOR EACH ROW
        BEGIN
          UPDATE users
          SET updated_at = CURRENT_TIMESTAMP
          WHERE id = OLD.id;
        END;
      `);
    })
    .then(() => {
      return knex.raw(`
        CREATE TRIGGER update_password_changed_at
        AFTER UPDATE OF password ON users
        FOR EACH ROW
        BEGIN
          UPDATE users
          SET password_changed_at = CURRENT_TIMESTAMP
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
    .dropTableIfExists('users')
    .then(() => {
      return knex.raw(`DROP TRIGGER IF EXISTS update_users_timestamp;`);
    })
    .then(() => {
      return knex.raw(`DROP TRIGGER IF EXISTS update_password_changed_at;`);
    });
};
