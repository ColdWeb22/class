const { Semester, Course, User } = require('../models');

const createSemester = async (req, res, next) => {
  try {
    const { name, target_gpa, courses } = req.body;

    const semester = await Semester.create({
      name,
      target_gpa,
      UserId: req.user.id
    });

    if (courses && courses.length > 0) {
      const courseData = courses.map(c => ({
        name: c.name,
        units: c.units,
        target_grade: c.targetGrade,
        actual_grade: c.actualGrade || null,
        study_hours: c.studyHours || 0,
        SemesterId: semester.id
      }));
      await Course.bulkCreate(courseData);
    }

    const semesterWithCourses = await Semester.findByPk(semester.id, {
      include: [Course]
    });

    res.status(201).json({
      success: true,
      data: semesterWithCourses
    });
  } catch (error) {
    next(error);
  }
};

const getSemesters = async (req, res, next) => {
  try {
    const semesters = await Semester.findAll({
      where: { UserId: req.user.id },
      include: [Course],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: semesters
    });
  } catch (error) {
    next(error);
  }
};

const getSemester = async (req, res, next) => {
  try {
    const semester = await Semester.findOne({
      where: { 
        id: req.params.id,
        UserId: req.user.id 
      },
      include: [Course]
    });

    if (!semester) {
      return res.status(404).json({
        success: false,
        error: 'Semester not found'
      });
    }

    res.json({
      success: true,
      data: semester
    });
  } catch (error) {
    next(error);
  }
};

const updateSemester = async (req, res, next) => {
  try {
    const { name, target_gpa, actual_gpa } = req.body;

    const semester = await Semester.findOne({
      where: { 
        id: req.params.id,
        UserId: req.user.id 
      }
    });

    if (!semester) {
      return res.status(404).json({
        success: false,
        error: 'Semester not found'
      });
    }

    if (name) semester.name = name;
    if (target_gpa !== undefined) semester.target_gpa = target_gpa;
    if (actual_gpa !== undefined) semester.actual_gpa = actual_gpa;

    await semester.save();

    const updatedSemester = await Semester.findByPk(semester.id, {
      include: [Course]
    });

    res.json({
      success: true,
      data: updatedSemester
    });
  } catch (error) {
    next(error);
  }
};

const deleteSemester = async (req, res, next) => {
  try {
    const semester = await Semester.findOne({
      where: { 
        id: req.params.id,
        UserId: req.user.id 
      }
    });

    if (!semester) {
      return res.status(404).json({
        success: false,
        error: 'Semester not found'
      });
    }

    await semester.destroy();

    res.json({
      success: true,
      message: 'Semester deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

const addCourse = async (req, res, next) => {
  try {
    const { name, units, target_grade, actual_grade, study_hours } = req.body;
    const { semesterId } = req.params;

    // Verify semester belongs to user
    const semester = await Semester.findOne({
      where: { 
        id: semesterId,
        UserId: req.user.id 
      }
    });

    if (!semester) {
      return res.status(404).json({
        success: false,
        error: 'Semester not found'
      });
    }

    const course = await Course.create({
      name,
      units,
      target_grade,
      actual_grade,
      study_hours,
      SemesterId: semesterId
    });

    res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const { name, units, target_grade, actual_grade, study_hours } = req.body;
    const { courseId } = req.params;

    const course = await Course.findByPk(courseId, {
      include: [{
        model: Semester,
        where: { UserId: req.user.id }
      }]
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    if (name) course.name = name;
    if (units !== undefined) course.units = units;
    if (target_grade) course.target_grade = target_grade;
    if (actual_grade !== undefined) course.actual_grade = actual_grade;
    if (study_hours !== undefined) course.study_hours = study_hours;

    await course.save();

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findByPk(courseId, {
      include: [{
        model: Semester,
        where: { UserId: req.user.id }
      }]
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    await course.destroy();

    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSemester,
  getSemesters,
  getSemester,
  updateSemester,
  deleteSemester,
  addCourse,
  updateCourse,
  deleteCourse
};
