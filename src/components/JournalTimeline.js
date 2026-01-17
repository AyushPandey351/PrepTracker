import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Zap } from 'lucide-react';

function JournalTimeline({ activityLog }) {
  const [hoveredDate, setHoveredDate] = useState(null);

  // Group activities by date
  const groupedByDate = activityLog.reduce((acc, activity) => {
    const date = activity.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(activity);
    return acc;
  }, {});

  // Sort dates in descending order (most recent first)
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(b) - new Date(a));

  // Format date helper
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (dateStr === today.toISOString().split('T')[0]) {
      return 'TODAY';
    } else if (dateStr === yesterday.toISOString().split('T')[0]) {
      return 'YESTERDAY';
    }
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    }).toUpperCase();
  };

  // Format time helper
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get unique categories with colors for a day
  const getCategories = (activities) => {
    const seen = new Set();
    return activities.filter(a => {
      if (seen.has(a.tabName)) return false;
      seen.add(a.tabName);
      return true;
    }).map(a => ({ name: a.tabName, color: a.tabColor }));
  };

  // Get count per category
  const getCategoryCounts = (activities) => {
    const counts = {};
    activities.forEach(a => {
      counts[a.tabName] = (counts[a.tabName] || 0) + 1;
    });
    return counts;
  };

  if (sortedDates.length === 0) {
    return (
      <div className="journal-empty">
        <div className="journal-empty-icon">
          <Zap size={40} />
        </div>
        <h3>No Activity Yet</h3>
        <p>Complete topics to see your progress timeline here</p>
        <div className="journal-empty-decoration">
          <div className="cyber-line"></div>
          <div className="cyber-dot"></div>
          <div className="cyber-line"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="journal-container">
      <div className="journal-timeline-v2">
        {/* The main vertical line */}
        <div className="timeline-spine">
          <div className="spine-glow"></div>
        </div>

        {sortedDates.map((date, dateIndex) => (
          <motion.div
            key={date}
            className={`timeline-row ${hoveredDate === date ? 'expanded' : ''}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: dateIndex * 0.08, duration: 0.3 }}
            onMouseEnter={() => setHoveredDate(date)}
            onMouseLeave={() => setHoveredDate(null)}
          >
            {/* Node on the line */}
            <div className="row-node">
              <div className="node-dot">
                <Zap size={10} />
              </div>
              {hoveredDate === date && <div className="node-pulse"></div>}
            </div>

            {/* Main row content */}
            <div className="row-content">
              {/* Collapsed: One line view */}
              <div className="row-summary">
                <span className="row-date">{formatDate(date)}</span>
                <div className="row-divider"></div>
                <div className="row-categories">
                  {getCategories(groupedByDate[date]).map((cat, i) => (
                    <span 
                      key={i}
                      className="category-tag"
                      style={{ 
                        background: `${cat.color}15`,
                        color: cat.color,
                        borderColor: `${cat.color}40`
                      }}
                    >
                      <span className="category-dot" style={{ background: cat.color }}></span>
                      {cat.name}
                      <span className="category-count">{getCategoryCounts(groupedByDate[date])[cat.name]}</span>
                    </span>
                  ))}
                </div>
                <div className="row-arrow">
                  <ChevronDown size={14} />
                </div>
              </div>

              {/* Expanded: Detailed view on hover */}
              <AnimatePresence>
                {hoveredDate === date && (
                  <motion.div
                    className="row-details"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <div className="details-inner">
                      {groupedByDate[date].map((activity, actIndex) => (
                        <div key={activity.id} className="detail-item">
                          <div className="detail-time">{formatTime(activity.timestamp)}</div>
                          <div 
                            className="detail-indicator"
                            style={{ background: activity.tabColor }}
                          ></div>
                          <div className="detail-info">
                            <span className="detail-title">{activity.itemTitle}</span>
                            <span className="detail-meta">
                              {activity.subtopicName ? `${activity.subtopicName} · ` : ''}{activity.tabName}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}

        {/* End marker */}
        <div className="timeline-origin">
          <div className="origin-node"></div>
          <span className="origin-label">ORIGIN</span>
        </div>
      </div>
    </div>
  );
}

export default JournalTimeline;

