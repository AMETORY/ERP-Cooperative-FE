import { useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { Tabs } from "flowbite-react";
import { BsBank2 } from "react-icons/bs";
import { MdOutlineSavings } from "react-icons/md";

interface CooperativeActivitiesPageProps {}

const CooperativeActivitiesPage: FC<CooperativeActivitiesPageProps> = ({}) => {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <AdminLayout isCooperative>
      <div className="w-full flex flex-col gap-4 px-8">
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
            title="Loan"
            icon={BsBank2}
          ></Tabs.Item>
          <Tabs.Item
            active={activeTab === 1}
            title="Saving"
            icon={MdOutlineSavings}
          ></Tabs.Item>
        </Tabs>
      </div>
    </AdminLayout>
  );
};
export default CooperativeActivitiesPage;
