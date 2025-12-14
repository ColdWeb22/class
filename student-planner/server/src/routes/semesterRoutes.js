const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
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
  .post(createSemester);

router.route('/:id')
  .get(getSemester)
  .put(updateSemester)
  .delete(deleteSemester);

router.post('/:semesterId/courses', addCourse);
router.route('/courses/:courseId')
  .put(updateCourse)
  .delete(deleteCourse);

module.exports = router;
