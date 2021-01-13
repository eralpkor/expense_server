
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('expense').truncate()
  // .del()
    .then(function () {
      // Inserts seed entries
      return knex('expense').insert([
        {
          title: 'Oil change',
          amount: 55.60,
          tags: 'Automotive',
          user_id: 1
        },
        {
          title: 'Cat food',
          amount: 10.11,
          tags: 'Food',
          user_id: 2
        },
        {
          title: 'Paid November bill',
          amount: 68.78,
          tags: 'Electric',
          user_id: 3
        }
      ]);
    });
};
