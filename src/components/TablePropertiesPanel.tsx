// components/TablePropertiesPanel.tsx
import React from 'react';
import { RestaurantTable } from '../models/table';
import { Button } from 'flowbite-react';

interface TablePropertiesPanelProps {
  table: RestaurantTable;
  onUpdate: (updates: Partial<RestaurantTable>) => void;
  onClose: () => void;
}

export const TablePropertiesPanel: React.FC<TablePropertiesPanelProps> = ({
  table,
  onUpdate,
  onClose
}) => {
  return (
    <div className="">
      <h3>Properti Meja</h3>
      
      <div className="form-group">
        <label>Nomor Meja:</label>
        <input
          type="text"
          value={table.number}
          onChange={(e) => onUpdate({ number: e.target.value })}
        />
      </div>
      
      <div className="form-group">
        <label>Status:</label>
        <select
          value={table.status}
          onChange={(e) => onUpdate({ status: e.target.value as any })}
        >
          <option value="available">Tersedia</option>
          <option value="occupied">Terisi</option>
          <option value="reserved">Dipesan</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>Kapasitas:</label>
        <input
          type="number"
          min="1"
          max="20"
          value={table.capacity}
          onChange={(e) => onUpdate({ capacity: parseInt(e.target.value) || 4 })}
        />
      </div>
      
      <div className="form-group">
        <label>Bentuk:</label>
        <select
          value={table.shape}
          onChange={(e) => onUpdate({ shape: e.target.value as any })}
        >
          <option value="circle">Lingkaran</option>
          <option value="rectangle">Persegi Panjang</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>Ukuran (px):</label>
        <div className="size-controls">
          <input
            type="number"
            min="40"
            max="200"
            value={table.width}
            onChange={(e) => onUpdate({ width: parseInt(e.target.value) || 80 })}
            placeholder="Lebar"
          />
          <input
            type="number"
            min="40"
            max="200"
            value={table.height}
            onChange={(e) => onUpdate({ height: parseInt(e.target.value) || 60 })}
            placeholder="Tinggi"
          />
        </div>
      </div>
      
      <div className="form-group">
        <label>Rotasi (derajat):</label>
        <input
          type="number"
          min="0"
          max="360"
          value={table.position.rotation || 0}
          onChange={(e) => onUpdate({ 
            position: { 
              ...table.position, 
              rotation: parseInt(e.target.value) || 0 
            } 
          })}
        />
      </div>
      <div className="form-group">
        <Button onClick={onClose}>Close</Button>
      </div>
    </div>
  );
}; 