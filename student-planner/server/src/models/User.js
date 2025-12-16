const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    googleId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
    },
    unique_id: {
        type: DataTypes.STRING,
        unique: true,
        defaultValue: DataTypes.UUIDV4
    },
    current_cgpa: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
    },
    credits_completed: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    target_cgpa: {
        type: DataTypes.FLOAT,
        defaultValue: 4.0,
    }
}, {
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

User.prototype.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = User;
