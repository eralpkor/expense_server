const { check, body } = require('express-validator');
const Users = require('./middleware/auth-model');


module.exports = async (req, res, next) => {
  let errors = [];
  const userId = req.user.subject;
  const changes = req.body;

  const editUserValidator = (user) => {
    Object.keys(user).map(u => {
      if (u === 'firstname' || u === 'lastname' || u === 'email') {
        const len = user[u].length;

        if (len < 2 && u === 'firstname' || len > 50) {
          console.log('what is u here ', u)
          errors.push({ [u]: 'Must be a minimum of 2 chars or maximum of 50 chars.'})
        }
        if (len < 2 && u === 'lastname' || len > 50) {
          console.log('is this last name ', u)
          errors.push({ [u]: 'Must be a minimum of 2 chars or maximum of 50 chars.'})
        }
        if (u === 'email') {
          changes.email = user[u].replace(/\s+/g, '');
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email) &&
            errors.push({ error: "Unexpected Email Address" })
        }
      }
    });
  };

  editUserValidator(changes)

  if (!errors.length) {
    let user = await Users.findById(userId)
    let email = await Users.findByEmail(changes.email)
      if (email && user.email !== email.email) {
        await Users.findByEmail(changes.email)
          .then(user => {
            user.email && errors.push({ email: "Email Already Exist!" })
          })
      }
  }

  errors.length < 1 ? next() : res.status(409).json({ errors: errors })
}

// EOF