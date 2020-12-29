const db = require('../database/dbConfig');

module.exports = {
  find,
  findById,
  insertExpense,
  updateExpense,
  removeExpense,
}

// return users expenses
function find(user_id) {
  return db('expense')
    .where('user_id', user_id)
}

function findById(id) {
  return db('expense')
    .select('id', 'title', 'amount', 'tags', 'created_at', 'user_id')
    .where({ id })
    .first();
}

function insertExpense(data, user_id) {
  return  db('expense')
    .insert({ ...data, user_id })
    .then(id => {
      return db('expense')
        .where({ id: id[0] });
    })
}

function updateExpense(id, changes) {
  return db('expense')
    .where({ id })
    .update(changes, '*');
}

function removeExpense(id) {
  return db('expense')
    .where('id', id)
    .del();
}