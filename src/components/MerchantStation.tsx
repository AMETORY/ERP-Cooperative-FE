import { useContext, useEffect, useRef, useState, type FC } from "react";
import { MerchantModel, MerchantStationModel } from "../models/merchant";
import {
  addProductMerchantStation,
  createStation,
  deleteProductMerchantStation,
  deleteStation,
  getMerchantProducts,
  getProductsMerchantStation,
  getStations,
  updateStation,
} from "../services/api/merchantApi";
import {
  Button,
  Label,
  Modal,
  Pagination,
  Table,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useTranslation } from "react-i18next";
import { LoadingContext } from "../contexts/LoadingContext";
import toast from "react-hot-toast";
import { PaginationResponse } from "../objects/pagination";
import { getPagination } from "../utils/helper";
import { SearchContext } from "../contexts/SearchContext";
import { ProductModel } from "../models/product";
import { getProducts } from "../services/api/productApi";
import { BsImage, BsPlusCircle } from "react-icons/bs";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { RiAddCircleFill } from "react-icons/ri";
import { TbTrash } from "react-icons/tb";
interface MerchantStationProps {
  merchant: MerchantModel;
}

const MerchantStation: FC<MerchantStationProps> = ({ merchant }) => {
  const { loading, setLoading } = useContext(LoadingContext);
  const { t } = useTranslation();
  const [stations, setStations] = useState<MerchantStationModel[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const timeout = useRef<number | null>(null);

  const [products, setProducts] = useState<ProductModel[]>([]);
  const [productsStation, setProductsStation] = useState<ProductModel[]>([]);
  const [pagination, setPagination] = useState<PaginationResponse>();
  const { search } = useContext(SearchContext);
  const [searchProduct, setSearchProduct] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [selectedStation, setSelectedStation] =
    useState<MerchantStationModel>();

  const getAllProduct = () => {
    getMerchantProducts(merchant!.id!, {
      page: 1,
      size: 10,
      search: searchProduct,
    }).then((res: any) => {
      setProducts(res.data.items);
    });
  };
  const getAllMerchantProductsStation = (stationId: string) => {
    getProductsMerchantStation(merchant!.id!, stationId).then((res: any) => {
      setProductsStation(res.data);
    });
  };

  useEffect(() => {
    if (timeout.current) {
      window.clearTimeout(timeout.current);
    }
    timeout.current = window.setTimeout(() => {
      getAllProduct();
    }, 500);
  }, [searchProduct]);

  useEffect(() => {
    if (merchant) {
      getAllStations();
    }
  }, [merchant, page, size, search]);

  const getAllStations = () => {
    getStations(merchant!.id!, { page, size, search }).then((res: any) => {
      setStations(res.data.items);
      setPagination(getPagination(res.data));
    });
  };

  const searchBox = (
    <div className="relative w-full w-full mr-4 focus-within:text-purple-500">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <HiMagnifyingGlass />
      </div>
      <input
        type="text"
        className="w-full py-2 pl-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
        placeholder="Search"
        value={searchProduct}
        onChange={(e) => setSearchProduct(e.target.value)}
      />
    </div>
  );
  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          gradientDuoTone="purpleToBlue"
          pill
          onClick={() => {
            setShowModal(true);
            setSelectedStation(undefined);
            setName("");
            setDescription("");
          }}
        >
          + {t("station")}
        </Button>
      </div>
      <div>
        <Table striped>
          <Table.Head>
            <Table.HeadCell>{t("name")}</Table.HeadCell>
            <Table.HeadCell>{t("description")}</Table.HeadCell>
            <Table.HeadCell className="w-32"></Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {stations.map((station) => (
              <Table.Row key={station.id}>
                <Table.Cell>{station.station_name}</Table.Cell>
                <Table.Cell>{station.description}</Table.Cell>
                <Table.Cell>
                  <a
                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer"
                    onClick={() => {
                      setSelectedStation(station);
                      setName(station.station_name);
                      setDescription(station.description);
                      setShowModalEdit(true);
                      getAllProduct();
                      getAllMerchantProductsStation(station.id!);
                    }}
                  >
                    {t("edit")}
                  </a>
                  <a
                    className="font-medium text-red-600 hover:underline dark:text-red-500 ms-2 cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      if (
                        window.confirm(
                          `Are you sure you want to delete  ${station.station_name}?`
                        )
                      ) {
                        deleteStation(merchant!.id!, station?.id!).then(() => {
                          getAllStations();
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
        <Pagination
          className="mt-4"
          currentPage={page}
          totalPages={pagination?.total_pages ?? 0}
          onPageChange={(val) => {
            setPage(val);
          }}
          showIcons
        />
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Form Station</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col space-y-4">
            <div>
              <Label htmlFor="name" value={t("name")} />
              <TextInput
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("name")}
              />
            </div>
            <div>
              <Label htmlFor="description" value={t("description")} />
              <Textarea
                id="description"
                rows={7}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("description")}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="flex justify-end gap-2">
          <Button color="gray" onClick={() => setShowModal(false)}>
            {t("cancel")}
          </Button>
          <Button
            onClick={async () => {
              try {
                setLoading(true);
                if (selectedStation) {
                  await updateStation(merchant!.id!, selectedStation.id!, {
                    station_name: name,
                    description,
                  });
                } else {
                  await createStation(merchant!.id!, {
                    station_name: name,
                    description,
                  });
                }
                setShowModal(false);
                getAllStations();
                setName("");
                setDescription("");
                setSelectedStation(undefined);

                toast.success(t("update_successful"));
              } catch (error) {
                toast.error(`${error}`);
              } finally {
                setLoading(false);
              }
            }}
          >
            {t("save")}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        size="7xl"
        show={showModalEdit}
        onClose={() => setShowModalEdit(false)}
      >
        <Modal.Header>Edit Station</Modal.Header>
        <Modal.Body>
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-lg mb-2">
                  {t("product_station")}
                </h4>
                {selectedProductIds.length > 0 && (
                  <div className="text-sm flex ">
                    <button
                      className=" py-2 px-2 flex items-center gap-2 text-red-500"
                      onClick={() => {
                        deleteProductMerchantStation(
                          merchant?.id!,
                          selectedStation?.id!,
                          {
                            product_ids: selectedProductIds,
                          }
                        ).then(() => {
                          setSelectedIds([]);
                          getAllMerchantProductsStation(selectedStation?.id!);
                        });
                      }}
                    >
                      <TbTrash className="text-red-500" size={20} />
                      {t("delete")}
                    </button>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-4 gap-4">
                {productsStation.map((product) => (
                  <div
                    key={product.id}
                    className="flex-col  py-2 flex  gap-2 items-center cursor-pointer px-2 w-full  justify-between rounded-lg mb-2 last:mb-0 border  h-[200px] hover:bg-[#ffb6b9] "
                    style={
                      selectedProductIds.includes(product.id!)
                        ? { backgroundColor: "#4c8aed" }
                        : {}
                    }
                    onClick={() => {
                      if (selectedProductIds.includes(product.id!)) {
                        setSelectedProductIds(
                          selectedProductIds.filter((id) => id !== product.id)
                        );
                      } else {
                        setSelectedProductIds([
                          ...selectedProductIds,
                          product.id!,
                        ]);
                      }
                    }}
                  >
                    <div className="w-full h-[100px]">
                      {(product.product_images ?? []).length == 0 ? (
                        <BsImage className="w-12 h-12 rounded-lg" />
                      ) : (
                        <img
                          className="w-full h-[100px] object-cover rounded-lg"
                          src={product.product_images[0].url}
                          alt={product.name}
                        />
                      )}
                    </div>
                    <div className="flex flex-col w-full">
                      <small className="bg-slate-300 px-3 text-[10px] rounded-xl w-fit">
                        {product.category?.name}
                      </small>
                      <span className="font-bold">{product.name}</span>
                      <span className="text-sm text-gray-500">
                        {product.sku}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-2 border-l border-r">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-lg mb-2">{t("products")}</h4>
                {selectedIds.length > 0 && (
                  <div className="text-sm flex ">
                    <button
                      className=" py-2 px-2 flex items-center gap-2  text-blue-400"
                      onClick={() => {
                        addProductMerchantStation(
                          merchant?.id!,
                          selectedStation?.id!,
                          {
                            product_ids: selectedIds,
                          }
                        ).then(() => {
                          setSelectedIds([]);
                          getAllProduct();
                          getAllMerchantProductsStation(selectedStation!.id!);
                        });
                      }}
                    >
                      <RiAddCircleFill size={20} />
                    </button>
                  </div>
                )}
              </div>
              {searchBox}
              {products
                .filter((p) => !p.merchant_station_id)
                .filter(
                  (product) =>
                    !productsStation.map((p) => p.id).includes(product.id!)
                )
                .map((product) => (
                  <div
                    className="hover:bg-[#ffb6b9]  py-2 flex  gap-2 items-center cursor-pointer px-2 w-full  justify-between rounded-lg mb-2 last:mb-0 mt-4"
                    style={
                      selectedIds.includes(product.id!)
                        ? { backgroundColor: "#4c8aed" }
                        : {}
                    }
                    key={product.id}
                    onClick={() => {
                      if (selectedIds.includes(product.id!)) {
                        setSelectedIds(
                          selectedIds.filter((id) => id !== product.id)
                        );
                      } else {
                        setSelectedIds([...selectedIds, product.id!]);
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12">
                        {(product.product_images ?? []).length == 0 ? (
                          <BsImage />
                        ) : (
                          <img
                            className="w-full h-full object-cover  rounded-full"
                            src={product.product_images[0].url}
                            alt=""
                          />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <small className="bg-slate-300 px-3 text-[10px] rounded-xl w-fit">
                          {product.category?.name}
                        </small>
                        <span className="font-semibold text-lg">
                          {product.name}
                        </span>
                        <small>{product.sku}</small>
                      </div>
                    </div>
                    <div>
                      <BsPlusCircle className="text-blue-400 hover:text-blue-600" />
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex flex-col space-y-4">
              <div>
                <Label htmlFor="name" value={t("name")} />
                <TextInput
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("name")}
                />
              </div>
              <div>
                <Label htmlFor="description" value={t("description")} />
                <Textarea
                  id="description"
                  rows={7}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("description")}
                />
              </div>
              <div className="flex flex-row gap-2 justify-end">
                <Button
                  color="gray"
                  onClick={() => {
                    setShowModalEdit(false);
                    getAllStations();
                    setName("");
                    setDescription("");
                    setSelectedStation(undefined);
                    setProductsStation([]);
                  }}
                >
                  {t("cancel")}
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      setLoading(true);
                      await updateStation(merchant!.id!, selectedStation!.id!, {
                        station_name: name,
                        description,
                      });

                      toast.success(t("update_successful"));
                    } catch (error) {
                      toast.error(`${error}`);
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  {t("save")}
                </Button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default MerchantStation;
