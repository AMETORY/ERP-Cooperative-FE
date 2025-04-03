import { Button, Pagination, Table } from "flowbite-react";
import { useContext, useEffect, useState, type FC } from "react";
import { LuFilter } from "react-icons/lu";
import { ProductModel } from "../models/product";
import ModalProduct from "./ModalProduct";
import { LoadingContext } from "../contexts/LoadingContext";
import { SearchContext } from "../contexts/SearchContext";
import { PaginationResponse } from "../objects/pagination";
import { deleteProduct, getProducts } from "../services/api/productApi";
import { getPagination } from "../utils/helper";
import { useNavigate } from "react-router-dom";

interface ProductTableProps {}

const ProductTable: FC<ProductTableProps> = ({}) => {
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
      getAllCategories();
    }
  }, [mounted, page, size, search]);

  const getAllCategories = () => {
    getProducts({ page, size, search }).then((res: any) => {
      setProducts(res.data.items);
      setPagination(getPagination(res.data));
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold ">Product</h1>
        <div className="flex items-center gap-2">
          <Button
            gradientDuoTone="purpleToBlue"
            pill
            onClick={() => {
              setShowModal(true);
            }}
          >
            + Product
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
          {products.length === 0 && (
            <Table.Row>
              <Table.Cell colSpan={5} className="text-center">
                No data found.
              </Table.Cell>
            </Table.Row>
          )}
          {products.map((product) => (
            <Table.Row key={product.id}>
              <Table.Cell>{product.name}</Table.Cell>
              <Table.Cell>{product.description}</Table.Cell>
              <Table.Cell>
                <a
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer"
                  onClick={() => {
                    navigate(`/product/${product.id}`);
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
                        `Are you sure you want to delete  ${product.name}?`
                      )
                    ) {
                      deleteProduct(product?.id!).then(() => {
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
      <ModalProduct
        product={product}
        setProduct={setProduct}
        onCreateProduct={(val) => {}}
        show={showModal}
        setShow={setShowModal}
      />
    </div>
  );
};
export default ProductTable;
