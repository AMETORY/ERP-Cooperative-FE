// SortableComponents.tsx
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MenuItem } from "../models/menu_item";
import {
  BsChevronDown,
  BsChevronRight,
  BsGripVertical,
  BsImage,
  BsTrash,
} from "react-icons/bs";

interface SortableCategoryProps {
  item: MenuItem;
  isActive: boolean;
  onSelect: () => void;
  onDelete: (id: string) => void;
}

export const SortableCategory: React.FC<SortableCategoryProps> = ({
  item,
  isActive,
  onSelect,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`menu-category ${isActive ? "active" : ""}`}
    >
      <div className="category-content" onClick={onSelect}>
        <button className="drag-handle" {...attributes} {...listeners}>
          <BsGripVertical />
        </button>
        <span className="category-name">{item.name}</span>
        {item.children && (
          <span className="toggle-icon">
            {isActive ? <BsChevronDown /> : <BsChevronRight />}
          </span>
        )}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item.id);
        }}
        className="delete-button"
      >
        <BsTrash size={14} />
      </button>
    </div>
  );
};

interface SortableSubCategoryProps {
  item: MenuItem;
  isActive: boolean;
  onSelect: () => void;
  onDelete: (id: string) => void;
}

export const SortableSubCategory: React.FC<SortableSubCategoryProps> = ({
  item,
  isActive,
  onSelect,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`menu-subcategory ${isActive ? "active" : ""}`}
    >
      <div className="subcategory-content" onClick={onSelect}>
        <button className="drag-handle" {...attributes} {...listeners}>
          <BsGripVertical />
        </button>
        <span className="subcategory-name">{item.name}</span>
        {item.children && (
          <span className="toggle-icon">
            {isActive ? <BsChevronDown /> : <BsChevronRight />}
          </span>
        )}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item.id);
        }}
        className="delete-button"
      >
        <BsTrash size={14} />
      </button>
    </div>
  );
};

interface SortableMenuItemProps {
  item: MenuItem;
  onDelete: (id: string) => void;
}

export const SortableMenuItem: React.FC<SortableMenuItemProps> = ({
  item,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="menu-item">
      <div className="item-content">
        <button className="drag-handle" {...attributes} {...listeners}>
          <BsGripVertical />
        </button>
        <div className="item-details">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8">
              {item.product?.product_images.length == 0 ? (
                <BsImage />
              ) : (
                <img
                  className="w-full h-full object-cover  rounded-full"
                  src={item.product?.product_images[0].url}
                  alt=""
                />
              )}
            </div>
            <div className="flex flex-col">
              <span className="item-name">{item.name}</span>
              {item.product?.sku && (
                <span className="item-price">{item.product?.sku}</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <button onClick={() => onDelete(item.id)} className="delete-button">
        <BsTrash size={14} />
      </button>
    </div>
  );
};
