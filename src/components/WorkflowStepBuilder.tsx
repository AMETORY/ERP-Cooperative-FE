// WorkflowBuilder.tsx
import React, { useEffect, useState } from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { WorkflowStep, WorkflowSteps } from "../models/workflow_step";
import { AvailableSteps } from "./AvailableSteps";
import { WorkflowArea } from "./WorkflowArea";
import { MerchantModel } from "../models/merchant";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { updateMerchant } from "../services/api/merchantApi";
import toast from "react-hot-toast";
interface WorkflowBuilderProps {
  merchant: MerchantModel;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  merchant,
}) => {
  const { t } = useTranslation();

  const AVAILABLE_WORKFLOWS: WorkflowSteps = [
    { id: "select-table", name: t("select_table") },
    { id: "select-menu", name: t("select_menu") },
    { id: "checkout", name: t("checkout_order") },
    { id: "distribute", name: t("distribute_to_station") },
    { id: "deliver", name: t("send_to_table") },
    { id: "complete", name: t("done") },
    { id: "payment", name: t("select_payment") },
    { id: "select-product", name: t("select_product") },
    { id: "add-to-cart", name: t("add_to_cart") },
  ];
  const RESTO_PRESET: WorkflowSteps = [
    { id: "select-table", name: t("select_table") },
    { id: "select-menu", name: t("select_menu") },
    { id: "checkout", name: t("checkout_order") },
    { id: "distribute", name: t("distribute_to_station") },
    { id: "deliver", name: t("send_to_table") },
    { id: "complete", name: t("done") },
    { id: "payment", name: t("payment") },
  ];

  const ECOMMERCE_PRESET: WorkflowSteps = [
    { id: "select-product", name: t("select_product") },
    { id: "add-to-cart", name: t("add_to_cart") },
    { id: "checkout", name: t("checkout") },
    { id: "payment", name: t("payment") },
  ];

  const presets = [
    { value: RESTO_PRESET, label: t("resto") },
    { value: ECOMMERCE_PRESET, label: t("ecommerce") },
  ];
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowSteps>([]);
  const [availableSteps, setAvailableSteps] =
    useState<WorkflowSteps>(AVAILABLE_WORKFLOWS);

  useEffect(() => {
    if (merchant.workflow) {
      setWorkflowSteps(merchant.workflow);
    }
  }, [merchant.workflow]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setWorkflowSteps((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addStepToWorkflow = (step: WorkflowStep) => {
    if (!workflowSteps.some((s) => s.id === step.id)) {
      setWorkflowSteps([...workflowSteps, step]);
    }
  };

  const removeStepFromWorkflow = (stepId: string) => {
    setWorkflowSteps(workflowSteps.filter((step) => step.id !== stepId));
  };

  return (
    <div>
      <div className="workflow-builder h-[calc(100vh-320px)] overflow-y-auto ">
        <div className="flex justify-end">
          <div className="w-[200px]">
            <Select
              options={presets}
              onChange={(e) => {
                setWorkflowSteps(e!.value);
              }}
            />
          </div>
        </div>
        <div className="builder-container">
          <AvailableSteps steps={availableSteps} onAdd={addStepToWorkflow} />

          <DndContext
            modifiers={[restrictToVerticalAxis]}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={workflowSteps}
              strategy={verticalListSortingStrategy}
            >
              <WorkflowArea
                steps={workflowSteps}
                onRemove={removeStepFromWorkflow}
              />
            </SortableContext>
          </DndContext>
        </div>
      </div>
      <button
        onClick={() => {
          updateMerchant(merchant.id!, {
            ...merchant!,
            workflow: workflowSteps,
          }).then(() => {
            toast.success("Workflow saved");
          });
        }}
        className="save-button mt-4"
      >
        Simpan Workflow
      </button>
    </div>
  );
};
