require('dotenv').config();
const { sequelize } = require('../config/database');
const User = require('../models/User');

const run = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME || 'Admin';

    if (!email || !password) {
      console.error('Please set ADMIN_EMAIL and ADMIN_PASSWORD in your environment.');
      process.exit(1);
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      console.log(`User with email ${email} already exists (id=${existing.id}).`);
      process.exit(0);
    }

    const user = await User.create({ name, email, password });
    console.log(`Created user ${user.email} with id=${user.id}`);
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin user:', err.message || err);
    process.exit(1);
  }
};

run();
