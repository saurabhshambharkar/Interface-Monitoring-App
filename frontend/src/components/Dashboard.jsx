import { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdvancedFilterModal from './AdvancedFilterModal';
import './Dashboard.css';

// Set API base URL for local development. For production, use the Render URL.
const API_BASE_URL = 'http://localhost:5000'; // Change to 'https://interface-monitoring-app.onrender.com' for production

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [interfaces, setInterfaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 50
  });
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({ status: '', severity: '', keyword: '' });
  const [appliedFilters, setAppliedFilters] = useState({ status: '', severity: '', keyword: '' });

  // Colors for charts
  const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#3b82f6'];

  useEffect(() => {
    fetchSummary();
    fetchInterfaces(1, appliedFilters);
    // eslint-disable-next-line
  }, [timeRange, appliedFilters]);

  const fetchSummary = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/interfaces/summary?timeRange=${timeRange}`);
      setSummary(response.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const fetchInterfaces = async (page = 1, filterObj = appliedFilters) => {
    try {
      setLoading(true);
      let url = `${API_BASE_URL}/api/interfaces?page=${page}&limit=50&timeRange=${timeRange}`;
      if (filterObj.status) url += `&status=${filterObj.status}`;
      if (filterObj.severity) url += `&severity=${filterObj.severity}`;
      if (filterObj.keyword) url += `&integrationKey=${encodeURIComponent(filterObj.keyword)}&message=${encodeURIComponent(filterObj.keyword)}`;
      const response = await axios.get(url);
      setInterfaces(response.data.interfaces);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching interfaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
    setShowFilter(false);
  };

  const handleResetFilters = () => {
    setFilters({ status: '', severity: '', keyword: '' });
    setAppliedFilters({ status: '', severity: '', keyword: '' });
    setShowFilter(false);
  };

  const formatExecutionTime = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadgeClass = (status) => {
    return `status-badge status-${status.toLowerCase()}`;
  };

  const getSeverityBadgeClass = (severity) => {
    return `severity-badge severity-${severity.toLowerCase()}`;
  };

  // Prepare chart data
  const statusChartData = summary ? Object.entries(summary.statusCounts).map(([status, count]) => ({
    name: status,
    value: count
  })) : [];

  const severityChartData = summary ? Object.entries(summary.severityCounts).map(([severity, count]) => ({
    name: severity,
    value: count
  })) : [];

  return (
    <div className="dashboard">
      <AdvancedFilterModal
        open={showFilter}
        onClose={() => setShowFilter(false)}
        filters={filters}
        setFilters={setFilters}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Interface Monitoring Dashboard</h1>
        <p className="dashboard-subtitle">Real-time monitoring of HR integration interfaces</p>
      </div>

      {/* Time Filter */}
      <div className="time-filter">
        <h3>Time Range</h3>
        <div className="time-buttons">
          <button
            className={`time-button ${timeRange === '1h' ? 'active' : ''}`}
            onClick={() => handleTimeRangeChange('1h')}
          >
            Last Hour
          </button>
          <button
            className={`time-button ${timeRange === '24h' ? 'active' : ''}`}
            onClick={() => handleTimeRangeChange('24h')}
          >
            Last 24 Hours
          </button>
          <button
            className={`time-button ${timeRange === '7d' ? 'active' : ''}`}
            onClick={() => handleTimeRangeChange('7d')}
          >
            Last Week
          </button>
          <button
            className={`time-button ${timeRange === '30d' ? 'active' : ''}`}
            onClick={() => handleTimeRangeChange('30d')}
          >
            Last Month
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="summary-grid">
          <div className="summary-card success">
            <h3>Successful Executions</h3>
            <div className="value">{summary.statusCounts.SUCCESS || 0}</div>
            <div className="label">Completed successfully</div>
          </div>
          <div className="summary-card failure">
            <h3>Failed Executions</h3>
            <div className="value">{summary.statusCounts.FAILURE || 0}</div>
            <div className="label">Failed to complete</div>
          </div>
          <div className="summary-card pending">
            <h3>Pending Executions</h3>
            <div className="value">{summary.statusCounts.PENDING || 0}</div>
            <div className="label">Waiting to start</div>
          </div>
          <div className="summary-card running">
            <h3>Running Executions</h3>
            <div className="value">{summary.statusCounts.RUNNING || 0}</div>
            <div className="label">Currently executing</div>
          </div>
          <div className="summary-card">
            <h3>Total Records Processed</h3>
            <div className="value">{summary.totals.totalRecordsProcessed?.toLocaleString() || 0}</div>
            <div className="label">Across all interfaces</div>
          </div>
          <div className="summary-card">
            <h3>Average Execution Time</h3>
            <div className="value">{formatExecutionTime(summary.totals.avgExecutionTime || 0)}</div>
            <div className="label">Per interface execution</div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="charts-container">
        <h3>Interface Statistics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>
          {/* Status Distribution */}
          <div>
            <h4 style={{ marginBottom: '15px', color: '#333' }}>Status Distribution</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Severity Distribution */}
          <div>
            <h4 style={{ marginBottom: '15px', color: '#333' }}>Severity Distribution</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={severityChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#667eea" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Interface Logs Table */}
      <div className="logs-container">
        <div className="logs-header">
          <h3>Interface Logs</h3>
          <button className="filters-button" onClick={() => setShowFilter(true)}>
            Advanced Filters
            {(appliedFilters.status || appliedFilters.severity || appliedFilters.keyword) && (
              <span style={{ marginLeft: 8, color: '#6366f1', fontWeight: 700, fontSize: '0.9em' }}>●</span>
            )}
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading interface logs...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Interface Name</th>
                  <th>Integration Key</th>
                  <th>Status</th>
                  <th>Severity</th>
                  <th>Message</th>
                  <th>Execution Time</th>
                  <th>Records Processed</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {interfaces.map((row) => (
                  <tr key={row._id}>
                    <td>{row.interfaceName}</td>
                    <td>{row.integrationKey}</td>
                    <td>
                      <span className={getStatusBadgeClass(row.status)}>
                        {row.status}
                      </span>
                    </td>
                    <td>
                      <span className={getSeverityBadgeClass(row.severity)}>
                        {row.severity}
                      </span>
                    </td>
                    <td>{row.message}</td>
                    <td>{formatExecutionTime(row.executionTime)}</td>
                    <td>{row.recordsProcessed.toLocaleString()}</td>
                    <td>{formatDate(row.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button
              className="time-button"
              disabled={pagination.currentPage === 1}
              onClick={() => fetchInterfaces(pagination.currentPage - 1)}
              style={{ marginRight: '10px' }}
            >
              Previous
            </button>
            <span style={{ margin: '0 15px', color: '#666' }}>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              className="time-button"
              disabled={pagination.currentPage === pagination.totalPages}
              onClick={() => fetchInterfaces(pagination.currentPage + 1)}
              style={{ marginLeft: '10px' }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 