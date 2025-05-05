import { Button, Pagination, Table } from "flowbite-react";
import { useContext, useEffect, useState, type FC } from "react";
import { LuFilter } from "react-icons/lu";
import { ProductModel } from "../models/product";
import ModalProduct from "./ModalProduct";
import { LoadingContext } from "../contexts/LoadingContext";
import { SearchContext } from "../contexts/SearchContext";
import { PaginationResponse } from "../objects/pagination";
import { deleteProduct, getProducts } from "../services/api/productApi";
import { getPagination, money } from "../utils/helper";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
interface ProductTableProps {}

const ProductTable: FC<ProductTableProps> = ({}) => {

  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [product, setProduct] = useState<ProductModel>();
  const [mounted, setMounted] = useState(false);
  const { loading, setLoading } = useContext(LoadingContext);
  const { search, setSearch } = useContext(SearchContext);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [page, setPage] = useState(1);
  const [size, setsize] = useState(20);
  const [pagination, setPagination] = useState<PaginationResponse>();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (mounted) {
      getAllProducts();
    }
  }, [mounted, page, size, search]);

  const getAllProducts = () => {
    getProducts({ page, size, search }).then((res: any) => {
      setProducts(res.data.items);
      setPagination(getPagination(res.data));
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold ">{t("product")}</h1>
        <div className="flex items-center gap-2">
          <Button
            gradientDuoTone="purpleToBlue"
            pill
            onClick={() => {
              setShowModal(true);
            }}
          >
            + {t("product")}
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
          <Table.HeadCell>{t("stock")}</Table.HeadCell>
          <Table.HeadCell></Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {products.length === 0 && (
            <Table.Row>
              <Table.Cell colSpan={5} className="text-center">
                {t("no_data_found")}
              </Table.Cell>
            </Table.Row>
          )}
          {products.map((product) => (
            <Table.Row key={product.id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell>{product.name}</Table.Cell>
              <Table.Cell>{product.description}</Table.Cell>
              <Table.Cell>{money(product.total_stock)} {product?.default_unit?.code}</Table.Cell>
              <Table.Cell>
                <a
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer"
                  onClick={() => {
                    navigate(`/product/${product.id}`);
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
                        `Are you sure you want to delete  ${product.name}?`
                      )
                    ) {
                      deleteProduct(product?.id!).then(() => {
                        getAllProducts();
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
      <ModalProduct
        product={product}
        setProduct={setProduct}
        onCreateProduct={(val) => {
          getAllProducts()
        }}
        show={showModal}
        setShow={setShowModal}
      />
    </div>
  );
};
export default ProductTable;
