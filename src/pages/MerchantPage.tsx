import { Tabs } from "flowbite-react";
import { useState, type FC } from "react";
import { useTranslation } from "react-i18next";
import { BsShop } from "react-icons/bs";
import AdminLayout from "../components/layouts/admin";
import MerchantTable from "../components/MerchantTable";

interface MerchantPageProps {}

const MerchantPage: FC<MerchantPageProps> = ({}) => {
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
            title={t("merchant")}
            icon={BsShop}
          >
            <MerchantTable />
          </Tabs.Item>
        </Tabs>
      </div>
    </AdminLayout>
  );
};
export default MerchantPage;
