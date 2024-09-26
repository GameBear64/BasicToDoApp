/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  let uuidGenerationRaw = `(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))`;

  return knex.schema
    .createTable('views', table => {
      table.uuid('id').defaultTo(knex.raw(uuidGenerationRaw));
      table.uuid('workspace_id').notNullable().references('id').inTable('workspaces').onDelete('CASCADE');
      table.string('name').notNullable();
      table.integer('position').notNullable();
      table.boolean('default').defaultTo(false);
    })
    .createTable('columns', table => {
      table.uuid('id').defaultTo(knex.raw(uuidGenerationRaw));
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
