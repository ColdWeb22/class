const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Semester = sequelize.define('Semester', {
    name: {
        type: DataTypes.STRING,
        allowNull: false, // e.g., "Fall 2024"
    },
    target_gpa: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: { min: 0, max: 5 }
    },
    actual_gpa: {
        type: DataTypes.FLOAT,
        allowNull: true,
        validate: { min: 0, max: 5 }
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('planning', 'in-progress', 'completed'),
        defaultValue: 'planning'
    }
});

module.exports = Semester;
