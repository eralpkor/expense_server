// let now = new Date(new Date().toLocaleString('en-US', {timeZone:'America/New_York'}));

exports.up = function(knex) {
  return knex.schema
    .createTable('expense', table => {
      table.increments();
      table.string('title', 128).notNullable();
      table.float('amount').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.enu('tags', ['Automotive', 'Food', 'Mortgage', 'Electric', 'Gas', 'Vacation',
        'Insurance', 'Gift'
    ]).notNullable();
      table.integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('expense')
};

