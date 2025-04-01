export interface BrandModel {
  id: string;
  name: string;
  description: string;
  logo: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  contact_person: string;
  contact_position: string;
  contact_title: string;
  contact_note: string;
  registration_number: string;
  company_id?: string | null;
}
export interface TopBrandModel  {
  id: string;
  brand_id: string;
  brand?: BrandModel;
  value: number;
}

