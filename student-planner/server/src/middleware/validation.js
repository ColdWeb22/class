const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

const gpaCalculationValidation = [
  body('currentCGPA').isFloat({ min: 0, max: 5 }).withMessage('Current CGPA must be between 0 and 5'),
  body('creditsCompleted').isInt({ min: 0 }).withMessage('Credits completed must be a positive integer'),
  body('desiredCGPA').isFloat({ min: 0, max: 5 }).withMessage('Desired CGPA must be between 0 and 5'),
  body('semesterCredits').isInt({ min: 1 }).withMessage('Semester credits must be at least 1'),
  handleValidationErrors
];

const studyHoursValidation = [
  body('courses').isArray({ min: 1 }).withMessage('Courses must be a non-empty array'),
  body('courses.*.name').notEmpty().withMessage('Course name is required'),
  body('courses.*.units').isInt({ min: 1 }).withMessage('Units must be at least 1'),
  body('courses.*.targetGrade').isIn(['A', 'B', 'C', 'D', 'F']).withMessage('Invalid target grade'),
  body('targetCGPA').isFloat({ min: 0, max: 5 }).withMessage('Target CGPA must be between 0 and 5'),
  handleValidationErrors
];

const gradeAnalysisValidation = [
  body('courses').isArray({ min: 1 }).withMessage('Courses must be a non-empty array'),
  body('courses.*.name').notEmpty().withMessage('Course name is required'),
  body('courses.*.units').isInt({ min: 1 }).withMessage('Units must be at least 1'),
  body('targetSemesterGPA').isFloat({ min: 0, max: 5 }).withMessage('Target GPA must be between 0 and 5'),
  handleValidationErrors
];

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

const semesterValidation = [
  body('name').trim().notEmpty().withMessage('Semester name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Semester name must be between 2 and 100 characters'),
  body('target_gpa').optional().isFloat({ min: 0, max: 5 }).withMessage('Target GPA must be between 0 and 5'),
  body('courses').optional().isArray().withMessage('Courses must be an array'),
  body('courses.*.name').optional().trim().notEmpty().withMessage('Course name is required'),
  body('courses.*.units').optional().isInt({ min: 1, max: 10 }).withMessage('Units must be between 1 and 10'),
  body('courses.*.targetGrade').optional().isIn(['A', 'B', 'C', 'D', 'F']).withMessage('Invalid target grade'),
  body('courses.*.actualGrade').optional().isIn(['A', 'B', 'C', 'D', 'F', null]).withMessage('Invalid actual grade'),
  body('courses.*.study_hours').optional().isInt({ min: 0, max: 168 }).withMessage('Study hours must be between 0 and 168'),
  handleValidationErrors
];

const courseValidation = [
  body('name').trim().notEmpty().withMessage('Course name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Course name must be between 2 and 100 characters'),
  body('units').isInt({ min: 1, max: 10 }).withMessage('Units must be between 1 and 10'),
  body('targetGrade').optional().isIn(['A', 'B', 'C', 'D', 'F']).withMessage('Invalid target grade'),
  body('actualGrade').optional().isIn(['A', 'B', 'C', 'D', 'F', null]).withMessage('Invalid actual grade'),
  body('study_hours').optional().isInt({ min: 0, max: 168 }).withMessage('Study hours must be between 0 and 168 per week'),
  handleValidationErrors
];

const profileUpdateValidation = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Valid email is required'),
  handleValidationErrors
];

module.exports = {
  gpaCalculationValidation,
  studyHoursValidation,
  gradeAnalysisValidation,
  registerValidation,
  loginValidation,
  semesterValidation,
  courseValidation,
  profileUpdateValidation,
  handleValidationErrors
};
