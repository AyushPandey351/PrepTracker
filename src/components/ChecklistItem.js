import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Trash2, Edit3 } from 'lucide-react';

function ChecklistItem({ item, onToggle, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(item.text);

  const handleSave = () => {
    onUpdate(text);
    setIsEditing(false);
  };

  return (
    <motion.div
      className={`checklist-item ${item.completed ? 'completed' : ''}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      layout
    >
      <label className="accordion-checkbox" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={item.completed}
          onChange={onToggle}
        />
        <span className="checkmark">
          <Check size={14} />
        </span>
      </label>

      {isEditing ? (
        <input
          type="text"
          className="form-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          autoFocus
          style={{ flex: 1, padding: '8px 12px' }}
        />
      ) : (
        <span className="checklist-item-text" onDoubleClick={() => setIsEditing(true)}>
          {item.text}
        </span>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <button className="nav-action-btn" onClick={() => setIsEditing(true)}>
          <Edit3 size={14} />
        </button>
        <button className="nav-action-btn delete" onClick={onDelete}>
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
}

export default ChecklistItem;

