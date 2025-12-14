const express = require('express');
const router = express.Router();
const {
    calculateRequiredGPA,
    calculateStudyHours,
    analyzeGradeCombinations
} = require('../controllers/plannerController');
const { protect } = require('../middleware/auth');
const {
    gpaCalculationValidation,
    studyHoursValidation,
    gradeAnalysisValidation
} = require('../middleware/validation');

// Public routes (work without auth) but can save if authenticated
router.post('/calculate-gpa', gpaCalculationValidation, calculateRequiredGPA);
router.post('/plan-study', studyHoursValidation, calculateStudyHours);
router.post('/analyze-grades', gradeAnalysisValidation, analyzeGradeCombinations);

module.exports = router;
