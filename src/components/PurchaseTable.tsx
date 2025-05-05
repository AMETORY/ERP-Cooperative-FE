import {
  Badge,
  Button,
  Datepicker,
  Label,
  Modal,
  Pagination,
  Table,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useContext, useEffect, useState, type FC } from "react";
import { LuFilter } from "react-icons/lu";
import { SearchContext } from "../contexts/SearchContext";
import { LoadingContext } from "../contexts/LoadingContext";
import { ContactModel } from "../models/contact";
import { PurchaseModel } from "../models/purchase";
import { PaginationResponse } from "../objects/pagination";
import { purchaseTypes } from "../utils/constants";
import { createContact, getContacts } from "../services/api/contactApi";
import toast from "react-hot-toast";
import {
  createPurchase,
  deletePurchase,
  getPurchases,
} from "../services/api/purchaseApi";
import { useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import Select, { InputActionMeta } from "react-select";
import ModalContact from "./ModalContact";
import { getPagination, money } from "../utils/helper";
import Moment from "react-moment";
import { useTranslation } from "react-i18next";

interface PurchaseTableProps {
  docType: string;
  title: string;
}

const PurchaseTable: FC<PurchaseTableProps> = ({ docType, title }) => {
  const { t } = useTranslation();
  const { search, setSearch } = useContext(SearchContext);
  const [showModal, setShowModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { loading, setLoading } = useContext(LoadingContext);
  const [purchases, setPurchase] = useState<PurchaseModel[]>([]);
  const [page, setPage] = useState(1);
  const [size, setsize] = useState(20);
  const [pagination, setPagination] = useState<PaginationResponse>();
  const [date, setDate] = useState<Date>(new Date());
  const [purchasesNumber, setPurchaseNumber] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [contacts, setContacts] = useState<ContactModel[]>([]);
  const [tempContact, setTempContact] = useState<ContactModel>();

  const nav = useNavigate();

  const [purchasesTypeSelected, setPurchaseTypeSelected] = useState<{
    value: string;
    label: string;
  }>({
    value: "PURCHASE",
    label: "Purchase",
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
      getAllPurchase();
    }
  }, [mounted, page, size, search]);

  const getAllPurchase = () => {
    setLoading(true);
    getPurchases({ page, size, search, doc_type: docType })
      .then((res: any) => {
        setLoading(false);
        setPurchase(res.data.items);
        setPagination(getPagination(res.data));
      })
      .finally(() => {
        setLoading(false);
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
      is_vendor: true,
      is_supplier: true,
    });
    setContacts(res.data.items);
  };

  const saveInvoice = async () => {
    try {
      if (!selectedContact) {
        toast.error("Contact is required");
        return;
      }
      
      setLoading(true);
      let resp: any = await createPurchase({
        purchase_number: purchasesNumber,
        type: purchasesTypeSelected?.value,
        notes,
        contact_id: selectedContact?.value,
        purchase_date: date.toISOString(),
        document_type: docType,
      });
      toast.success("purchases created successfully");
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
      <div className="overflow-x-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell>{t("date")}</Table.HeadCell>
            <Table.HeadCell>No.</Table.HeadCell>
            <Table.HeadCell>{t("contact")}</Table.HeadCell>
            <Table.HeadCell>{t("status")}</Table.HeadCell>
            <Table.HeadCell>{t("total")}</Table.HeadCell>
            <Table.HeadCell>{t("balance")}</Table.HeadCell>
            <Table.HeadCell></Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {purchases.length === 0 && (
              <Table.Row>
                <Table.Cell colSpan={6}>
                  <p className="text-gray-400 text-center">
                    No purchases found
                  </p>
                </Table.Cell>
              </Table.Row>
            )}
            {purchases.map((purchase) => (
              <Table.Row key={purchase.id}>
                <Table.Cell>
                  <Moment format="DD/MM/YYYY">{purchase.purchase_date}</Moment>
                </Table.Cell>
                <Table.Cell>{purchase.purchase_number}</Table.Cell>
                <Table.Cell>{purchase.contact_data_parsed?.name}</Table.Cell>
                <Table.Cell>{purchase.status}</Table.Cell>
                <Table.Cell>{money(purchase.total)}</Table.Cell>
                <Table.Cell>
                  <div className="w-fit">
                    {(purchase?.total ?? 0) - (purchase?.paid ?? 0) > 0 ? (
                      money((purchase?.total ?? 0) - (purchase?.paid ?? 0))
                    ) : (
                      <Badge color="green">PAID</Badge>
                    )}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <a
                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer"
                    onClick={() => {
                      nav(`/purchase/${purchase.id}`);
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
                          `Are you sure you want to delete  ${purchase.purchase_number}?`
                        )
                      ) {
                        deletePurchase(purchase!.id!).then(() => {
                          getAllPurchase();
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
        <Pagination
          className="mt-4"
          currentPage={page}
          totalPages={pagination?.total_pages ?? 0}
          onPageChange={(val) => {
            setPage(val);
          }}
          showIcons
        />
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Create {title}</Modal.Header>
        <Modal.Body>
          <form>
            <div className=" space-y-6">
              <div className="space-y-2">
                <Label htmlFor="date">{t("date")}</Label>
                <Datepicker
                  id="date"
                  value={date}
                  onChange={(val) => setDate(val!)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchases-number">No.</Label>
                <TextInput
                  id="purchases-number"
                  type="text"
                  placeholder={`No.`}
                  required={true}
                  value={purchasesNumber}
                  onChange={(e) => setPurchaseNumber(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="date">{t("purchase_type")}</Label>
                <Select
                  id="purchases-type"
                  value={purchasesTypeSelected}
                  options={purchaseTypes}
                  onChange={(e) => setPurchaseTypeSelected(e!)}
                />
              </div>
              <div>
                <Label htmlFor="contact">{t("contact")}</Label>
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
                <Label htmlFor="notes">{t("notes")}</Label>
                <Textarea
                  rows={7}
                  id="notes"
                  placeholder={t("description")}
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
            {t("create")}
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
export default PurchaseTable;
