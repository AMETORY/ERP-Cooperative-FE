// components/TableList.tsx
import React from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { Table } from "../models/table";
import { SortableTableItem } from "./SortableTableItem";
import { useTranslation } from "react-i18next";

interface TableListProps {
  tables: Table[];
  onTablesChange: (tables: Table[]) => void;
}

export const TableList: React.FC<TableListProps> = ({
  tables,
  onTablesChange,
}) => {
  const { t } = useTranslation();
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = tables.findIndex((table) => table.id === active.id);
      const newIndex = tables.findIndex((table) => table.id === over.id);
      onTablesChange(arrayMove(tables, oldIndex, newIndex));
    }
  };

  const updateTable = (id: string, updates: Partial<Table>) => {
    onTablesChange(
      tables.map((table) =>
        table.id === id ? { ...table, ...updates } : table
      )
    );
  };

  const deleteTable = (id: string) => {
    onTablesChange(tables.filter((table) => table.id !== id));
  };

  return (
    
      <div className="table-list ">
        <h3 className="font-semibold">{t('list_table')} ({tables.length})</h3>

        {tables.length === 0 ? (
          <div className="empty-state">
            {t('no_table_yet')}
          </div>
        ) : (
          <DndContext
            modifiers={[restrictToVerticalAxis]}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={tables}
              strategy={verticalListSortingStrategy}
            >
              {tables.map((table) => (
                <SortableTableItem
                  key={table.id}
                  table={table}
                  onUpdate={updateTable}
                  onDelete={deleteTable}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

  );
};
