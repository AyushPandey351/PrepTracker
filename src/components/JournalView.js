import React from 'react';
import { motion } from 'framer-motion';
import { ScrollText } from 'lucide-react';
import ActivityHeatmap from './ActivityHeatmap';
import JournalTimeline from './JournalTimeline';

function JournalView({ activityLog }) {
  return (
    <motion.div
      key="journal"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="content-header">
        <h1 className="content-title">
          <div className="content-title-icon" style={{ background: 'linear-gradient(135deg, #00d9ff, #bf7fff)' }}>
            <ScrollText size={28} />
          </div>
          Activity Journal
        </h1>
        <p className="content-subtitle">Your daily learning timeline</p>
      </div>

      <ActivityHeatmap activities={activityLog} />

      <JournalTimeline activityLog={activityLog} />
    </motion.div>
  );
}

export default JournalView;
