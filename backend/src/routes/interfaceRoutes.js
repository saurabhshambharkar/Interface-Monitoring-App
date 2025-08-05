const express = require('express');
const router = express.Router();
const interfaceController = require('../controllers/interfaceController');

// GET /api/interfaces - Get all interfaces with filtering and pagination
router.get('/', interfaceController.getInterfaces);

// GET /api/interfaces/summary - Get summary statistics
router.get('/summary', interfaceController.getSummary);

// GET /api/interfaces/:id - Get interface by ID
router.get('/:id', interfaceController.getInterfaceById);

// POST /api/interfaces - Create new interface
router.post('/', interfaceController.createInterface);

// PUT /api/interfaces/:id - Update interface
router.put('/:id', interfaceController.updateInterface);

// DELETE /api/interfaces/:id - Delete interface
router.delete('/:id', interfaceController.deleteInterface);

module.exports = router; 