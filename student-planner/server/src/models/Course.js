const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Course = sequelize.define('Course', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    units: {
        type: DataTypes.INTEGER,
        validate: { min: 0, max: 6 }
    },
    target_grade: {
        type: DataTypes.STRING,
        defaultValue: 'B' // Default target
    },
    actual_grade: {
        type: DataTypes.STRING,
        allowNull: true
    },
    study_hours: {
        type: DataTypes.FLOAT, // Calculated value
        defaultValue: 0
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

module.exports = Course;
