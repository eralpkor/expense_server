
exports.up = function(knex) {
  return knex.schema
    .createTable('users', table => {
      table.increments();
      table.string('username', 50).unique().notNullable();
      table.string('password', 128).notNullable();
      table.string('email', 128).unique();

      table.string('firstname', 25);
      table.string('lastname', 25);
    })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExist('user');
};
