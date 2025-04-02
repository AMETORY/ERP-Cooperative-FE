import { Button, Pagination, Table } from "flowbite-react";
import { useContext, useEffect, useState, type FC } from "react";
import { LuFilter } from "react-icons/lu";
import ModalPriceCategory from "./ModalPriceCategory";
import { LoadingContext } from "../contexts/LoadingContext";
import { PriceCategoryModel } from "../models/price_category";
import { PaginationResponse } from "../objects/pagination";
import { getCategories } from "../services/api/companyApi";
import {
  deletePriceCategory,
  getPriceCategories,
} from "../services/api/priceCategoryApi";
import { SearchContext } from "../contexts/SearchContext";
import { getPagination } from "../utils/helper";

interface PriceCategoryTableProps {}

const PriceCategoryTable: FC<PriceCategoryTableProps> = ({}) => {
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { loading, setLoading } = useContext(LoadingContext);
  const { search, setSearch } = useContext(SearchContext);
  const [priceCategories, setPriceCategories] = useState<PriceCategoryModel[]>(
    []
  );
  const [category, setCategory] = useState<PriceCategoryModel>();
  const [page, setPage] = useState(1);
  const [size, setsize] = useState(20);
  const [pagination, setPagination] = useState<PaginationResponse>();

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (mounted) {
      getAllCategories();
    }
  }, [mounted, page, size, search]);

  const getAllCategories = () => {
    getPriceCategories({ page, size, search }).then((res: any) => {
      setPriceCategories(res.data.items);
      setPagination(getPagination(res.data));
    });
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold ">Price Category</h1>
        <div className="flex items-center gap-2">
          <Button
            gradientDuoTone="purpleToBlue"
            pill
            onClick={() => {
              setShowModal(true);
            }}
          >
            + Category
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
          {priceCategories.length === 0 && (
            <Table.Row>
              <Table.Cell colSpan={5} className="text-center">
                No data found.
              </Table.Cell>
            </Table.Row>
          )}
          {priceCategories.map((category) => (
            <Table.Row key={category.id}>
              <Table.Cell>{category.name}</Table.Cell>
              <Table.Cell>{category.description}</Table.Cell>
              <Table.Cell>
                <a
                  href="#"
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                  onClick={() => {
                    setCategory(category)
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
                        `Are you sure you want to delete  ${category.name}?`
                      )
                    ) {
                      deletePriceCategory(category?.id!).then(() => {
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
      {category && (
        <ModalPriceCategory
          category={category}
          setCategory={setCategory}
          show={showModal}
          setShow={setShowModal}
          onCreate={getAllCategories}
        />
      )}
    </div>
  );
};
export default PriceCategoryTable;
