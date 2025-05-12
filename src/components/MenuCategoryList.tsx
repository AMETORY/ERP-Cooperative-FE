import React from 'react';
import { MenuItem } from '../models/menu_item';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BsChevronDown, BsChevronRight, BsGripVertical, BsTrash, BsTrash2 } from 'react-icons/bs';

interface MenuCategoryListProps {
  items: MenuItem[];
  type: 'category' | 'subcategory' | 'item';
  onItemClick?: (id: string) => void;
  onDelete?: (id: string) => void;
  activeItemId?: string | null;
}

export const MenuCategoryList: React.FC<MenuCategoryListProps> = ({
  items,
  type,
  onItemClick,
  onDelete,
  activeItemId,
}) => {
  return (
    <div className={`${type}-list`}>
      {items.map((item) => (
        <SortableCategoryItem
          key={item.id}
          item={item}
          type={type}
          isActive={activeItemId === item.id}
          onClick={() => onItemClick?.(item.id)}
          onDelete={() => onDelete?.(item.id)}
        />
      ))}
    </div>
  );
};

interface SortableCategoryItemProps {
  item: MenuItem;
  type: 'category' | 'subcategory' | 'item';
  isActive?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
}

const SortableCategoryItem: React.FC<SortableCategoryItemProps> = ({
  item,
  type,
  isActive,
  onClick,
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
      className={`menu-${type} ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <div className={`${type}-content`}>
        <button 
          className="drag-handle"
          {...attributes}
          {...listeners}
        >
          <BsGripVertical />
        </button>
        
        <span className={`${type}-name`}>{item.name}</span>
        
        {type !== 'item' && (
          <span className="toggle-icon">
            {isActive ? <BsChevronDown /> : <BsChevronRight />}
          </span>
        )}
        
        {type === 'item' && item.price && (
          <span className="item-price">Rp {item.price.toLocaleString()}</span>
        )}
      </div>
      
      {onDelete && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }} 
          className="delete-button"
        >
          <BsTrash size={14} />
        </button>
      )}
    </div>
  );
};