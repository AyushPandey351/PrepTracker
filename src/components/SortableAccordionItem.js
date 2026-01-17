import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AccordionItem from './AccordionItem';

// Sortable wrapper for AccordionItem
function SortableAccordionItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <AccordionItem {...props} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  );
}

export default SortableAccordionItem;
