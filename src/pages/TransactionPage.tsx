import {
  Button,
  Tabs
} from "flowbite-react";
import { useContext, useEffect, useState, type FC } from "react";
import { BsReceipt } from "react-icons/bs";
import { LuFolderInput, LuFolderOutput } from "react-icons/lu";
import { MdPayment } from "react-icons/md";
import { PiMoney } from "react-icons/pi";
import { TbTransfer } from "react-icons/tb";
import AdminLayout from "../components/layouts/admin";
import TransactionTable from "../components/TransactionTable";
import { LoadingContext } from "../contexts/LoadingContext";
import { useTranslation } from "react-i18next";
interface TransactionPageProps {}

const TransactionPage: FC<TransactionPageProps> = ({}) => {
    const { t, i18n } = useTranslation();
  
  const { loading, setLoading } = useContext(LoadingContext);
  const [activeTab, setActiveTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

 

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
            title={t("revenue")}
            icon={LuFolderInput}
          >
            <TransactionTable transactionType="REVENUE" />
          </Tabs.Item>
          <Tabs.Item
            active={activeTab === 1}
            title={t("expense")}
            icon={LuFolderOutput}
          >
            <TransactionTable transactionType="EXPENSE" />
          </Tabs.Item>
          <Tabs.Item active={activeTab === 2} title={t("equity")} icon={PiMoney}>
            <TransactionTable transactionType="EQUITY" />
          </Tabs.Item>
          <Tabs.Item active={activeTab === 3} title={t("transfer")} icon={TbTransfer}>
            <TransactionTable transactionType="TRANSFER" />
          </Tabs.Item>
          <Tabs.Item active={activeTab === 4} title={t("payable")} icon={MdPayment}>
            <TransactionTable disableCreate transactionType="PAYABLE" />
          </Tabs.Item>
          <Tabs.Item active={activeTab === 4} title={t("receivable")} icon={BsReceipt}>
            <TransactionTable disableCreate transactionType="RECEIVABLE" />
          </Tabs.Item>
        </Tabs>
      </div>
    </AdminLayout>
  );
};
export default TransactionPage;
