const { body, validationResult } = require('express-validator');

// Collects validation errors and returns a 400 if any exist
const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('A valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  runValidation,
];

const validateLogin = [
  body('email').isEmail().withMessage('A valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  runValidation,
];

const validateFAQ = [
  body('question').trim().notEmpty().withMessage('Question is required'),
  body('answer').trim().notEmpty().withMessage('Answer is required'),
  body('category').optional().trim(),
  runValidation,
];

const validateAIAnswer = [
  body('question').trim().notEmpty().withMessage('Question is required'),
  runValidation,
];

const validateAIFaq = [
  body('topic').trim().notEmpty().withMessage('Topic is required'),
  runValidation,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateFAQ,
  validateAIAnswer,
  validateAIFaq,
};
