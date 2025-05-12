// types.ts
export interface Table {
  id: string;
  number: string; // Format: #tbl-001
  status: 'available' | 'occupied' | 'reserved';
  capacity: number;
}