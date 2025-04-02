import { Button, Pagination, Table } from "flowbite-react";
import { useContext, useEffect, useState, type FC } from "react";
import { LuFilter } from "react-icons/lu";
import ModalWarehouse from "./ModalWarehouse";
import { LoadingContext } from "../contexts/LoadingContext";
import { WarehouseModel } from "../models/warehouse";
import { PaginationResponse } from "../objects/pagination";
import { getCategories } from "../services/api/companyApi";
import { deleteWarehouse, getWarehouses } from "../services/api/warehouseApi";
import { SearchContext } from "../contexts/SearchContext";
import { getPagination } from "../utils/helper";

interface WarehouseTableProps {}

const WarehouseTable: FC<WarehouseTableProps> = ({}) => {
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { loading, setLoading } = useContext(LoadingContext);
  const { search, setSearch } = useContext(SearchContext);
  const [warehouses, setWarehouses] = useState<WarehouseModel[]>([]);
  const [page, setPage] = useState(1);
  const [size, setsize] = useState(20);
  const [pagination, setPagination] = useState<PaginationResponse>();
  const [warehouse, setWarehouse] = useState<WarehouseModel>();

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (mounted) {
      getAllCategories();
    }
  }, [mounted, page, size, search]);

  const getAllCategories = () => {
    getWarehouses({ page, size, search }).then((res: any) => {
      setWarehouses(res.data.items);
      setPagination(getPagination(res.data));
    });
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold ">Warehouse</h1>
        <div className="flex items-center gap-2">
          <Button
            gradientDuoTone="purpleToBlue"
            pill
            onClick={() => {
              setWarehouse({
                name: "",
                description: "",
                address: "",
              });
              setShowModal(true);
            }}
          >
            + Warehouse
          </Button>
          <LuFilter
            className=" cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => {}}
          />
        </div>
      </div>
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Description</Table.HeadCell>
          <Table.HeadCell></Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {warehouses.length === 0 && (
            <Table.Row>
              <Table.Cell colSpan={5} className="text-center">
                No data found.
              </Table.Cell>
            </Table.Row>
          )}
          {warehouses.map((warehouse) => (
            <Table.Row key={warehouse.id}>
              <Table.Cell>{warehouse.name}</Table.Cell>
              <Table.Cell>{warehouse.description}</Table.Cell>
              <Table.Cell>
                <a
                  href="#"
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                  onClick={() => {
                    setWarehouse(warehouse);
                    setShowModal(true);
                  }}
                >
                  Edit
                </a>
                <a
                  href="#"
                  className="font-medium text-red-600 hover:underline dark:text-red-500 ms-2"
                  onClick={(e) => {
                    e.preventDefault();
                    if (
                      window.confirm(
                        `Are you sure you want to delete  ${warehouse.name}?`
                      )
                    ) {
                      deleteWarehouse(warehouse?.id!).then(() => {
                        getAllCategories();
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
      {warehouse && (
        <ModalWarehouse
          show={showModal}
          setShow={setShowModal}
          onCreate={getAllCategories}
          warehouse={warehouse!}
          setWarehouse={setWarehouse}
        />
      )}
    </div>
  );
};
export default WarehouseTable;
