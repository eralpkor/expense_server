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
        user && errors.push({ username: "Username taken" })
      });
    await Users.findByEmail(req.body.email).then(
      (email) => email && errors.push({ email: "E-mail already registered" })
    );
  }

   // OK we are probably safe to move on send conflict error
   errors.length < 1 ? next() : res.status(409).json({ errors: errors });
};

// EOF
