import { useEffect, useRef, useState, type FC } from "react";
import { MerchantModel } from "../models/merchant";
import { ProductModel } from "../models/product";
import { getProduct, getProducts } from "../services/api/productApi";
import { useTranslation } from "react-i18next";
import { BsImage, BsPlus, BsPlusCircle } from "react-icons/bs";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { RiAddCircleFill } from "react-icons/ri";
import { TbTrash } from "react-icons/tb";
import {
  addProductMerchant,
  deleteMerchantProduct,
  getMerchantProducts,
} from "../services/api/merchantApi";
import { PaginationResponse } from "../objects/pagination";
import { getPagination } from "../utils/helper";
import { Card } from "flowbite-react";
import { useParams } from "react-router-dom";
interface MerchantProductProps {
  merchant?: MerchantModel;
}

const MerchantProduct: FC<MerchantProductProps> = ({ merchant }) => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [search, setSearch] = useState("");
  const timeout = useRef<number | null>(null);
  const timeout2 = useRef<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [searchProducts, setSearchProducts] = useState("");
  const [merchantProducts, setMerchantProducts] = useState<ProductModel[]>([]);
  const [pagination, setPagination] = useState<PaginationResponse>();
  const  {merchantId} = useParams();
  useEffect(() => {
    return () => {};
  }, []);

  useEffect(() => {
    if (timeout.current) {
      window.clearTimeout(timeout.current);
    }
    timeout.current = window.setTimeout(() => {
      getAllProduct();
    }, 500);
  }, [search]);

  useEffect(() => {
    if (timeout2.current) {
      window.clearTimeout(timeout2.current);
    }
    timeout2.current = window.setTimeout(() => {
      getAllProductMerchants();
    }, 500);
  }, [searchProducts]);
  const getAllProduct = () => {
    getProducts({ page: 1, size: 10, search }).then((res: any) => {
      setProducts(res.data.items);
    });
  };

  useEffect(() => {
    if (!merchantId) return;
    getAllProductMerchants();
  }, [merchantId]);

  const getAllProductMerchants = async () => {
    getMerchantProducts(merchantId!, {
      page,
      size,
      search: searchProducts,
    }).then((resp: any) => {
      setMerchantProducts(resp.data.items);
      setPagination(getPagination(resp.data));
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
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
  const searchProductBox = (
    <div className="relative w-full w-full mr-4 focus-within:text-purple-500">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
        <HiMagnifyingGlass />
      </div>
      <input
        type="text"
        className="w-full py-2 pl-10 text-sm text-gray-700 bg-white border border-gray-300 rounded-2xl shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-500"
        placeholder="Search"
        value={searchProducts}
        onChange={(e) => setSearchProducts(e.target.value)}
      />
    </div>
  );
  return (
    <div className="grid grid-cols-4 h-[calc(100vh-280px)] ">
      <div className="col-span-3 h-full overflow-y-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="w-[400px] ">{searchProductBox}</div>
          {selectedProductIds.length > 0 && (
            <button
              className=" py-2 px-2 flex items-center gap-2 text-red-500"
              onClick={() => {
                if (window.confirm(t("confirm_delete", { description: t("product") }))) {
                  // Proceed with deletion logic
                  // Example: Call delete API or update state
                  deleteMerchantProduct(merchantId!, {
                    product_ids: selectedProductIds,
                  }).then(() => {
                    getAllProductMerchants();
                    setSelectedProductIds([]);
                  })
                }

              }}
            >
              <TbTrash className="text-red-500" size={20} />
              {t("delete")}
            </button>
          )}
        </div>
        <div className="grid grid-cols-4 gap-4">
          {merchantProducts.map((product) => (
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
                  setSelectedProductIds([...selectedProductIds, product.id!]);
                }
              }}
            >
              <div className="w-full h-[100px]">
                {product.product_images.length == 0 ? (
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
                <span className="text-sm text-gray-500">{product.sku}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className=" h-full border-l border-l-gray-100 overflow-y-auto px-4 flex flex-col">
        <div className="flex justify-between items-center">
          <h4 className="font-bold text-lg mb-2">{t("products")}</h4>
          {selectedIds.length > 0 && (
            <div className="text-sm flex ">
              <button
                className=" py-2 px-2 flex items-center gap-2  text-blue-400"
                onClick={() => {
                  addProductMerchant(merchant?.id!, {
                    product_ids: selectedIds,
                  }).then(() => {
                    setSelectedIds([]);
                    getAllProductMerchants();
                  });
                }}
              >
                <RiAddCircleFill size={20} />
              </button>
            </div>
          )}
        </div>
        {searchBox}
        <div className="mt-4">
          {products.filter((product) => !merchantProducts.map((p) => p.id).includes(product.id!)).map((product) => (
            <div
              className="hover:bg-[#ffb6b9]  py-2 flex  gap-2 items-center cursor-pointer px-2 w-full  justify-between rounded-lg mb-2 last:mb-0"
              style={
                selectedIds.includes(product.id!)
                  ? { backgroundColor: "#4c8aed" }
                  : {}
              }
              key={product.id}
              onClick={() => {
                if (selectedIds.includes(product.id!)) {
                  setSelectedIds(selectedIds.filter((id) => id !== product.id));
                } else {
                  setSelectedIds([...selectedIds, product.id!]);
                }
              }}
            >
              <div className="flex items-center gap-2">
                <div className="w-12 h-12">
                  {product.product_images.length == 0 ? (
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
                  <span className="font-semibold text-lg">{product.name}</span>
                  <small>{product.sku}</small>
                </div>
              </div>
              <div>
                <BsPlusCircle className="text-blue-400 hover:text-blue-600" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default MerchantProduct;
