// WorkflowArea.tsx
import React from 'react';
import { SortableStep } from './SortableStep';
import { WorkflowStep, WorkflowSteps } from '../models/workflow_step';

interface WorkflowAreaProps {
  steps: WorkflowSteps;
  onRemove: (stepId: string) => void;
}

export const WorkflowArea: React.FC<WorkflowAreaProps> = ({ steps, onRemove }) => {
  return (
    <div className="workflow-area">
      <h3>Susunan Workflow Anda</h3>
      <div className="workflow-steps">
        {steps.length === 0 ? (
          <div className="empty-state">Drag step ke sini untuk memulai</div>
        ) : (
          steps.map((step) => (
            <SortableStep 
              key={step.id}
              step={step}
              onRemove={onRemove}
            />
          ))
        )}
      </div>
    </div>
  );
};