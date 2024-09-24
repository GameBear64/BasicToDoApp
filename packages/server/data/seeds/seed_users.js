/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  await knex('users').insert([
    {
      name: 'Gam',
      email: 'vlpetrov02@gmail.com',
      password: '$2a$10$kcPgnZRrjhI/5V.bZnf8Yuyapk/jW7BNd56uCQxu2pMaA/9qDnMAG',
    },
  ]);
};
