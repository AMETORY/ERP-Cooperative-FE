// components/RestaurantLayout.tsx
import {
  useDraggable,
  useDroppable
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import React, { useCallback, useRef, useState } from "react";
import { RestaurantTable, TablePosition } from "../models/table";
import { GridConfig } from "./LayoutEditor";

interface RestaurantLayoutProps {
  gridConfig:GridConfig;
  tables: RestaurantTable[];
  onTablesUpdate: (updatedTables: RestaurantTable[]) => void;
  layoutWidth?: number;
  layoutHeight?: number;
  onTableSelect?: (selectedTableId: string | null) => void;
  onDoubleClick: (val: RestaurantTable) => void;
}

export const RestaurantLayout: React.FC<RestaurantLayoutProps> = ({
  tables,
  onTablesUpdate,
  layoutWidth = 800,
  layoutHeight = 600,
  onDoubleClick,
  gridConfig,
}) => {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const handlePositionChange = useCallback(
    (id: string, newPos: TablePosition) => {
      onTablesUpdate(
        tables.map((table) =>
          table.id === id ? { ...table, position: newPos } : table
        )
      );
    },
    [tables, onTablesUpdate]
  );
  const { setNodeRef: setLayoutRef } = useDroppable({
    id: "layout-area",
  });

  return (
    <div
      ref={setLayoutRef}
      className="restaurant-layout"
      style={{
        width: `${layoutWidth}px`,
        height: `${layoutHeight}px`,
      }}
    >
       {gridConfig.enabled && (
                <div className="grid-overlay" 
                  style={{
                    backgroundSize: `${gridConfig.size}px ${gridConfig.size}px`,
                  }}
                />
              )}
      {tables.map((table) => (
        <DraggableTable
        gridConfig={gridConfig}
          key={table.id}
          table={table}
          onDoubleClick={onDoubleClick}
          isSelected={selectedTable === table.id}
          onSelect={() => setSelectedTable(table.id)}
          onPositionChange={handlePositionChange}
        />
      ))}
    </div>
  );
};

interface DraggableTableProps {
  gridConfig:GridConfig;
  table: RestaurantTable;
  isSelected: boolean;
  onSelect: () => void;
  onDoubleClick: (val: RestaurantTable) => void;
  onPositionChange: (id: string, newPos: TablePosition) => void;
}

const DraggableTable: React.FC<DraggableTableProps> = ({
  table,
  isSelected,
  onSelect,
  onDoubleClick,
  onPositionChange,
  gridConfig
}) => {
  
  const timeout = useRef<number | null>(null);
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: table.id,
    });

  const style = {
    position: "absolute",
    left: `${table.position.x}px`,
    top: `${table.position.y}px`,
    transform: isDragging
      ? `${CSS.Translate.toString(transform)} rotate(${
          table.position.rotation || 0
        }deg)`
      : `rotate(${table.position.rotation || 0}deg)`,
    transition: isDragging ? "none" : "left 0.2s ease, top 0.2s ease",
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.3 : 1,
    width: table.width,
    height: table.height,
  } as React.CSSProperties;
  
  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`table ${table.shape} ${table.status} ${
          isSelected ? "selected" : ""
        }`}
        onClick={onSelect}
        onDoubleClick={() => onDoubleClick(table)}
        {...listeners}
        {...attributes}
      >
        <div
          className="table-number"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {table.number}
        </div>
      </div>
      {/* Grid preview saat dragging */}
      {isDragging && (
        <div
          className="grid-preview"
          style={{
            left: `${
              Math.round(table.position.x / gridConfig.size) * gridConfig.size
            }px`,
            top: `${
              Math.round(table.position.y / gridConfig.size) * gridConfig.size
            }px`,
          }}
        />
      )}
    </>
  );
};
