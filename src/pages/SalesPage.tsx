import { useContext, useEffect, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import {
  Button,
  Datepicker,
  Label,
  Modal,
  Table,
  Textarea,
  TextInput,
} from "flowbite-react";
import { LuFilter } from "react-icons/lu";
import { SearchContext } from "../contexts/SearchContext";
import { LoadingContext } from "../contexts/LoadingContext";
import { PaginationResponse } from "../objects/pagination";
import { AccountModel } from "../models/account";
import { SalesModel } from "../models/sales";
import Select, { InputActionMeta } from "react-select";
import { salesTypes } from "../utils/constants";
import { ContactModel } from "../models/contact";
import { createContact, getContacts } from "../services/api/contactApi";

import CreatableSelect from "react-select/creatable";
import ModalContact from "../components/ModalContact";
import toast from "react-hot-toast";
import { createSales } from "../services/api/salesApi";
import { useNavigate } from "react-router-dom";
interface SalesPageProps {}

const SalesPage: FC<SalesPageProps> = ({}) => {
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
    value: "INVOICE",
    label: "Invoice",
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
      <div className="p-8 ">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold ">Sales</h1>
          <div className="flex items-center gap-2">
            <Button
              gradientDuoTone="purpleToBlue"
              pill
              onClick={() => {
                setShowModal(true);
              }}
            >
              + Create new sales
            </Button>
            <LuFilter
              className=" cursor-pointer text-gray-400 hover:text-gray-600"
              onClick={() => {
                setShowFilter(true);
              }}
            />
          </div>
        </div>
        <div className="h-[calc(100vh-200px)] overflow-y-auto p-1">
          {/* <Table className=" rounded-lg shadow-sm "></Table> */}
        </div>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Create Sales</Modal.Header>
        <Modal.Body>
          <form>
            <div className=" space-y-6">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Datepicker
                  id="date"
                  value={date}
                  onChange={(val) => setDate(val!)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sales-number">Sales Number</Label>
                <TextInput
                  id="sales-number"
                  type="text"
                  placeholder="Sales Number"
                  required={true}
                  value={salesNumber}
                  onChange={(e) => setSalesNumber(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="date">Sales Type</Label>
                <Select
                  id="sales-type"
                  value={salesType}
                  options={salesTypes}
                  onChange={(e) => setSalesType(e!)}
                />
              </div>
              <div>
                <Label htmlFor="contact">Contact</Label>
                <CreatableSelect
                  id="contact"
                  value={selectedContact}
                  options={contacts.map((c) => ({
                    label: c.name!,
                    value: c.id!,
                  }))}
                  onChange={(e) => setSelectedContact(e!)}
                  isSearchable
                  onCreateOption={(e) => {
                    setTempContact({
                      name: e!,
                      is_customer: true,
                      is_supplier: false,
                      is_vendor: false,
                    });
                  }}
                  onInputChange={(e) => {
                    if (e) {
                      getAllContacts(e);
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  rows={7}
                  id="notes"
                  placeholder="Description"
                  required={true}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
            <div className="h-32"></div>
          </form>
        </Modal.Body>
        <Modal.Footer className="flex justify-end">
          <Button type="submit" onClick={saveInvoice}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
      {tempContact && (
        <ModalContact
          showModal={showModal}
          setShowModal={setShowModal}
          selectedContact={tempContact}
          setSelectedContact={(val) => {
            setTempContact(val);
          }}
          handleCreateContact={async () => {
            try {
              if (!tempContact) return;
              setLoading(true);

              let resp: any = await createContact(tempContact);
              toast.success("Contact created successfully");
              setSelectedContact({
                label: resp.data.name,
                value: resp.data.id,
              });
              getAllContacts("");
              setTempContact(undefined);
            } catch (error) {
              toast.error(`${error}`);
            } finally {
              setLoading(false);
            }
          }}
        />
      )}
    </AdminLayout>
  );
};
export default SalesPage;
