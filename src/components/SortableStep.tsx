// SortableStep.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { WorkflowStep } from '../models/workflow_step';
import { BsGripVertical } from 'react-icons/bs';

interface SortableStepProps {
  step: WorkflowStep;
  onRemove: (stepId: string) => void;
}

export const SortableStep: React.FC<SortableStepProps> = ({ step, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="workflow-step"
    >
      <button 
        className="step-handle"
        {...attributes}
        {...listeners}
      >
        <BsGripVertical />
      </button>
      <div className="step-content">
        {step.name}
      </div>
      <button 
        onClick={() => onRemove(step.id)} 
        className="remove-step"
      >
        ×
      </button>
    </div>
  );
};