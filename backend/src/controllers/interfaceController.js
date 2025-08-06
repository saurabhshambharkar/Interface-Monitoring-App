const Interface = require('../models/Interface');

// Get all interfaces with filtering, pagination,
// also sorting
exports.getInterfaces = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status,
      interfaceName,
      integrationKey,
      severity,
      startDate,
      endDate,
      sourceSystem,
      targetSystem
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (status) filter.status = status;
    if (interfaceName) filter.interfaceName = { $regex: interfaceName, $options: 'i' };
    if (integrationKey) filter.integrationKey = { $regex: integrationKey, $options: 'i' };
    if (severity) filter.severity = severity;
    if (sourceSystem) filter.sourceSystem = { $regex: sourceSystem, $options: 'i' };
    if (targetSystem) filter.targetSystem = { $regex: targetSystem, $options: 'i' };
    
    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with pagination etc
    const interfaces = await Interface.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Interface.countDocuments(filter);

    res.json({
      interfaces,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error fetching interfaces:', error);
    res.status(500).json({ message: 'Error fetching interfaces' });
  }
};

// Get summary statistics
exports.getSummary = async (req, res) => {
  try {
    const { timeRange = '24h' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (timeRange) {
      case '1h':
        dateFilter = { $gte: new Date(now.getTime() - 60 * 60 * 1000) };
        break;
      case '24h':
        dateFilter = { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) };
        break;
      case '7d':
        dateFilter = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
        break;
      case '30d':
        dateFilter = { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
        break;
      default:
        dateFilter = { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) };
    }

    const filter = { createdAt: dateFilter };

    // Get counts by status
    const statusCounts = await Interface.aggregate([
      { $match: filter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Get counts by severity
    const severityCounts = await Interface.aggregate([
      { $match: filter },
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);

    // Get total execution time and records processed
    const totals = await Interface.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalExecutionTime: { $sum: '$executionTime' },
          totalRecordsProcessed: { $sum: '$recordsProcessed' },
          avgExecutionTime: { $avg: '$executionTime' }
        }
      }
    ]);

    // Get top interfaces by execution count
    const topInterfaces = await Interface.aggregate([
      { $match: filter },
      { $group: { _id: '$interfaceName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Get recent failures
    const recentFailures = await Interface.find({
      ...filter,
      status: 'FAILURE'
    })
    .sort({ createdAt: -1 })
    .limit(10)
    .select('interfaceName integrationKey message createdAt')
    .lean();

    const summary = {
      timeRange,
      statusCounts: statusCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      severityCounts: severityCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      totals: totals[0] || { totalExecutionTime: 0, totalRecordsProcessed: 0, avgExecutionTime: 0 },
      topInterfaces,
      recentFailures
    };

    res.json(summary);
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ message: 'Error fetching summary' });
  }
};

// Create new interface record
exports.createInterface = async (req, res) => {
  try {
    const interface = new Interface(req.body);
    await interface.save();
    res.status(201).json(interface);
  } catch (error) {
    console.error('Error creating interface:', error);
    res.status(400).json({ message: 'Error creating interface', error: error.message });
  }
};

// Get interface by ID
exports.getInterfaceById = async (req, res) => {
  try {
    const interface = await Interface.findById(req.params.id);
    if (!interface) {
      return res.status(404).json({ message: 'Interface not found' });
    }
    res.json(interface);
  } catch (error) {
    console.error('Error fetching interface:', error);
    res.status(500).json({ message: 'Error fetching interface' });
  }
};

// Update interface
exports.updateInterface = async (req, res) => {
  try {
    const interface = await Interface.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!interface) {
      return res.status(404).json({ message: 'Interface not found' });
    }
    res.json(interface);
  } catch (error) {
    console.error('Error updating interface:', error);
    res.status(400).json({ message: 'Error updating interface', error: error.message });
  }
};

// Delete interface
exports.deleteInterface = async (req, res) => {
  try {
    const interface = await Interface.findByIdAndDelete(req.params.id);
    if (!interface) {
      return res.status(404).json({ message: 'Interface not found' });
    }
    res.json({ message: 'Interface deleted successfully' });
  } catch (error) {
    console.error('Error deleting interface:', error);
    res.status(500).json({ message: 'Error deleting interface' });
  }
}; 