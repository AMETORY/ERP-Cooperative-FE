import { Button, Pagination, Table } from "flowbite-react";
import { useContext, useEffect, useState, type FC } from "react";
import { LuFilter } from "react-icons/lu";
import { LoadingContext } from "../contexts/LoadingContext";
import { SearchContext } from "../contexts/SearchContext";
import { StockMovementModel } from "../models/stock_movement";
import { PaginationResponse } from "../objects/pagination";
import {
  deleteStockMovement,
  getStockMovements,
} from "../services/api/stockMovementApi";
import { getPagination, money } from "../utils/helper";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import { TbFileInvoice, TbTruckReturn } from "react-icons/tb";
import { BsCartCheck } from "react-icons/bs";
// import ModalStockMovement from "./ModalStockMovement";
import { useTranslation } from 'react-i18next';

interface StockMovementTableProps {}

const StockMovementTable: FC<StockMovementTableProps> = ({}) => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { loading, setLoading } = useContext(LoadingContext);
  const { search, setSearch } = useContext(SearchContext);
  const [stockMovements, setStockMovements] = useState<StockMovementModel[]>(
    []
  );
  const [page, setPage] = useState(1);
  const [size, setsize] = useState(20);
  const [pagination, setPagination] = useState<PaginationResponse>();
  const [stockMovement, setStockMovement] = useState<StockMovementModel>();

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (mounted) {
      getAllCategories();
    }
  }, [mounted, page, size, search]);

  const getAllCategories = () => {
    getStockMovements({ page, size, search }).then((res: any) => {
      setStockMovements(res.data.items);
      setPagination(getPagination(res.data));
    });
  };
  return (
    <div className="">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold ">{t('stock_movements')}</h1>
        <div className="flex items-center gap-2">
          {/* <Button
            gradientDuoTone="purpleToBlue"
            pill
            onClick={() => {
              setStockMovement({
                name: "",
                description: "",
                code: "",
              });
              setShowModal(true);
            }}
          >
            + StockMovement
          </Button> */}
          <LuFilter
            className=" cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => {}}
          />
        </div>
      </div>
      <div className="h-[calc(100vh-300px)] overflow-y-auto">
        <div className="overflow-x-auto">
          <Table hoverable className=" ">
            <Table.Head>
              <Table.HeadCell>{t('date')}</Table.HeadCell>
              <Table.HeadCell>{t('description')}</Table.HeadCell>
              <Table.HeadCell>{t('product')}</Table.HeadCell>
              <Table.HeadCell>{t('movement')}</Table.HeadCell>
              <Table.HeadCell>{t('warehouse')}</Table.HeadCell>
              <Table.HeadCell>{t('type')}</Table.HeadCell>
              <Table.HeadCell>{t('ref')}</Table.HeadCell>
              {/* <Table.HeadCell></Table.HeadCell> */}
            </Table.Head>
            <Table.Body>
              {stockMovements.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={5} className="text-center">
                    No data found.
                  </Table.Cell>
                </Table.Row>
              )}
              {stockMovements.map((stockMovement) => (
                <Table.Row key={stockMovement.id}>
                  <Table.Cell>
                    <Moment format="DD MMM YYYY">{stockMovement.date}</Moment>
                  </Table.Cell>
                  <Table.Cell>{stockMovement.description}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/product/${stockMovement.product_id}`}>
                      {stockMovement.product?.display_name}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    {money(stockMovement.quantity)} {stockMovement.unit?.name}
                  </Table.Cell>
                  <Table.Cell>{stockMovement.warehouse?.name}</Table.Cell>
                  <Table.Cell>{stockMovement.type}</Table.Cell>
                  <Table.Cell>
                    {stockMovement.sales_ref && (
                      <Link
                        to={`/sales/${stockMovement.sales_ref?.id}`}
                        className="flex gap-1 items-center"
                      >
                        <TbFileInvoice />{" "}
                        {stockMovement.sales_ref?.sales_number}
                      </Link>
                    )}
                    {stockMovement.purchase_ref && (
                      <Link
                        to={`/purchase/${stockMovement.purchase_ref?.id}`}
                        className="flex gap-1 items-center"
                      >
                        <BsCartCheck />{" "}
                        {stockMovement.purchase_ref?.purchase_number}
                      </Link>
                    )}
                    {stockMovement.return_ref && (
                      <Link
                        to={`/purchase-return/${stockMovement.return_ref?.id}`}
                        className="flex gap-1 items-center"
                      >
                        <TbTruckReturn />{" "}
                        {stockMovement.return_ref?.return_number}
                      </Link>
                    )}
                    {stockMovement.stock_opname_ref && (
                      <Link
                        to={`/stock-opname/${stockMovement.stock_opname_ref?.id}`}
                        className="flex gap-1 items-center"
                      >
                        <img
                          src="/icon/stock_opname.png"
                          alt=""
                          className="w-3"
                        />{" "}
                        {stockMovement.stock_opname_ref?.stock_opname_number}
                      </Link>
                    )}
                  </Table.Cell>

                  {/* <Table.Cell>
                  {stockMovement.company_id && (
                    <a
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer"
                      onClick={() => {
                        setStockMovement(stockMovement);
                        setShowModal(true);
                      }}
                    >
                      Edit
                    </a>
                  )}
                  {stockMovement.company_id && (
                    <a
                      className="font-medium text-red-600 hover:underline dark:text-red-500 ms-2 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        if (
                          window.confirm(
                            `Are you sure you want to delete  ${stockMovement.description}?`
                          )
                        ) {
                          deleteStockMovement(stockMovement?.id!).then(() => {
                            getAllCategories();
                          });
                        }
                      }}
                    >
                      Delete
                    </a>
                  )}
                </Table.Cell> */}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
      <Pagination
        className="mt-4"
        currentPage={page}
        totalPages={pagination?.total_pages ?? 0}
        onPageChange={(val) => {
          setPage(val);
        }}
        showIcons
      />
      {/* {stockMovement && (
        <ModalStockMovement
          show={showModal}
          setShow={setShowModal}
          onCreate={getAllCategories}
          stockMovement={stockMovement!}
          setStockMovement={setStockMovement}
        />
      )} */}
    </div>
  );
};
export default StockMovementTable;
