import {
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
import { ReturnItemModel, ReturnModel } from "../models/return";
import { PaginationResponse } from "../objects/pagination";
import { getPagination, money } from "../utils/helper";
import {
  createPurchaseReturn,
  getPurchaseReturns,
} from "../services/api/purchaseReturnApi";
import { PurchaseModel } from "../models/purchase";
import { getPurchases } from "../services/api/purchaseApi";
import Select from "react-select";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Moment from "react-moment";
import ModalPurchaseReturn from "./ModalPurchaseReturn";

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
    <div className="h-[calc(100vh-200px)] overflow-y-auto">
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
          <Table.HeadCell>Invoice</Table.HeadCell>
          <Table.HeadCell>Supplier</Table.HeadCell>
          <Table.HeadCell>Total</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell></Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {returns.length === 0 && (
            <Table.Row>
              <Table.Cell colSpan={5} className="text-center">
                No data found.
              </Table.Cell>
            </Table.Row>
          )}
          {returns.map((item: ReturnModel) => (
            <Table.Row
              key={item.id}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                <Moment format="DD-MM-YYYY">{item?.date}</Moment>
              </Table.Cell>
              <Table.Cell>{item?.purchase_ref?.purchase_number}</Table.Cell>
              <Table.Cell>
                {item?.purchase_ref?.contact_data_parsed?.name}
              </Table.Cell>
              <Table.Cell>
                {money(
                  item?.items?.reduce((acc, item) => acc + item.total!, 0)
                )}
              </Table.Cell>
              <Table.Cell>{item.status}</Table.Cell>
              <Table.Cell>
                <a
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer"
                  onClick={() => {
                    nav(`/purchase-return/${item.id}`);
                  }}
                >
                  View
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
      <ModalPurchaseReturn
        show={showModal}
        onClose={() => setShowModal(false)}
        purchases={purchases}
        purchase={selectedPurchase}
        onInputChange={getAllPurchases}
        onSuccess={(val) => {
          nav(`/purchase-return/${val.id}`);
        }}
        setPurchase={(val) => {
          setSelectedPurchase(val);
        }}
      />
    </div>
  );
};
export default ReturnPurchaseTable;
