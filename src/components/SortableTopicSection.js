import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, GripVertical, Plus, Trash2 } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SortableAccordionItem from './SortableAccordionItem';

// Collapsible Topic Section (for categories like DP, Graphs, Trees)
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
  onDeleteTopic,
  onReorderItems,
  dragHandleProps = {}
}) {
  // DnD Sensors for items within this topic
  const itemSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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
      <div className="topic-header">
        {/* Drag Handle */}
        <div className="drag-handle" {...dragHandleProps}>
          <GripVertical size={16} />
        </div>

        <motion.div
          className="topic-chevron"
          variants={chevronVariants}
          initial="collapsed"
          animate={isOpen ? "expanded" : "collapsed"}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={onToggle}
        >
          <ChevronDown size={18} />
        </motion.div>

        <div className="topic-color-dot" style={{ background: topic.color }} onClick={onToggle} />

        <span className="topic-name" onClick={onToggle}>{topic.name}</span>

        <span className="topic-badge" onClick={onToggle}>
          {topic.items.filter(i => i.completed).length}/{topic.items.length}
        </span>

        <div className="topic-progress-mini" onClick={onToggle}>
          <div
            className="topic-progress-mini-fill"
            style={{ width: `${progress}%`, background: topic.color }}
          />
        </div>

        <div className="topic-actions">
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
            <DndContext
              sensors={itemSensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => {
                const { active, over } = event;
                if (over && active.id !== over.id) {
                  const oldIndex = topic.items.findIndex(i => i.id === active.id);
                  const newIndex = topic.items.findIndex(i => i.id === over.id);
                  onReorderItems(topic.id, oldIndex, newIndex);
                }
              }}
            >
              <SortableContext items={topic.items.map(i => i.id)} strategy={verticalListSortingStrategy}>
                <div className="topic-questions">
                  {topic.items.map((item) => (
                    <SortableAccordionItem
                      key={item.id}
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
              </SortableContext>
            </DndContext>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sortable wrapper for TopicSection
function SortableTopicSection(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.topic.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TopicSection {...props} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  );
}

export default SortableTopicSection;
