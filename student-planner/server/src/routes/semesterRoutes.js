const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { semesterValidation, courseValidation } = require('../middleware/validation');
const {
  createSemester,
  getSemesters,
  getSemester,
  updateSemester,
  deleteSemester,
  addCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/semesterController');

router.use(protect); // All semester routes require authentication

router.route('/')
  .get(getSemesters)
  .post(semesterValidation, createSemester);

router.route('/:id')
  .get(getSemester)
  .put(semesterValidation, updateSemester)
  .delete(deleteSemester);

router.post('/:semesterId/courses', courseValidation, addCourse);
router.route('/courses/:courseId')
  .put(courseValidation, updateCourse)
  .delete(deleteCourse);

module.exports = router;
