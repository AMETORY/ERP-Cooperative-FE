// components/SortableTableItem.tsx
import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Table } from "../models/table";
import { BsCheck, BsGripVertical, BsPencil, BsTrash } from "react-icons/bs";
import { FaXmark } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
interface SortableTableItemProps {
  table: Table;
  onUpdate: (id: string, updates: Partial<Table>) => void;
  onDelete: (id: string) => void;
}

export const SortableTableItem: React.FC<SortableTableItemProps> = ({
  table,
  onUpdate,
  onDelete,
}) => {
  const { t } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [editedTable, setEditedTable] = useState(table);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: table.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    onUpdate(table.id, editedTable);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTable(table);
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`table-item ${table.status}`}
    >
      {isEditing ? (
        <div className="edit-form">
          <div className="drag-handle" {...attributes} {...listeners}>
            <BsGripVertical />
          </div>

          <input
            type="text"
            value={editedTable.number}
            onChange={(e) =>
              setEditedTable({ ...editedTable, number: e.target.value })
            }
          />

          <select
            value={editedTable.status}
            onChange={(e) =>
              setEditedTable({ ...editedTable, status: e.target.value as any })
            }
          >
            <option value="available">Tersedia</option>
            <option value="occupied">Terisi</option>
            <option value="reserved">Dipesan</option>
          </select>

          <input
            type="number"
            min="1"
            max="20"
            value={editedTable.capacity}
            onChange={(e) =>
              setEditedTable({
                ...editedTable,
                capacity: parseInt(e.target.value) || 4,
              })
            }
          />

          <button onClick={handleSave} className="save-btn">
            <BsCheck />
          </button>

          <button onClick={handleCancel} className="cancel-btn">
            <FaXmark />
          </button>
        </div>
      ) : (
        <>
          <div className="drag-handle" {...attributes} {...listeners}>
            <BsGripVertical />
          </div>

          <span className="table-number">{table.number}</span>
          <span className={`table-status ${table.status}`}>
            {table.status === "available" && t("status_available")}
            {table.status === "occupied" && t("status_filled")}
            {table.status === "reserved" && t("status_reserved")}
          </span>
          <span className="table-capacity">{t("capacity_alert", { capacity: table.capacity })}</span>

          <button onClick={() => setIsEditing(true)} className="edit-btn">
            <BsPencil />
          </button>

          <button onClick={() => onDelete(table.id)} className="delete-btn">
            <BsTrash />
          </button>
        </>
      )}
    </div>
  );
};
