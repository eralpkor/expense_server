const { check } = require('express-validator');
const Users = require('./middleware/auth-model');

exports.loginValidator = () => {
  return [
    check('username').notEmpty().withMessage('username or email is required'),
    check('password').notEmpty().withMessage('password is required')
  ]
}

// exports.editUserValidator = () => {
//   return [
//     check('email')
//       .trim()
//       .normalizeEmail()
//       .isEmail()
//       .withMessage('Invalid email')
//       // Custom validation, if email in use or not
//       .custom(async (id) => {
//         const userId = await Users.findById(id)
//         // console.log(userId)
//       })
//       .custom(async (email) => {
//         const existingUser = await Users.findByEmail(email)
//         console.log(existingUser)
//         if (existingUser) {
//           throw new Error('Email already in use!')
//         }
//       }),
//     check('firstname')
//       // .notEmpty()
//       // .withMessage('First name is required')
//       .isLength({ min: 2 })
//       .withMessage('First name must have 2 characters')
//       .not()
//       .custom((val) => /[^a-z ,.'-]+$/i.test(val))
//       .withMessage('First name cannot contain special chars.'),
//     check('lastname')
//       .isLength({ min: 2 })
//       .withMessage('Last name must have 2 characters')
//       .not()
//       .custom((val) => /[^a-z ,.'-]+$/i.test(val))
//       .withMessage('Last name cannot contain special chars.')
//   ]
// }
