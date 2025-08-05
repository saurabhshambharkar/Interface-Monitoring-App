const mongoose = require('mongoose');

const interfaceSchema = new mongoose.Schema({
  interfaceName: {
    type: String,
    required: true,
    index: true
  },
  integrationKey: {
    type: String,
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILURE', 'PENDING', 'RUNNING'],
    required: true,
    index: true
  },
  message: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM'
  },
  executionTime: {
    type: Number, // in milliseconds
    default: 0
  },
  recordsProcessed: {
    type: Number,
    default: 0
  },
  sourceSystem: {
    type: String,
    required: true
  },
  targetSystem: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
interfaceSchema.index({ createdAt: -1 });
interfaceSchema.index({ status: 1, createdAt: -1 });
interfaceSchema.index({ interfaceName: 1, createdAt: -1 });
interfaceSchema.index({ integrationKey: 1, createdAt: -1 });

module.exports = mongoose.model('Interface', interfaceSchema); 