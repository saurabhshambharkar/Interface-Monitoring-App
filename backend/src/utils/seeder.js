const Interface = require('../models/Interface');
const mongoose = require('mongoose');

const interfaceNames = [
  'Employee Data Sync',
  'Payroll Integration',
  'Time Tracking Sync',
  'Benefits Management',
  'Performance Reviews',
  'Recruitment Pipeline',
  'Training Records',
  'Leave Management',
  'Compensation Data',
  'Organization Structure'
];

const integrationKeys = [
  'EMP_SYNC_001',
  'PAYROLL_INT_002',
  'TIME_TRACK_003',
  'BENEFITS_MGT_004',
  'PERF_REVIEW_005',
  'RECRUIT_PIPE_006',
  'TRAINING_REC_007',
  'LEAVE_MGT_008',
  'COMP_DATA_009',
  'ORG_STRUCT_010'
];

const sourceSystems = [
  'SAP SuccessFactors',
  'Workday',
  'Oracle HCM',
  'ADP',
  'BambooHR'
];

const targetSystems = [
  'SAP ECP',
  'Oracle ERP',
  'ADP Payroll',
  'BambooHR',
  'Custom HR System'
];

const statuses = ['SUCCESS', 'FAILURE', 'PENDING', 'RUNNING'];
const severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

const messages = [
  'Data synchronization completed successfully',
  'Connection timeout occurred',
  'Invalid data format detected',
  'Authentication failed',
  'Rate limit exceeded',
  'Network connectivity issues',
  'Data validation errors',
  'System maintenance in progress',
  'API endpoint not found',
  'Database connection failed'
];

function generateRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateMockInterface() {
  const interfaceName = interfaceNames[Math.floor(Math.random() * interfaceNames.length)];
  const integrationKey = integrationKeys[Math.floor(Math.random() * integrationKeys.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const severity = severities[Math.floor(Math.random() * severities.length)];
  const message = messages[Math.floor(Math.random() * messages.length)];
  const sourceSystem = sourceSystems[Math.floor(Math.random() * sourceSystems.length)];
  const targetSystem = targetSystems[Math.floor(Math.random() * targetSystems.length)];
  
  // Generate random execution time (1-300 seconds)
  const executionTime = Math.floor(Math.random() * 300000) + 1000;
  
  // Generate random records processed (0-10000)
  const recordsProcessed = Math.floor(Math.random() * 10000);
  
  // Generate random date within last 30 days
  const endDate = new Date();
  const startDate = new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);
  const createdAt = generateRandomDate(startDate, endDate);

  return {
    interfaceName,
    integrationKey,
    status,
    message,
    severity,
    executionTime,
    recordsProcessed,
    sourceSystem,
    targetSystem,
    createdAt
  };
}

async function seedData(count = 500000) {
  try {
    console.log('Starting data seeding...');
    
    // Clear existing data
    await Interface.deleteMany({});
    console.log('Cleared existing data');
    
    // Generate and insert data in batches
    const batchSize = 1000;
    const batches = Math.ceil(count / batchSize);
    
    for (let i = 0; i < batches; i++) {
      const batch = [];
      const currentBatchSize = Math.min(batchSize, count - i * batchSize);
      
      for (let j = 0; j < currentBatchSize; j++) {
        batch.push(generateMockInterface());
      }
      
      await Interface.insertMany(batch);
      console.log(`Inserted batch ${i + 1}/${batches} (${currentBatchSize} records)`);
    }
    
    console.log(`Successfully seeded ${count} interface records`);
    
    // Get some statistics
    const totalCount = await Interface.countDocuments();
    const successCount = await Interface.countDocuments({ status: 'SUCCESS' });
    const failureCount = await Interface.countDocuments({ status: 'FAILURE' });
    
    console.log(`Total records: ${totalCount}`);
    console.log(`Success records: ${successCount}`);
    console.log(`Failure records: ${failureCount}`);
    
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// If this file is run directly
if (require.main === module) {
  // Connect to MongoDB
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/interface-monitor', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    return seedData(1000); // Start with 1000 records for testing
  })
  .then(() => {
    console.log('Seeding completed');
    process.exit(0);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
}

module.exports = { seedData, generateMockInterface }; 