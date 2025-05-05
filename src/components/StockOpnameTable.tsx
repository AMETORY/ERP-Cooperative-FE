import {
  Button,
  Datepicker,
  Label,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useContext, useEffect, useState, type FC } from "react";
import { WarehouseModel } from "../models/warehouse";
import { createWarehouse, getWarehouses } from "../services/api/warehouseApi";
import Select from "react-select";
import toast from "react-hot-toast";
import { LoadingContext } from "../contexts/LoadingContext";
import { useNavigate } from "react-router-dom";
import {
  createStockOpname,
  deleteStockOpname,
  getStockOpnames,
} from "../services/api/stockOpnameApi";
import { PaginationResponse } from "../objects/pagination";
import { StockOpnameModel } from "../models/stock_opname";
import { getPagination } from "../utils/helper";
import { SearchContext } from "../contexts/SearchContext";
import Moment from "react-moment";
import { useTranslation } from 'react-i18next';

interface StockOpnameTableProps {}

const StockOpnameTable: FC<StockOpnameTableProps> = ({}) => {
  const { t } = useTranslation();
  const { loading, setLoading } = useContext(LoadingContext);
  const { search, setSearch } = useContext(SearchContext);
  const [mounted, setMounted] = useState(false);
  const [date, setDate] = useState(new Date());
  const [page, setPage] = useState(1);
  const [size, setsize] = useState(20);
  const [pagination, setPagination] = useState<PaginationResponse>();
  const [notes, setNotes] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseModel>();
  const nav = useNavigate();
  const [stockOpnames, setStockOpnames] = useState<StockOpnameModel[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseModel[]>([]);
  useEffect(() => {
    setMounted(true);
  }, []);
  const getAllWarehouses = () => {
    getWarehouses({ page: 1, size: 100, search: "" }).then((res: any) => {
      setWarehouses(res.data.items);
    });
  };
  useEffect(() => {
    getAllWarehouses();
  }, []);

  useEffect(() => {
    if (mounted) {
      getAllStockOpnames();
    }
  }, [mounted, page, size, search]);
  const getAllStockOpnames = () => {
    setLoading(true);
    getStockOpnames({ page, size, search: "" })
      .then((res: any) => {
        setPagination(getPagination(res.data));
        setStockOpnames(res.data.items);
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <>
      <div className="">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold ">{t('stock_opname')}</h1>
          <div className="flex items-center gap-2">
            <Button
              gradientDuoTone="purpleToBlue"
              pill
              onClick={() => {
                setShowModal(true);
              }}
            >
              + {t('stock_opname')}
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table striped className="">
            <TableHead>
              <TableHeadCell>{t('date')}</TableHeadCell>
              <TableHeadCell>{t('number')}</TableHeadCell>
              <TableHeadCell>{t('notes')}</TableHeadCell>
              <TableHeadCell className="text-right w-32"></TableHeadCell>
            </TableHead>
            <TableBody>
              {stockOpnames.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No data available
                  </TableCell>
                </TableRow>
              )}
              {stockOpnames.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>
                    <Moment format="DD-MM-YYYY">{item.opname_date}</Moment>
                  </TableCell>
                  <TableCell>{item.stock_opname_number}</TableCell>
                  <TableCell>{item.notes}</TableCell>
                  <TableCell>
                  <a
                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer"
                    onClick={() => {
                      nav(`/stock-opname/${item.id}`);
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
                          `Are you sure you want to delete  ${item.stock_opname_number}?`
                        )
                      ) {
                        deleteStockOpname(item?.id!).then(() => {
                          getAllStockOpnames();
                        });
                      }
                    }}
                  >
                    Delete
                  </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Stock Opname</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div className="mb-2 block">
              <Label htmlFor="name" value="Date" />
              <Datepicker
                id="name"
                placeholder="Date"
                required
                value={date}
                onChange={(val) => setDate(val!)}
              />
            </div>

            <div className="mb-2 block">
              <Label htmlFor="warehouseId" value="Warehouse" />
              <Select
                options={warehouses.map((e) => ({
                  value: e.id,
                  label: e.name,
                }))}
                value={{
                  value: selectedWarehouse?.id,
                  label: selectedWarehouse?.name,
                }}
                onChange={(val) => {
                  let selected = warehouses.find((e) => e.id == val?.value);
                  setSelectedWarehouse(selected);
                }}
              />
            </div>
            <div className="mb-2 block">
              <Label htmlFor="notes" value="Notes" />
              <Textarea
                id="notes"
                placeholder="Notes"
                required={true}
                className="input-white"
                value={notes}
                onChange={(val) => setNotes(val.target.value)}
              />
            </div>
            <div className=" p-16"></div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex w-full justify-end">
            <Button
              onClick={async () => {
                try {
                  if (!selectedWarehouse) {
                    toast.error("Warehouse is required");
                    return;
                  }
                  if (!date) {
                    toast.error("Date is required");
                    return;
                  }
                  setLoading(true);
                  let data = {
                    warehouse_id: selectedWarehouse?.id!,
                    opname_date: date,
                    stock_opname_number: `SO-${String(
                      Math.floor(Math.random() * 100000)
                    ).padStart(5, "0")}/${(new Date().getMonth() + 1)
                      .toString()
                      .padStart(2, "0")}/${new Date().getFullYear()}`,
                    notes: notes,
                  };

                  let resp: any = await createStockOpname(data);
                  nav(`/stock-opname/${resp.data.id}`);
                } catch (error) {
                  toast.error(`${error}`);
                } finally {
                  setLoading(false);
                }
              }}
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default StockOpnameTable;
