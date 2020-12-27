const Users = require('./middleware/auth-model');

const { validationResult, check, checkSchema, body } = require('express-validator');

exports.checkUser = async(req, res, next) => {
  const errors = [];
  if (!errors.length) {
    await Users.findByName(req.body.username)
      .then(u => u && errors.push({ msg: 'Username already exist', value: u.username, where: 'body', param: 'username'}));
    await Users.findByEmail(req.body.email)
      .then(e => e && errors.push({ msg: 'Email is in use.', value: e.email, where: 'body', param: 'email'}))
  }
  errors.length < 1 ? next() : res.status(409).json({ errors: errors })
}
  
exports.registerValidator = () => {
  return [
    check('email')
      .isEmail()
      .normalizeEmail(),
    check('username')
      .notEmpty()
      .withMessage('username is required')
      .isLength({ min: 2 })
      .withMessage('Username must be 2 characters')
      .not()
      .custom((val) => /[^A-za-z0-9\s]/g.test(val))
      .withMessage('Username not use uniq characters'),
    check('password')
      .notEmpty()
      .withMessage('password is required')
      .isLength({ min: 8 })
      .withMessage('password must be 8 characters')
  ]
}


exports.loginValidator = () => {
  return [
    check('username').notEmpty().withMessage('username or email is required'),
    check('password').notEmpty().withMessage('password is required')
  ]
}

// EOF