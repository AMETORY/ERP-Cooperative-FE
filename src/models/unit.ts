export interface UnitModel {
    id?: string;
    name: string;
    code: string;
    description: string;
    value?: number;
    is_default?: number;
    company_id?: string
}