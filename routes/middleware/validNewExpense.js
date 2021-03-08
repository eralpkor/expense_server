const { validationResult, check, checkSchema, body } = require('express-validator');

exports.expenseValidator = () => {

  return [
    check('title')
      .notEmpty()
      .withMessage('Title is required.')
      .isLength({ min: 2 })
      .withMessage('Title must be at least 2 characters.')
      .not()
      .custom((val) => /[^A-za-z0-9\s]/g.test(val))
      .withMessage('Title not use uniq characters'),
  
    check('amount')
      .notEmpty()
      .withMessage('Amount is required')
      .isLength({ min: 1 })
      .withMessage('Amount must be 1 characters')
      .isNumeric()
      .withMessage('Amount must be numeric'),


    check('tags')
      .notEmpty()
      .withMessage('Tags are required')
      .isLength({ min: 2 })
      .withMessage('Tag must be 2 characters')
      .isIn(['Automotive', 'Food', 'Mortgage', 'Electric', 'Gas', 'Vacation', 'Insurance', 'Gift'])
      .withMessage("Tags must match one of these: ['Automotive', 'Food', 'Mortgage', 'Electric', 'Gas', 'Vacation', 'Insurance', 'Gift']")   
  ]
}


exports.checkChanges = () => {
  return [
    check('tags').notEmpty().withMessage('Tags are required')
      .isIn(['Automotive', 'Food', 'Mortgage', 'Electric', 'Gas', 'Vacation'])
      .withMessage("Tags must match one of these: ['Automotive', 'Food', 'Mortgage', 'Electric', 'Gas', 'Vacation']") 
  ]
  
}