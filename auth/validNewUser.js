const Users = require("./middleware/auth-model");

module.exports = async (req, res, next) => {
  const errors = [];

  const validateNewUser = (user) => {
    !user.username && errors.push({ username: "Username is required." });
    !user.password && errors.push({ password: "Password is required." });
    !user.email && errors.push({ email: "Email is required." });

    Object.keys(user).map((u) => {
      if (u === "password" || u === "username" || u === "email") {
        const key = user[u].length;

        // verify len min
        if (key < 4 && u) {
          errors.push({ [u]: "Must be a minimum of 5 characters." });
        }
        // verify len max
        if (key > 50 && u) {
          errors.push({ [u]: "Must be a maximum of 50 chars" });
        }
        //Validate Email Pattern
        if (u === "email") {
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user[u]) &&
            errors.push({ error: "Unexpected Email Address" });
        }
      }
    });
  };

  // validate user input
  validateNewUser(req.body);

  if (!errors.length) {
    // check if user in database
    await Users.findByName(req.body.username).then(
      (user) => {
        console.log(user, "Name exoist")
        user && errors.push({ username: "Username Already Exists!" })
      });
    await Users.findByEmail(req.body.email).then(
      (email) => email && errors.push({ email: "Email Already Exist!" })
    );
  }

   // OK we are probably safe to move on send conflict error
   errors.length < 1 ? next() : res.status(409).json({ errors: errors });
};

// exports.registerValidator = () => {
//   return [
//     check('email')
//       .notEmpty().withMessage('Email cannot be empty')
//       .isEmail()
//       .normalizeEmail(),
//     check('username')
//       .notEmpty()
//       .withMessage('username is required')
//       .isLength({ min: 2 })
//       .withMessage('Username must be 2 characters')
//       .not()
//       .custom((val) => /[^A-za-z0-9\s]/g.test(val))
//       .withMessage('Username not use uniq characters'),
//     check('password')
//       .notEmpty()
//       .withMessage('password is required')
//       .isLength({ min: 8 })
//       .withMessage('password must be 8 characters')
//   ]
// }

// EOF
