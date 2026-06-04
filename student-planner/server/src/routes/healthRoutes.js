const express = require('express');
const { sequelize } = require('../config/database');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Health check passed',
    timestamp: new Date().toISOString()
  });
});

router.get('/supabase', async (req, res, next) => {
  const startedAt = Date.now();

  try {
    await sequelize.query('SELECT 1 AS ok');

    res.json({
      success: true,
      message: 'Supabase database ping successful',
      latencyMs: Date.now() - startedAt,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    error.statusCode = 503;
    next(error);
  }
});

module.exports = router;
