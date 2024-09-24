/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  let uuidGenerationRaw = `(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))`;

  return knex.schema
    .createTable('workspaces', table => {
      table.uuid('id').defaultTo(knex.raw(uuidGenerationRaw));
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
