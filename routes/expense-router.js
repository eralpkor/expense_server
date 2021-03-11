const router = require('express').Router();
const Expense =require('./expense-model');
const User = require('../auth/middleware/auth-model');
const jwt = require('../auth/middleware/jwtAccess');
const { expenseValidator, checkChanges } = require('./middleware/validNewExpense');

const { validationResult, check, checkSchema, body } = require('express-validator');


// GET return users expenses with matching authorization
router.get('/user', jwt.checkToken(), (req, res) => {
  const userId = req.user.subject;
  const userName = req.user.username;
console.log(userId)

  User.findById(userId)
    .then(id => {
      if (!id) {
        res.status(401).json({ message: `User not found.` })
      } else {
        Expense.find(userId)
          .then(ex => {
            console.log(ex)
            if (ex.length) {
              res.status(200).json(ex)
            } else {
              res.status(202).json({ message: `Hello ${userName} you did not create any expenses yet` })
            }
          }).catch(err => {
            console.log(err);
            res.status(500).json({ error: 'Something went wrong.'})
          })
      }
    }).catch(err => {
      console.log(err)
      res.status(500).json({ error: 'Something went wrong.'})
    })
});

// POST - add and expense for logged user.
router.post('/expense', jwt.checkToken(), expenseValidator(), (req, res) => {
  const userId = req.user.subject;
  const expenseData = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  
  User.findById(userId)
    .then(user => {
      // console.log('User ', user)
      if (!user) {
        res.status(401).json({ message: 'User not found.'})
      } else {
        // console.log(expenseData, userId)
        Expense.insertExpense(expenseData, userId)
          .then(expense => {
            res.status(201).json({ message: 'Expense added', expense })
          }).catch(err => {
            console.log(err)
            res.status(500).json({ error: 'Error inserting to database'})
          });
      }
    }).catch(err => {
      console.log(err)
      res.status(500).json({ message: 'Something went wrong'})
    });
});

// PUT - Edit expense for logged user
router.put('/expense/:id', jwt.checkToken(), checkChanges(), (req, res) => {
  const userId = req.user.subject;
  const userName = req.user.username;
  const { id } = req.params;
  const changes = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  
  if (Object.keys(changes).length === 0) {
    res.status(422).json({ error: 'Request body cannot be empty.' })
  }

  Expense.findById(id)
    .then(i => {
      console.log(i)
      if (i.user_id === userId) {
        Expense.updateExpense(id, changes)
          .then(ex => {
            res.status(200).json({ message: `${Object.keys(changes)} updated successful.`, changes })
          }).catch(err => {console.log(err); res.status(404).json({ error: 'No expense'})})
      } else {
        res.status(409).json({ message: `${userName} you don't have andy expenses yet`})
      }
    }).catch(err => {console.log(err); res.status(500).json({ error: err })})
});

// DELETE - Remove expense for logged user
router.delete('/expense/:id', jwt.checkToken(), (req, res) => {
  const { subject, username } = req.user;
  const { id } = req.params;

  Expense.findById(id)
    .then(i => {
      if (!i) {
        res.status(404).json({ error: `No expense found ${id}`})
      } else {
        if (i.user_id === subject) {
          Expense.removeExpense(id)
            .then(e => {
              res.status(202).json({ message: `Expense deleted successfully. ${id}` })
            }).catch(err => {console.log(err); res.status(204).json({error: err})})
        } else {
          res.status(404).json({ error: 'Something went wrong.'})
        }
      }
    }).catch(err => {console.log(err)})
});

module.exports = router;