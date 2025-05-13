// types.ts
export interface Table {
  id: string;
  number: string; // Format: #tbl-001
  status: 'available' | 'occupied' | 'reserved';
  capacity: number;
}

// types.ts
export interface TablePosition {
  x: number;
  y: number;
  rotation?: number; // untuk rotasi meja (0-360)
}

export interface RestaurantTable extends Table {
  position: TablePosition;
  shape: 'square' | 'circle' | 'rectangle'; // bentuk meja
  width: number;
  height: number;
  merchant_desk_layout_id?: string
}