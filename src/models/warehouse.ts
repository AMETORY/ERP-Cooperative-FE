export interface WarehouseModel {
  id?: string;
  name: string;
  code?: string;
  description?: string;
  address?: string;
  phone?: string;
  contact_person?: string;
  contact_position?: string;
  contact_title?: string;
  contact_note?: string;
  company_id?: string | null;
}
