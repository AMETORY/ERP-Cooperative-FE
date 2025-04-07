import {
  Badge,
  Button,
  Datepicker,
  Label,
  Modal,
  Table,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useContext, useEffect, useState, type FC } from "react";
import { LuFilter } from "react-icons/lu";
import { SearchContext } from "../contexts/SearchContext";
import { LoadingContext } from "../contexts/LoadingContext";
import { ContactModel } from "../models/contact";
import { SalesModel } from "../models/sales";
import { PaginationResponse } from "../objects/pagination";
import { salesTypes } from "../utils/constants";
import { createContact, getContacts } from "../services/api/contactApi";
import toast from "react-hot-toast";
import { createSales, deleteSales, getSales } from "../services/api/salesApi";
import { useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import Select, { InputActionMeta } from "react-select";
import ModalContact from "./ModalContact";
import { getPagination, money } from "../utils/helper";
import Moment from "react-moment";
import ModalSales from "./ModalSales";
import { isEditable } from "@testing-library/user-event/dist/utils";

interface SalesTableProps {
  docType: string;
  title: string;
}

const SalesTable: FC<SalesTableProps> = ({ docType, title }) => {
  const { search, setSearch } = useContext(SearchContext);
  const [showModal, setShowModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { loading, setLoading } = useContext(LoadingContext);
  const [sales, setSales] = useState<SalesModel[]>([]);
  const [page, setPage] = useState(1);
  const [size, setsize] = useState(20);
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
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      getAllSales();
    }
  }, [mounted, page, size, search]);

  const getAllSales = () => {
    setLoading(true);
    getSales({ page, size, search, doc_type: docType }).then((res: any) => {
      setLoading(false);
      setSales(res.data.items);
      setPagination(getPagination(res.data));
      
    });
  };

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
      let resp: any = await createSales({
        sales_number: salesNumber,
        type: salesType?.value,
        notes,
        contact_id: selectedContact?.value,
        sales_date: date.toISOString(),
        document_type: docType,
      });
      toast.success("sales created successfully");
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
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold ">{title}</h1>
        <div className="flex items-center gap-2">
          {docType != "DELIVERY" && (
            <Button
              gradientDuoTone="purpleToBlue"
              pill
              onClick={() => {
                setShowModal(true);
              }}
            >
              + {title}
            </Button>
          )}
          <LuFilter
            className=" cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => {}}
          />
        </div>
      </div>
      <Table>
        <Table.Head>
          <Table.HeadCell>Date</Table.HeadCell>
          <Table.HeadCell>Sales Number</Table.HeadCell>
          <Table.HeadCell>Contact</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Total</Table.HeadCell>
          <Table.HeadCell>Balance</Table.HeadCell>
          <Table.HeadCell></Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {sales.length === 0 && (
            <Table.Row>
              <Table.Cell colSpan={6}>
                <p className="text-gray-400 text-center">No sales found</p>
              </Table.Cell>
            </Table.Row>
          )}
          {sales.map((sale) => (
            <Table.Row key={sale.id}>
              <Table.Cell>
                <Moment format="DD/MM/YYYY">{sale.sales_date}</Moment>
              </Table.Cell>
              <Table.Cell>{sale.sales_number}</Table.Cell>
              <Table.Cell>{sale.contact_data_parsed?.name}</Table.Cell>
              <Table.Cell>{sale.status}</Table.Cell>
              <Table.Cell>{money(sale.total)}</Table.Cell>
              <Table.Cell>
                <div className="w-fit">
                  {(sale.total ?? 0) - (sale.paid ?? 0) > 0 ? (
                    money((sale.total ?? 0) - (sale.paid ?? 0))
                  ) : (
                    <Badge color="green">PAID</Badge>
                  )}
                </div>
              </Table.Cell>
              <Table.Cell>
                <a
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer"
                  onClick={() => {
                    nav(`/sales/${sale.id}`);
                  }}
                >
                  View
                </a>
                <a
                  className="font-medium text-red-600 hover:underline dark:text-red-500 ms-2 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    if (
                      window.confirm(
                        `Are you sure you want to delete  ${sale.sales_number}?`
                      )
                    ) {
                      deleteSales(sale!.id!).then(() => {
                        getAllSales();
                      });
                    }
                  }}
                >
                  Delete
                </a>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Create {title}</Modal.Header>
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
                <Label htmlFor="sales-number">{title} Number</Label>
                <TextInput
                  id="sales-number"
                  type="text"
                  placeholder={`${title} Number`}
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
    </div>
  );
};
export default SalesTable;
