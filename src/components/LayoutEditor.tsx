// components/LayoutEditor.tsx
import React, { useState } from "react";
import { DndContext, DragOverlay, MouseSensor, useSensor } from "@dnd-kit/core";
import { RestaurantLayout } from "./RestaurantLayout";
import { TablePropertiesPanel } from "./TablePropertiesPanel";
import { RestaurantTable } from "../models/table";
import {
  restrictToParentElement,
  snapCenterToCursor,
} from "@dnd-kit/modifiers";
import { Drawer, DrawerItems } from "flowbite-react";
import { MerchantModel } from "../models/merchant";
import { updateLayout, updateMerchantDesk } from "../services/api/merchantApi";

interface LayoutEditorProps {
  merchant: MerchantModel;
  initialTables: RestaurantTable[];
  onSave: (tables: RestaurantTable[]) => void;
  layoutWidth?: number;
  layoutHeight?: number;
  onUpdate: (tables: RestaurantTable[]) => void;
}

export interface GridConfig {
  size: number; // Ukuran grid dalam pixel
  enabled: boolean;
}

export const LayoutEditor: React.FC<LayoutEditorProps> = ({
  merchant,
  initialTables,
  onSave,
  onUpdate,
  layoutWidth = 800,
  layoutHeight = 600,
}) => {
  const [tables, setTables] = useState<RestaurantTable[]>(initialTables);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [gridConfig, setGridConfig] = useState<GridConfig>({
    size: 20, // Default 20px grid
    enabled: true,
  });

  const snapToGrid = (value: number): number => {
    if (!gridConfig.enabled) return value;
    return Math.round(value / gridConfig.size) * gridConfig.size;
  };

  const selectedTable =
    tables.find((table) => table.id === selectedTableId) || null;
  const handleDragEnd = (event: any) => {
    const { active, over, delta } = event;

    if (!active || !over) return;
    let newTables = tables.map((table) => {
      if (table.id === active.id) {
        const newX = (table.position.x + delta.x);
        const newY = (table.position.y + delta.y);

        // Pastikan tidak keluar dari bounds
        const boundedX = Math.max(0, Math.min(newX, layoutWidth - table.width));
        const boundedY = Math.max(
          0,
          Math.min(newY, layoutHeight - table.height)
        );
        updateMerchantDesk(merchant.id!, table.id, {
          merchant_id: merchant.id!,
          desk_name: table.number,
          status: table.status,
          capacity: table.capacity,
          position: {
            ...table.position,
            x: snapToGrid(boundedX),
            y: snapToGrid(boundedY),
          },
          shape: table.shape,
          width: table.width,
          height: table.height,
        });
        return {
          ...table,
          position: {
            ...table.position,
            x: snapToGrid(boundedX),
            y: snapToGrid(boundedY),
          },
        };
      }
      return table;
    });
    setTables(newTables);
    onUpdate(newTables);
  };

  const updateTableProperties = (updates: Partial<RestaurantTable>) => {
    if (!selectedTableId) return;

    setTables(
      tables.map((table) => {
        let newTable = { ...table, ...updates };
        updateMerchantDesk(merchant.id!, newTable.id, {
          merchant_id: merchant.id!,
          desk_name: newTable.number,
          status: newTable.status,
          capacity: newTable.capacity,
          shape: newTable.shape,
          width: newTable.width,
          height: newTable.height,
        });
        return table.id === selectedTableId ? newTable : table;
      })
    );
  };

  const addNewTable = () => {
    const newTable: RestaurantTable = {
      id: `table-${Date.now()}`,
      number: `#tbl-${(tables.length + 1).toString().padStart(3, "0")}`,
      status: "available",
      capacity: 4,
      shape: "rectangle",
      width: 80,
      height: 60,
      position: { x: 100, y: 100, rotation: 0 },
    };

    setTables([...tables, newTable]);
    setSelectedTableId(newTable.id);
  };

  const sensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 5, // Mulai drag setelah 5px pergerakan
    },
  });

  return (
    <div className="layout-editor">
    

      <div
        className="editor-content"
        style={{ width: layoutWidth, height: layoutHeight }}
      >
        <DndContext
          sensors={[sensor]}
          modifiers={[restrictToParentElement, snapCenterToCursor]}
          onDragEnd={handleDragEnd}
        >
          <RestaurantLayout
            gridConfig={gridConfig}
            tables={tables}
            onTablesUpdate={setTables}
            onTableSelect={setSelectedTableId}
            layoutHeight={layoutHeight}
            layoutWidth={layoutWidth}
            onDoubleClick={(val) => {
              setSelectedTableId(val.id);
            }}
          />
          <DragOverlay>
            {selectedTable && (
              <div className="dragged-table">{selectedTable.number}</div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
      <Drawer
        position="right"
        open={selectedTableId !== null}
        onClose={() => setSelectedTableId(null)}
      >
        <Drawer.Header></Drawer.Header>
        <DrawerItems></DrawerItems>
        <DrawerItems>
          {selectedTable && (
            <TablePropertiesPanel
              table={selectedTable}
              onUpdate={updateTableProperties}
              onClose={() => {
                setSelectedTableId(null);
              }}
            />
          )}
        </DrawerItems>
      </Drawer>
    </div>
  );
};
