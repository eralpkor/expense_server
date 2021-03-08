const { check } = require('express-validator');

exports.loginValidator = () => {
  return [
    check('username').notEmpty().withMessage('username or email is required'),
    check('password').notEmpty().withMessage('password is required')
  ]
}

exports.editUserValidator = () => {
  return [
    check('email')
      .isEmail()
      .normalizeEmail(),
    check('firstname')
      // .notEmpty()
      // .withMessage('First name is required')
      .isLength({ min: 2 })
      .withMessage('First name must be 2 characters')
      .not()
      .custom((val) => /[^a-z ,.'-]+$/i.test(val))
      .withMessage('First name cannot contain special chars.'),
    check('lastname')
      // .notEmpty()
      // .withMessage('Last name is required')
      .isLength({ min: 2 })
      .withMessage('Last name must have 2 characters')
      .not()
      .custom((val) => /[^a-z ,.'-]+$/i.test(val))
      .withMessage('Last name cannot contain special chars.')
  ]
}
