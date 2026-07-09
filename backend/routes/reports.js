const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

// Get all reports, newest first
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 }).limit(20);
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch reports' });
  }
});

module.exports = router;