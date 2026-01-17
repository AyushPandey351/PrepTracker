import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Plus, Trash2 } from 'lucide-react';

function ApplicationTrackerView({ applications, addApplication, deleteApplication }) {
  return (
    <motion.div
      key="tracker"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="content-header">
        <h1 className="content-title">
          <div className="content-title-icon">
            <Briefcase size={28} />
          </div>
          Application Tracker
        </h1>
        <p className="content-subtitle">Track your job applications</p>
      </div>

      <div className="checklist-section">
        <div className="checklist-header">
          <h3 className="checklist-title">Applications</h3>
          <button className="btn btn-primary" onClick={addApplication}>
            <Plus size={18} />
            Add Application
          </button>
        </div>

        {applications.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="tracker-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td style={{ fontWeight: 600 }}>{app.company}</td>
                    <td>{app.role}</td>
                    <td>
                      <span className={`status-badge ${app.status?.toLowerCase()}`}>
                        {app.status?.charAt(0) + app.status?.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'JetBrains Mono', fontSize: '0.9rem' }}>
                      {app.date ? new Date(app.date).toLocaleDateString() : '-'}
                    </td>
                    <td>
                      <button
                        className="nav-action-btn delete"
                        onClick={() => deleteApplication(app.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Briefcase size={32} />
            </div>
            <h3 className="empty-state-title">No applications yet</h3>
            <p className="empty-state-text">Start tracking your job applications</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ApplicationTrackerView;
