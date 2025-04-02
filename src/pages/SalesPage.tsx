import {
  Tabs
} from "flowbite-react";
import { useContext, useEffect, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { LoadingContext } from "../contexts/LoadingContext";
import { SearchContext } from "../contexts/SearchContext";
import { ContactModel } from "../models/contact";
import { SalesModel } from "../models/sales";
import { PaginationResponse } from "../objects/pagination";
import { getContacts } from "../services/api/contactApi";

import toast from "react-hot-toast";
import { BsCart2 } from "react-icons/bs";
import { PiQuotes } from "react-icons/pi";
import { TbFileInvoice, TbTruckDelivery } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import SalesTable from "../components/SalesTable";
import { createSales } from "../services/api/salesApi";
interface SalesPageProps {}

const SalesPage: FC<SalesPageProps> = ({}) => {
  const [activeTab, setActiveTab] = useState(0);
  const { search, setSearch } = useContext(SearchContext);
  const [showModal, setShowModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { loading, setLoading } = useContext(LoadingContext);
  const [sales, setSales] = useState<SalesModel[]>([]);
  const [page, setPage] = useState(1);
  const [size, setsize] = useState(1000);
  const [pagination, setPagination] = useState<PaginationResponse>();
  const [date, setDate] = useState<Date>(new Date());
  const [salesNumber, setSalesNumber] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [contacts, setContacts] = useState<ContactModel[]>([]);
  const [tempContact, setTempContact] = useState<ContactModel>();
  const nav = useNavigate();
  const [salesType, setSalesType] = useState<{
    value: string;
    label: string;
  }>({
    value: "ONLINE",
    label: "Online",
  });
  const [selectedContact, setSelectedContact] = useState<{
    value: string;
    label: string;
  }>();

  useEffect(() => {
    getAllContacts("");
  }, []);
  const getAllContacts = async (s: string) => {
    const res: any = await getContacts({
      page: 1,
      size: 10,
      search: s,
      is_customer: true,
    });
    setContacts(res.data.items);
  };

  const saveInvoice = async () => {
    try {
      if (!selectedContact) {
        toast.error("Contact is required");
        return;
      }
      if (!salesNumber) {
        toast.error("Sales number is required");
        return;
      }
      setLoading(true);
      let resp : any = await createSales({
        sales_number: salesNumber,
        type: salesType?.value,
        notes,
        contact_id: selectedContact?.value,
        sales_date: date.toISOString(),
      });
      toast.success("Contact created successfully");
      setShowModal(false);
      // getAllContacts("");
      nav(`/sales/${resp.data.id}`);
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setLoading(false);
    }
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
            title="Invoice"
            icon={TbFileInvoice}
          >
            <SalesTable title="Invoice" docType="INVOICE" />
          </Tabs.Item>
          <Tabs.Item
            active={activeTab === 1}
            title="Delivery"
            icon={TbTruckDelivery}
          >
            <SalesTable title="Delivery" docType="DELIVERY" />
          </Tabs.Item>
          <Tabs.Item active={activeTab === 2} title="Sales Order" icon={BsCart2}>
            <SalesTable title="Sales Order" docType="SALES_ORDER" />
          </Tabs.Item>
          <Tabs.Item active={activeTab === 3} title="Sales Quote" icon={PiQuotes}>
            <SalesTable title="Sales Quote" docType="SALES_QUOTE" />
          </Tabs.Item>
        </Tabs>
      </div>
     
    </AdminLayout>
  );
};
export default SalesPage;
