import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import AccordionItem from './AccordionItem';

function TopicSection({ 
  topic, 
  tabId, 
  isOpen, 
  openAccordions, 
  editingItem, 
  progress,
  onToggle, 
  onToggleAccordion,
  onToggleComplete, 
  onUpdateItem, 
  onDeleteItem, 
  onEditItem,
  onAddItem,
  onDeleteTopic
}) {
  const chevronVariants = {
    collapsed: { rotate: -90 },
    expanded: { rotate: 0 }
  };

  const contentVariants = {
    collapsed: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
        opacity: { duration: 0.15 }
      }
    },
    expanded: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] },
        opacity: { duration: 0.25, delay: 0.1 }
      }
    }
  };

  return (
    <div className={`topic-section ${isOpen ? 'open' : ''}`}>
      {/* Topic Header - Simple collapsible */}
      <div className="topic-header" onClick={onToggle}>
        <motion.div
          className="topic-chevron"
          variants={chevronVariants}
          initial="collapsed"
          animate={isOpen ? "expanded" : "collapsed"}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <ChevronDown size={18} />
        </motion.div>
        
        <div className="topic-color-dot" style={{ background: topic.color }} />
        
        <span className="topic-name">{topic.name}</span>
        
        <span className="topic-badge">
          {topic.items.filter(i => i.completed).length}/{topic.items.length}
        </span>
        
        <div className="topic-progress-mini">
          <div 
            className="topic-progress-mini-fill" 
            style={{ width: `${progress}%`, background: topic.color }}
          />
        </div>
        
        <div className="topic-actions" onClick={(e) => e.stopPropagation()}>
          <button className="topic-action-btn" onClick={onAddItem} title="Add Question">
            <Plus size={14} />
          </button>
          <button className="topic-action-btn delete" onClick={onDeleteTopic} title="Delete Topic">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Questions List */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="topic-content"
            variants={contentVariants}
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
          >
            <div className="topic-questions">
              {topic.items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <AccordionItem
                    item={item}
                    isOpen={openAccordions[item.id]}
                    isEditing={editingItem === item.id}
                    onToggle={() => onToggleAccordion(item.id)}
                    onToggleComplete={() => onToggleComplete(item.id)}
                    onUpdate={(updates) => onUpdateItem(item.id, updates)}
                    onDelete={() => onDeleteItem(item.id)}
                    onEdit={() => onEditItem(item.id)}
                    isNested={true}
                  />
                </motion.div>
              ))}

              {topic.items.length === 0 && (
                <div className="empty-questions">
                  <span>No questions yet</span>
                  <button className="add-first-btn" onClick={onAddItem}>
                    <Plus size={14} /> Add first question
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TopicSection;

