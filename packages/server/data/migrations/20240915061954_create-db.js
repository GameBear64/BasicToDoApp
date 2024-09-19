/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  let uuidGenerationRaw = `(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))`;

  return knex.schema
    .createTable('todos', table => {
      table.uuid('id').defaultTo(knex.raw(uuidGenerationRaw));
      table.uuid('author').notNullable().references('id').inTable('users').onDelete('CASCADE');
      table.string('title').notNullable();
      table.string('description').nullable();
      table.boolean('completed').defaultTo(false);
      table.timestamps(true, true);
    })
    .then(() => {
      return knex.raw(`
        CREATE TRIGGER update_todos_timestamp
        BEFORE UPDATE ON todos
        FOR EACH ROW
        BEGIN
          UPDATE todos
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
  return knex.schema.dropTableIfExists('todos').then(() => {
    return knex.raw(`DROP TRIGGER IF EXISTS update_todos_timestamp;`);
  });
};
