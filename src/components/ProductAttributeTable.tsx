import {
  Button,
  Label,
  Modal,
  Pagination,
  Table,
  TextInput,
} from "flowbite-react";
import { useContext, useEffect, useState, type FC } from "react";
import { LuFilter } from "react-icons/lu";
// import ModalProductAttribute from "./ModalProductAttribute";
import { useTranslation } from 'react-i18next';
import { LoadingContext } from "../contexts/LoadingContext";
import { SearchContext } from "../contexts/SearchContext";
import { ProductAttributeModel } from "../models/producy_attribute";
import { PaginationResponse } from "../objects/pagination";
import {
  createProductAttribute,
  deleteProductAttribute,
  getProductAttributes,
  updateProductAttribute,
} from "../services/api/productAttributeApi";
import { getPagination } from "../utils/helper";

interface ProductAttributeTableProps {}

const ProductAttributeTable: FC<ProductAttributeTableProps> = ({}) => {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { loading, setLoading } = useContext(LoadingContext);
  const { search, setSearch } = useContext(SearchContext);
  const [productAttributes, setProductAttributes] = useState<
    ProductAttributeModel[]
  >([]);
  const [productAttribute, setProductAttribute] =
    useState<ProductAttributeModel>();
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
    getProductAttributes({ page, size, search }).then((res: any) => {
      setProductAttributes(res.data.items);
      setPagination(getPagination(res.data));
    });
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold ">{t('product_attributes')}</h1>
        <div className="flex items-center gap-2">
          <Button
            gradientDuoTone="purpleToBlue"
            pill
            onClick={() => {
              setShowModal(true);
            }}
          >
            + Attribute
          </Button>
          <LuFilter
            className=" cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => {}}
          />
        </div>
      </div>
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>{t('name')}</Table.HeadCell>
          <Table.HeadCell>{t('description')}</Table.HeadCell>
          <Table.HeadCell></Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {productAttributes.length === 0 && (
            <Table.Row>
              <Table.Cell colSpan={5} className="text-center">
                No data found.
              </Table.Cell>
            </Table.Row>
          )}
          {productAttributes.map((category) => (
            <Table.Row key={category.id}>
              <Table.Cell>{category.name}</Table.Cell>
              <Table.Cell>
                <a
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer"
                  onClick={() => {
                    setProductAttribute(category);
                    setShowModal(true);
                  }}
                >
                  Edit
                </a>
                <a
                  className="font-medium text-red-600 hover:underline dark:text-red-500 ms-2 cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    if (
                      window.confirm(
                        `Are you sure you want to delete  ${category.name}?`
                      )
                    ) {
                      deleteProductAttribute(category?.id!).then(() => {
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
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Create Product Attribute</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div className="mb-2 block">
              <Label htmlFor="name" value="Name" />
              <TextInput
                id="name"
                type="text"
                placeholder="Name"
                required={true}
                value={productAttribute?.name}
                onChange={(e) =>
                  setProductAttribute({
                    ...productAttribute!,
                    name: e.target.value,
                  })
                }
                className="input-white"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex w-full justify-end">
          <Button
            onClick={() => {
              if (productAttribute?.id) {
                updateProductAttribute(
                  productAttribute?.id!,
                  productAttribute
                ).then(() => {
                  setShowModal(false);
                  getAllCategories();
                });
              } else {
                createProductAttribute(productAttribute).then((res) => {
                  setShowModal(false);
                  getAllCategories();
                });
              }
            }}
          >
            {productAttribute?.id ? t('"update"') : t('create')}
          </Button>
          </div>
        </Modal.Footer>
      </Modal>
      {/* {category && (
        <ModalProductAttribute
          category={category}
          setProductAttribute={setProductAttribute}
          show={showModal}
          setShow={setShowModal}
          onCreate={getAllCategories}
        />
      )} */}
    </div>
  );
};
export default ProductAttributeTable;
