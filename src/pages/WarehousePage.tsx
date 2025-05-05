import { useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { Tabs } from "flowbite-react";
import { LuWarehouse } from "react-icons/lu";
import { RxReload } from "react-icons/rx";
import WarehouseTable from "../components/WarehouseTable";
import StockMovementTable from "../components/StockMovementTable";
import StockOpnameTable from "../components/StockOpnameTable";
import { useTranslation } from 'react-i18next';

interface WarehousePageProps {}

const WarehousePage: FC<WarehousePageProps> = ({}) => {
  const { t } = useTranslation();
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
            title={t("warehouse")}
            icon={LuWarehouse}
          >
            <WarehouseTable />
          </Tabs.Item>
          <Tabs.Item
            active={activeTab === 1}
            title={t("stock_movements")}
            icon={RxReload}
          >
            <StockMovementTable />
          </Tabs.Item>
          <Tabs.Item
            active={activeTab === 2}
            title={
              <div className="flex gap-2 items-center">
                <img src="/icon/stock_opname.png" alt="" className="w-4" />
                <span>{t("stock_opname")}</span>
              </div>
            }
          >
            <StockOpnameTable />
          </Tabs.Item>
        </Tabs>
      </div>
    </AdminLayout>
  );
};
export default WarehousePage;
