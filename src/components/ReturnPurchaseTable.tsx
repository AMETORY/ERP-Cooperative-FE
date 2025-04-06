import {
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
import { ReturnModel } from "../models/return";
import { PaginationResponse } from "../objects/pagination";
import { getPagination } from "../utils/helper";
import { createPurchaseReturn, getPurchaseReturns } from "../services/api/purchaseReturnApi";
import { PurchaseModel } from "../models/purchase";
import { getPurchases } from "../services/api/purchaseApi";
import Select from "react-select";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface ReturnPurchaseTableProps {}

const ReturnPurchaseTable: FC<ReturnPurchaseTableProps> = ({}) => {
  const { search, setSearch } = useContext(SearchContext);
  const [showModal, setShowModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { loading, setLoading } = useContext(LoadingContext);
  const [returns, setReturns] = useState<ReturnModel[]>([]);
  const [purchases, setPurchases] = useState<PurchaseModel[]>([]);
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseModel>();
  const [page, setPage] = useState(1);
  const [size, setsize] = useState(20);
  const [pagination, setPagination] = useState<PaginationResponse>();
  const [date, setDate] = useState<Date>(new Date());
  const [returnNumber, setReturnNumber] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [description, setDescription] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      getAllReturns();
      getAllPurchases("");
    }
  }, [mounted, page, size, search]);

  const getAllPurchases = (s: string) => {
    getPurchases({
      page,
      size,
      search: s,
      doc_type: "BILL",
      is_published: true,
    }).then((res: any) => {
      setPurchases(res.data.items);
    });
  };
  const getAllReturns = () => {
    setLoading(true);
    getPurchaseReturns({ page, size, search })
      .then((res: any) => {
        setLoading(false);
        setReturns(res.data.items);
        setPagination(getPagination(res.data));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold ">Purchase Return</h1>
        <div className="flex items-center gap-2">
          <Button
            gradientDuoTone="purpleToBlue"
            pill
            onClick={() => {
              setShowModal(true);
            }}
          >
            + Purchase Return
          </Button>
          <LuFilter
            className=" cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => {}}
          />
        </div>
      </div>
      <Table>
        <Table.Head>
          <Table.HeadCell>Date</Table.HeadCell>
          <Table.HeadCell>Supplier</Table.HeadCell>
          <Table.HeadCell>Total</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell></Table.HeadCell>
        </Table.Head>
        <Table.Body></Table.Body>
      </Table>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Create Purchase Return</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Datepicker
                id="date"
                name="date"
                value={date}
                onChange={(val) => setDate(val!)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="return-number">Return Number</Label>
              <TextInput
                id="return-number"
                type="text"
                placeholder={`Return Number`}
                required={true}
                value={returnNumber}
                onChange={(e) => setReturnNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="return-number">Invoice</Label>
              <Select
                options={purchases.map((p) => {
                  return {
                    value: p.id,
                    label: p.purchase_number,
                    supplier: p.contact_data_parsed?.name,
                  };
                })}
                value={{
                  value: selectedPurchase?.id,
                  label: selectedPurchase?.purchase_number,
                  supplier: selectedPurchase?.contact_data_parsed?.name,
                }}
                onChange={(option) => {
                  setSelectedPurchase(
                    purchases.find((p) => p.id === option?.value)
                  );
                }}
                formatOptionLabel={(option) => (
                  <div className="flex space-x-2 flex-row justify-between">
                    <p>{option.label}</p>
                    <p className="text-gray-400 text-sm">{option.supplier}</p>
                  </div>
                )}
                onInputChange={(e) => {
                  getAllPurchases(e);
                }}
                isSearchable
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                rows={7}
                id="description"
                placeholder="Description"
                required={true}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={async () => {
              try {
                if (!selectedPurchase) {
                  throw new Error("Please select a invoice");
                }
                let data = {
                  date,
                  ref_id: selectedPurchase?.id,
                  return_number: returnNumber,
                  notes,
                  description,
                };
                  let resp : any = await createPurchaseReturn(data);
                  nav(`/purchase-return/${resp.data.id}`);
                setLoading(true);
              } catch (error) {
                toast.error(`${error}`);
              } finally {
                setLoading(false);
              }
            }}
          >
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default ReturnPurchaseTable;
