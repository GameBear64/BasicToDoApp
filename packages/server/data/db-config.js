const knex = require('knex');
const config = require('../knexfile.js');

const populate = require('./extends/populate.js');
populate(knex);

module.exports = knex(config[process.env.NODE_ENV]);
