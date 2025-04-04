import { useContext, useEffect, useRef, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import {
  Button,
  Datepicker,
  Label,
  Modal,
  Tabs,
  Textarea,
  TextInput,
} from "flowbite-react";
import { BsInfoCircle, BsPaypal, BsReceipt } from "react-icons/bs";
import { LuFolderOutput, LuFolderInput, LuFilter } from "react-icons/lu";
import { AccountModel } from "../models/account";
import { getAccounts } from "../services/api/accountApi";
import Select, { InputActionMeta } from "react-select";
import toast from "react-hot-toast";
import { LoadingContext } from "../contexts/LoadingContext";
import {
  createTransaction,
  getTransactions,
} from "../services/api/transactionApi";
import { PaginationResponse } from "../objects/pagination";
import { SearchContext } from "../contexts/SearchContext";
import TransactionTable from "../components/TransactionTable";
import { PiMoney } from "react-icons/pi";
import { TbTransfer } from "react-icons/tb";
import { MdPayment } from "react-icons/md";
interface TransactionPageProps {}

const TransactionPage: FC<TransactionPageProps> = ({}) => {
  const { loading, setLoading } = useContext(LoadingContext);
  const [activeTab, setActiveTab] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  //   useEffect(() => {
  //     if (mounted) {
  //       getAllTransactions("REVENUE");
  //     }
  //   }, [mounted, page, size, search]);

  const renderHeader = (label: string, onAdd: () => void) => {
    return (
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold ">{label}</h1>
        <div className="flex items-center gap-2">
          <Button gradientDuoTone="purpleToBlue" pill onClick={onAdd}>
            + {label}
          </Button>
          {/* <LuFilter
                      className=" cursor-pointer text-gray-400 hover:text-gray-600"
                      onClick={() => {
                        setShowFilter(true);
                      }}
                    /> */}
        </div>
      </div>
    );
  };

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
            title="Revenue"
            icon={LuFolderInput}
          >
            <TransactionTable transactionType="REVENUE" />
          </Tabs.Item>
          <Tabs.Item
            active={activeTab === 1}
            title="Expense"
            icon={LuFolderOutput}
          >
            <TransactionTable transactionType="EXPENSE" />
          </Tabs.Item>
          <Tabs.Item active={activeTab === 2} title="Equity" icon={PiMoney}>
            <TransactionTable transactionType="EQUITY" />
          </Tabs.Item>
          <Tabs.Item active={activeTab === 3} title="Transfer" icon={TbTransfer}>
            <TransactionTable transactionType="TRANSFER" />
          </Tabs.Item>
          <Tabs.Item active={activeTab === 4} title="Payable" icon={MdPayment}>
            <TransactionTable transactionType="PAYABLE" />
          </Tabs.Item>
          <Tabs.Item active={activeTab === 4} title="Receivable" icon={BsReceipt}>
            <TransactionTable transactionType="RECEIVABLE" />
          </Tabs.Item>
        </Tabs>
      </div>
    </AdminLayout>
  );
};
export default TransactionPage;
