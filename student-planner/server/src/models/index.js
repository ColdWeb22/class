const { sequelize } = require('../config/database');
const User = require('./User');
const Semester = require('./Semester');
const Course = require('./Course');

// Associations
User.hasMany(Semester, { onDelete: 'CASCADE' });
Semester.belongsTo(User);

Semester.hasMany(Course, { onDelete: 'CASCADE' });
Course.belongsTo(Semester);

module.exports = {
    sequelize,
    User,
    Semester,
    Course,
};
