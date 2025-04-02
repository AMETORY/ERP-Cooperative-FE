import { useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { Tabs } from "flowbite-react";
import { LuWarehouse } from "react-icons/lu";
import { RxReload } from "react-icons/rx";
import WarehouseTable from "../components/WarehouseTable";

interface WarehousePageProps {}

const WarehousePage: FC<WarehousePageProps> = ({}) => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <AdminLayout>
       <div className="w-full h-full flex flex-col gap-4 px-8">
        <Tabs
          aria-label="Default tabs"
          variant="default"
          onActiveTabChange={(tab) => {
            setActiveTab(tab);
            // console.log(tab);
          }}
          className="mt-4"
        >
          <Tabs.Item
            active={activeTab === 0}
            title="Warehouse"
            icon={LuWarehouse}
          >
            <WarehouseTable />
          </Tabs.Item>
          <Tabs.Item
            active={activeTab === 1}
            title="Stock Movement"
            icon={RxReload}
          >
          </Tabs.Item>
         
        </Tabs>
      </div>
    </AdminLayout>
  );
};
export default WarehousePage;
