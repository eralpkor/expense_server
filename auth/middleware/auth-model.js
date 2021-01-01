const db = require('../../database/dbConfig');

module.exports = {
  addUser,
  findById,
  findByName,
  findByEmail,
  findBy,
  editById,
  removeUser,
}

function addUser(user) {
  return db('users')
    .insert(user, 'id')
    .then(ids => {
      const [id] = ids;
      return findById(id);
    });
}

function findById(id) {
  return db('users')
    .select('id', 'username', 'email')
    .where({
      id
    })
    .first();
}

function findByName(username) {
  return db('users')
    .select('username')
    .where({
      username
    })
    .first();
}

function findByEmail(email) {
  return db('users')
    .select('id', 'email')
    .where({
      email
    })
    .first();
}

function findBy(filter) {
  return db('users').where(filter)
}

// Edit user info
function editById(id, update) {
  return db('users')
    .where({ id })
    .update(update, '*');
}

function removeUser(id) {
  return db('users')
    .where({ id })
    .del();
}