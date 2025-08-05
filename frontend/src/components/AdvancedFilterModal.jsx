import React from 'react';
import './AdvancedFilterModal.css';

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'SUCCESS', label: 'Success' },
  { value: 'FAILURE', label: 'Failure' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'RUNNING', label: 'Running' },
];

const severityOptions = [
  { value: '', label: 'All Severities' },
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'CRITICAL', label: 'Critical' },
];

export default function AdvancedFilterModal({ open, onClose, filters, setFilters, onApply, onReset }) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Advanced Filters</h2>
        <form
          onSubmit={e => {
            e.preventDefault();
            onApply();
          }}
        >
          <div className="modal-field">
            <label>Status</label>
            <select
              value={filters.status}
              onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="modal-field">
            <label>Severity</label>
            <select
              value={filters.severity}
              onChange={e => setFilters(f => ({ ...f, severity: e.target.value }))}
            >
              {severityOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="modal-field">
            <label>Keyword</label>
            <input
              type="text"
              placeholder="Search message or integration key..."
              value={filters.keyword}
              onChange={e => setFilters(f => ({ ...f, keyword: e.target.value }))}
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="apply-btn">Apply</button>
            <button type="button" className="reset-btn" onClick={onReset}>Reset</button>
            <button type="button" className="close-btn" onClick={onClose}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
}