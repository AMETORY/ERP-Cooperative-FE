import { Button, Pagination, Table } from "flowbite-react";
import { useContext, useEffect, useState, type FC } from "react";
import { useTranslation } from "react-i18next";
import { BrandModel } from "../models/brand";
import { LoadingContext } from "../contexts/LoadingContext";
import { SearchContext } from "../contexts/SearchContext";
import { PaginationResponse } from "../objects/pagination";
import { useNavigate } from "react-router-dom";
import { deleteBrand, getBrands } from "../services/api/brandApi";
import { getPagination } from "../utils/helper";
import { LuFilter } from "react-icons/lu";
import ModalBrand from "./ModalBrand";

interface BrandTableProps {}

const BrandTable: FC<BrandTableProps> = ({}) => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [brand, setBrand] = useState<BrandModel>();
  const [mounted, setMounted] = useState(false);
  const { loading, setLoading } = useContext(LoadingContext);
  const { search, setSearch } = useContext(SearchContext);
  const [brands, setBrands] = useState<BrandModel[]>([]);
  const [page, setPage] = useState(1);
  const [size, setsize] = useState(20);
  const [pagination, setPagination] = useState<PaginationResponse>();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (mounted) {
      getAllBrands();
    }
  }, [mounted, page, size, search]);

  const getAllBrands = () => {
    getBrands({ page, size, search }).then((res: any) => {
      setBrands(res.data.items);
      setPagination(getPagination(res.data));
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold ">{t("brand")}</h1>
        <div className="flex items-center gap-2">
          <Button
            gradientDuoTone="purpleToBlue"
            pill
            onClick={() => {
              setShowModal(true);
            }}
          >
            + {t("brand")}
          </Button>
          <LuFilter
            className=" cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => {}}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table striped>
          <Table.Head>
            <Table.HeadCell>{t("name")}</Table.HeadCell>
            <Table.HeadCell>{t("description")}</Table.HeadCell>
            <Table.HeadCell></Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {brands.length === 0 && (
              <Table.Row>
                <Table.Cell colSpan={5} className="text-center">
                  {t("no_data_found")}
                </Table.Cell>
              </Table.Row>
            )}
            {brands.map((brand) => (
              <Table.Row
                key={brand.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell>{brand.name}</Table.Cell>
                <Table.Cell>{brand.description}</Table.Cell>

                <Table.Cell>
                  <a
                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer"
                    onClick={() => {
                      setBrand(brand);
                      setShowModal(true);
                    }}
                  >
                    {t("view")}
                  </a>
                  <a
                    className="font-medium text-red-600 hover:underline dark:text-red-500 ms-2 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      if (
                        window.confirm(
                          `Are you sure you want to delete  ${brand.name}?`
                        )
                      ) {
                        deleteBrand(brand?.id!).then(() => {
                          getAllBrands();
                        });
                      }
                    }}
                  >
                    {t("delete")}
                  </a>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
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
      <ModalBrand
        brand={brand}
        setBrand={setBrand}
        onCreateBrand={(val) => {
          getAllBrands();
        }}
        show={showModal}
        setShow={setShowModal}
      />
    </div>
  );
};
export default BrandTable;
