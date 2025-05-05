import {
    Tabs
  } from "flowbite-react";
  import { useContext, useEffect, useState, type FC } from "react";
  import AdminLayout from "../components/layouts/admin";
  import { LoadingContext } from "../contexts/LoadingContext";
  import { SearchContext } from "../contexts/SearchContext";
  import { ContactModel } from "../models/contact";
  import { PurchaseModel } from "../models/purchase";
  import { PaginationResponse } from "../objects/pagination";
  import { getContacts } from "../services/api/contactApi";
  
  import toast from "react-hot-toast";
  import { BsCart2 } from "react-icons/bs";
  import { PiQuotes } from "react-icons/pi";
  import { TbFileInvoice, TbTruckDelivery, TbTruckReturn } from "react-icons/tb";
  import { useNavigate } from "react-router-dom";
  import PurchaseTable from "../components/PurchaseTable";
  import { createPurchase } from "../services/api/purchaseApi";
import ReturnPurchaseTable from "../components/ReturnPurchaseTable";
import { useTranslation } from "react-i18next";
  interface PurchasePageProps {}
  
  const PurchasePage: FC<PurchasePageProps> = ({}) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState(0);
    const { search, setSearch } = useContext(SearchContext);
    const [showModal, setShowModal] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { loading, setLoading } = useContext(LoadingContext);
    const [purchase, setPurchase] = useState<PurchaseModel[]>([]);
    const [page, setPage] = useState(1);
    const [size, setsize] = useState(1000);
    const [pagination, setPagination] = useState<PaginationResponse>();
    const [date, setDate] = useState<Date>(new Date());
    const [purchaseNumber, setPurchaseNumber] = useState<string>("");
    const [notes, setNotes] = useState<string>("");
    const [contacts, setContacts] = useState<ContactModel[]>([]);
    const [tempContact, setTempContact] = useState<ContactModel>();
    const nav = useNavigate();
    const [purchaseType, setPurchaseType] = useState<{
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
        if (!purchaseNumber) {
          toast.error("Purchase number is required");
          return;
        }
        setLoading(true);
        let resp : any = await createPurchase({
          purchase_number: purchaseNumber,
          type: purchaseType?.value,
          notes,
          contact_id: selectedContact?.value,
          purchase_date: date.toISOString(),
        });
        toast.success("Contact created successfully");
        setShowModal(false);
        // getAllContacts("");
        nav(`/purchase/${resp.data.id}`);
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
              title={t("purchase")}
              icon={TbFileInvoice}
            >
              <PurchaseTable title={t("purchase")} docType="BILL" />
            </Tabs.Item>
            <Tabs.Item
              active={activeTab === 1}
              title={t("purchase_order")}
              icon={TbTruckDelivery}
            >
              <PurchaseTable title={t("purchase_order")} docType="PURCHASE_ORDER" />
            </Tabs.Item>
            <Tabs.Item
              active={activeTab === 2}
              title={t("purchase_return")}
              icon={TbTruckReturn}
            >
              <ReturnPurchaseTable />
            </Tabs.Item>
        
          </Tabs>
        </div>
       
      </AdminLayout>
    );
  };
  export default PurchasePage;
  