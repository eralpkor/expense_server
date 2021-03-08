const router = require("express").Router();
const bcrypt = require("bcryptjs");
require("dotenv").config();
const HashFactor = parseInt(process.env.HASH) || 8;
const Users = require("./middleware/auth-model");
const jwt = require("./middleware/jwtAccess");
const { loginValidator, editUserValidator } = require("./validLoginUser");
const validateNewUser = require("./validNewUser");
const { validationResult, check } = require("express-validator");
const checkUserEmail = require("./checkUserEmail");

// POST /auth/register new user
router.post("/register", validateNewUser, (req, res) => {
  const user = req.body;
  console.log("What is user object ", user);

  const hash = bcrypt.hashSync(user.password, HashFactor);
  user.password = hash;
  // why the FUCK ERRORS EMPTY

  Users.addUser(user)
    .then((u) => {
      const token = jwt.generateToken(u);
      res
        .status(201)
        .json({ message: `Welcome ${u.username}`, user: u, token });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// POST /auth/login -login existing user
router.post("/login", loginValidator(), (req, res) => {
  const errors = validationResult(req);
  const { username, password } = req.body;

  // reply with error username & password cannot be empty
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  // find existing user and login
  Users.findBy({ username })
    .first()
    .then((u) => {
      if (u && bcrypt.compareSync(password, u.password)) {
        const token = jwt.generateToken(u);
        res
          .status(200)
          .json({
            message: `Welcome back ${u.username}`,
            user: u.username,
            email: u.email,
            firstname: u.firstname,
            lastname: u.lastname,
            token,
            id: u.id,
          });
      } else {
        res.status(401).json({ message: "Wrong login credentials." });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// GET /profile
router.get("/profile", jwt.checkToken(), (req, res) => {
  const userId = req.user.subject;

  Users.findById(userId)
    .then((id) => {
      if (!id) {
        res.status(401).json({ message: "User not found" });
      } else {
        res.status(200).json(id);
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Something went wrong, server error." });
    });
});

// edit existing user
router.put(
  "/update",
  jwt.checkToken(),
  editUserValidator(),
  (req, res, next) => {
    const errors = validationResult(req);
    const userId = req.user.subject;
    const changes = req.body;

    if (!errors.isEmpty()) {
      console.log({ errors: errors.array() });
      return res.status(422).json({ errors: errors.array() });
    }

    Users.findById(userId)
      .then((u) => {
        if (u.id === userId) {
          if (changes.password) {
            const hash = bcrypt.hashSync(changes.password, HashFactor);
            changes.password = hash;
          }
          if (u.email !== changes.email) {
            Users.findByEmail(changes.email)
              .then((email) => {
                res
                  .status(409)
                  .json({ error: `${email.email} already exist! ` });
                res.end();
              })
              .catch((err) => console.log(err));
          } else {
            Users.editById(userId, changes)
              .then((e) => {
                console.log("User updated ", changes.email, "what is e ", e);
                res
                  .status(200)
                  .json({
                    message: `${Object.keys(changes)} updated successfully.`,
                  });
              })
              .catch((err) => {
                console.log(err);
                res.status(404).json({ error: err });
              });
          }
        } else {
          res
            .status(404)
            .json({
              message: `The server can not find requested resource. User id: ${id}`,
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  }
);

// Admin only delete user route
// Delete user, provide a login token in the header.
router.delete("/remove", jwt.checkToken(), (req, res) => {
  const id = req.user.subject;
  const username = req.user.username;
  const deletedUser = req.body.id;

  if (id !== process.env.ADMIN_ID && username !== process.env.ADMIN) {
    res.status(401).json({ message: "Wrong login credentials." });
  }

  Users.findById(deletedUser)
    .then((u) => {
      if (u) {
        Users.removeUser(u.id)
          .then((u) => {
            res
              .status(201)
              .json({
                message: `User with 🆔 ${deletedUser} is deleted from the database.`,
              });
          })
          .catch((err) => {
            console.log(err);
            res
              .status(500)
              .json({ err: `Error deleting user id ${deletedUser}` });
          });
      } else {
        res
          .status(400)
          .json({ message: `No user with 🆔 ${deletedUser} in database..` });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

module.exports = router;
