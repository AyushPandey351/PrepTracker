import React from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Plus } from 'lucide-react';
import ChecklistItem from './ChecklistItem';

function ChecklistView({ checklist, addChecklistItem, toggleChecklistItem, updateChecklistItem, deleteChecklistItem }) {
  return (
    <motion.div
      key="checklist"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <div className="content-header">
        <h1 className="content-title">
          <div className="content-title-icon">
            <CheckSquare size={28} />
          </div>
          Checklist
        </h1>
        <p className="content-subtitle">Quick tasks and milestones to track</p>
      </div>

      <div className="checklist-section">
        <div className="checklist-header">
          <h3 className="checklist-title">My Tasks</h3>
          <button className="btn btn-primary" onClick={addChecklistItem}>
            <Plus size={18} />
            Add Task
          </button>
        </div>

        {checklist.map((item) => (
          <ChecklistItem
            key={item.id}
            item={item}
            onToggle={() => toggleChecklistItem(item.id)}
            onUpdate={(text) => updateChecklistItem(item.id, text)}
            onDelete={() => deleteChecklistItem(item.id)}
          />
        ))}

        {checklist.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <CheckSquare size={32} />
            </div>
            <h3 className="empty-state-title">No tasks yet</h3>
            <p className="empty-state-text">Add tasks to keep track of your goals</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ChecklistView;
