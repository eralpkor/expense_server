const bcrypt = require('bcryptjs');
require('dotenv').config();

exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').truncate()
  // .del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'norman', password: bcrypt.hashSync(process.env.USER_PASSWORD, 8), email: 'norman@example.com'},
        {username: 'sunny', password: bcrypt.hashSync(process.env.USER_PASSWORD, 8), email: 'sunny@meow.com'},
        {username: 'eralp', password: bcrypt.hashSync(process.env.USER_PASSWORD, 8), email: 'eralp@example.com'}
      ]);
    });
};
