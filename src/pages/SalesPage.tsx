import { useContext, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { Button, Table } from "flowbite-react";
import { LuFilter } from "react-icons/lu";
import { SearchContext } from "../contexts/SearchContext";
import { LoadingContext } from "../contexts/LoadingContext";
import { PaginationResponse } from "../objects/pagination";
import { AccountModel } from "../models/account";
import { SalesModel } from "../models/sales";

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
    </AdminLayout>
  );
};
export default SalesPage;
