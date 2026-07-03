const express = require('express');
const router = express.Router();
const Table = require('../models/Table');

// Get all tables
router.get('/', async (req, res) => {
  try {
    const tables = await Table.find();
    res.json(tables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new table
router.post('/', async (req, res) => {
  try {
    const table = new Table(req.body);
    await table.save();
    res.status(201).json(table);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Reserve a table
router.patch('/:id/reserve', async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) return res.status(404).json({ error: 'Table not found' });
    if (!table.isAvailable) return res.status(400).json({ error: 'Table already reserved' });
    
    table.isAvailable = false;
    await table.save();
    res.json(table);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Free a table
router.patch('/:id/free', async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) return res.status(404).json({ error: 'Table not found' });
    
    table.isAvailable = true;
    await table.save();
    res.json(table);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;