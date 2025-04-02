import type { FC } from "react";
import AdminLayout from "../components/layouts/admin";

interface WarehousePageProps {}

const WarehousePage: FC<WarehousePageProps> = ({}) => {
  return (
    <AdminLayout>
      <div className="container">WarehousePage</div>
    </AdminLayout>
  );
};
export default WarehousePage;
