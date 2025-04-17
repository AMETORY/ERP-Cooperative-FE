import { AccountModel } from "./account";
import { CompanyModel } from "./company";
import { UserModel } from "./user";

export interface AssetModel  {
	id?: string;
	company_id?: string;
	company?: CompanyModel;
	user_id?: string;
	user?: UserModel;
	name: string;
	asset_number: string;
	date: Date;
	depreciation_method: string;
	life_time: number;
	is_depreciation_asset: boolean;
	description: string;
	acquisition_cost: number;
	account_fixed_asset_id?: string;
	account_fixed_asset?: AccountModel;
	account_current_asset_id?: string;
	account_current_asset?: AccountModel;
	account_depreciation_id?: string;
	account_depreciation?: AccountModel;
	account_accumulated_depreciation_id?: string;
	account_accumulated_depreciation?: AccountModel;
	salvage_value: number;
	book_value: number;
	status: "DRAFT" | "PENDING" | "ACTIVE" | "DISPOSED";
	is_monthly: boolean;
	depreciations?: DepreciationCostModel[];
	depreciation_method_label?: string;
}


export interface DepreciationCostModel {
	id?: string;
	company_id?: string;
	company?: CompanyModel;
	user_id?: string;
	user?: UserModel;
	asset_id?: string;
	asset?: AssetModel;
	amount: number;
	period: number;
	month: number;
	executed_at?: Date;
	transaction_id?: string;
	status: "PENDING" | "ACTIVE" | "DONE";
}
