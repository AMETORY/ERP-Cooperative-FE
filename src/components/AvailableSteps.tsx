// AvailableSteps.tsx
import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { WorkflowStep, WorkflowSteps } from '../models/workflow_step';

interface AvailableStepsProps {
  steps: WorkflowSteps;
  onAdd: (step: WorkflowStep) => void;
}

export const AvailableSteps: React.FC<AvailableStepsProps> = ({ steps, onAdd }) => {
  return (
    <div className="available-steps">
      <h3>Step Tersedia</h3>
      <div className="steps-list">
        {steps.map((step) => (
          <DraggableStep 
            key={step.id} 
            step={step} 
            onAdd={() => onAdd(step)}
          />
        ))}
      </div>
    </div>
  );
};

interface DraggableStepProps {
  step: WorkflowStep;
  onAdd: () => void;
}

const DraggableStep: React.FC<DraggableStepProps> = ({ step, onAdd }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: step.id,
    data: {
      type: 'available-step',
      step,
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="step-item"
      {...listeners}
      {...attributes}
      onClick={onAdd}
    >
      {step.name}
    </div>
  );
};