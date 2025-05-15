import {
  Button,
  Carousel,
  Modal,
  ModalBody,
  Tabs,
  TabsRef,
  Tooltip,
} from "flowbite-react";
import { useContext, useEffect, useRef, useState, type FC } from "react";
import Barcode from "react-barcode";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  BsCheck,
  BsCheckCircle,
  BsImage,
  BsInfoCircle,
  BsPlusLg,
  BsTrash3,
} from "react-icons/bs";
import {
  MdBalance,
  MdOutlineBalance,
  MdOutlineCheck,
  MdOutlineChecklist,
  MdOutlineImageNotSupported,
} from "react-icons/md";
import { TbFlagDollar, TbTrash } from "react-icons/tb";
import Moment from "react-moment";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/layouts/admin";
import ModalProduct from "../components/ModalProduct";
import ModalProductUnit from "../components/ModalProductUnit";
import { LoadingContext } from "../contexts/LoadingContext";
import { DiscountModel } from "../models/discount";
import { ProductModel, VariantModel } from "../models/product";
import { StockMovementModel } from "../models/stock_movement";
import { UnitModel } from "../models/unit";
import { uploadFile } from "../services/api/commonApi";
import {
  createProductVariant,
  deleteProductImage,
  deleteProductPrice,
  deleteProductUnit,
  deleteProductVariant,
  getDiscounts,
  getProduct,
  getProductVariants,
  updateProduct,
  updateProductVariant,
} from "../services/api/productApi";
import { getStockMovements } from "../services/api/stockMovementApi";
import { invertColor, money, nl2br } from "../utils/helper";
import PriceForm from "./PriceForm";
import VariantForm from "./VariantForm";
import { render } from "@testing-library/react";
import { FileModel } from "../models/file";
import { RxReload } from "react-icons/rx";
interface ProductDetailProps {}

const ProductDetail: FC<ProductDetailProps> = ({}) => {
  const tabsRef = useRef<TabsRef>(null);
  const [activeTab, setActiveTab] = useState(0);
  const { t } = useTranslation();
  const [product, setProduct] = useState<ProductModel>();
  const { productId } = useParams<{ productId: string }>();
  const fileRef = useRef<HTMLInputElement>(null);
  const { loading, setLoading } = useContext(LoadingContext);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalAddVariant, setModalAddVariant] = useState(false);
  const [variants, setVariants] = useState<VariantModel[]>([]);
  const [discounts, setDiscounts] = useState<DiscountModel[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<VariantModel>();
  const [modalAddDiscount, setModalAddDiscount] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<DiscountModel>();
  const [stockMovements, setStockMovements] = useState<StockMovementModel[]>(
    []
  );
  const [modalAddPrice, setModalAddPrice] = useState(false);
  const [modalAddUnit, setModalAddUnit] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<UnitModel>();
  const nav = useNavigate();
  const [selectedImage, setSelectedImage] = useState<FileModel>();
  useEffect(() => {
    if (productId) {
      getDetail();
    }
  }, [productId]);

  useEffect(() => {
    if (product) {
    }
  }, [product]);
  const getDetail = () => {
    getProduct(productId!).then((res: any) => {
      setProduct(res.data);
      getPreference();
      getStockMovements({ page: 1, size: 10, product_id: productId! }).then(
        (v: any) => setStockMovements(v.data.items)
      );
    });
  };

  const getPreference = () => {
    getProductVariants(productId!).then((response: any) =>
      setVariants(response.data)
    );
    getDiscounts(productId!).then((response: any) =>
      setDiscounts(response.data)
    );
  };

  const addVariant = async (data: VariantModel) => {
    try {
      setLoading(true);
      if (selectedVariant) {
        await updateProductVariant(product!.id!, selectedVariant.id!, data);
      } else {
        await createProductVariant(product!.id!, data);
      }
      getProductVariants(product!.id!).then((response: any) => {
        setVariants(response.data);
        setModalAddVariant(false);
        setSelectedVariant(undefined);
      });
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setLoading(false);
    }
  };

  const removeUnit = async (id: string) => {
    try {
      const confirmRemoval = window.confirm(
        "Are you sure you want to remove this unit?"
      );
      if (!confirmRemoval) return;

      setLoading(true);
      await deleteProductUnit(productId!, id);
      getDetail();
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setLoading(false);
    }
  };
  const removePrice = async (id: string) => {
    try {
      const confirmRemoval = window.confirm(
        "Are you sure you want to remove this price?"
      );
      if (!confirmRemoval) return;

      setLoading(true);
      await deleteProductPrice(productId!, id);
      getDetail();
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setLoading(false);
    }
  };

  const renderInputFile = () => (
    <input
      type="file"
      accept="image/*"
      ref={fileRef}
      className="hidden"
      onChange={async (val) => {
        if (val.target.files?.length == 0) return;
        try {
          setLoading(true);
          let resp = await uploadFile(
            val.target.files![0],
            {
              ref_id: productId,
              ref_type: "product",
            },
            (progress) => {
              console.log(progress);
            }
          );
          getDetail();
        } catch (error) {
          toast.error(`${error}`);
        } finally {
          setLoading(false);
        }
      }}
    />
  );
  const removeImage = async (id: string) => {
    try {
      const confirmRemoval = window.confirm(
        "Are you sure you want to remove this image?"
      );
      if (!confirmRemoval) return;
      setLoading(true);
      await deleteProductImage(productId!, id);
      getDetail();
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setLoading(false);
    }
  };

  const removeVariant = async (id: string) => {
    try {
      const confirmRemoval = window.confirm(
        "Are you sure you want to remove this variant?"
      );
      if (!confirmRemoval) return;
      setLoading(true);
      await deleteProductVariant(productId!, id);
      getProductVariants(product!.id!).then((response: any) =>
        setVariants(response.data)
      );
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setLoading(false);
    }
  };

  const renderImages = () => (
    <div className="w-full h-[calc(100vh-180px)] overflow-y-auto">
      <div className="grid grid-cols-6 gap-4">
        {(product?.product_images ?? []).map((img, index) => (
          <div
            className="relative aspect-square  border rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
            key={index}
            onClick={() => setSelectedImage(img)}
          >
            <img
              key={index}
              className="object-cover w-full h-full rounded-xl"
              src={img.url}
            />
            <div className="absolute bottom-2 right-[calc(50%-16px)] cursor-pointer p-2 aspect-square rounded-full bg-black bg-opacity-20 z-50">
              <BsTrash3
                className=""
                onClick={() => removeImage(img.id!)}
                size={16}
                color="white"
              />
            </div>
          </div>
        ))}
        <div
          className="relative aspect-square  border rounded-xl bg-blue-200 flex justify-center items-center cursor-pointer hover:bg-blue-600 transition-colors"
          onClick={() => {
            fileRef.current?.click();
          }}
        >
          <div className="w-10 h-10 flex items-center justify-center cursor-pointer p-2 aspect-square rounded-full bg-black bg-opacity-20 z-50">
            <BsPlusLg className="" size={16} color="white" />
          </div>
        </div>
      </div>
      {/* <Carousel
        className="custom-slider"
        color="orange"
        slide={false}
        leftControl={""}
        rightControl={""}
        draggable
        indicators={false}
      >
        {(product?.product_images ?? []).map((img, index) => (
          <div className="relative" key={index}>
            <img key={index} className="object-cover w-full" src={img.url} />
            <div className="absolute bottom-2 right-[calc(50%-16px)] cursor-pointer p-2 aspect-square rounded-full bg-black bg-opacity-20 z-50">
              <BsTrash3
                className=""
                onClick={() => removeImage(img.id!)}
                size={16}
                color="white"
              />
            </div>
          </div>
        ))}
      </Carousel> */}
      {/* <Button
        size="sm"
        className="mt-4 w-full"
        onClick={() => {
          fileRef.current?.click();
        }}
      >
        <BsImage className="mr-2" />
        {t("add_image")}
      </Button> */}
    </div>
  );

  const renderView = () => (
    <div className="grid grid-cols-12 gap-4  h-full ">
      <div className="col-span-4 py-8 pl-8 pr-4 ">
        <div className="w-full min-h-[300px] flex flex-col items-center justify-between">
          {(product?.product_images ?? []).length == 0 ? (
            <div className="bg-gray-50 w-full flex flex-col items-center justify-center h-300 py-10 hover:bg-gray-100">
              <MdOutlineImageNotSupported
                size={100}
                color="gray"
                className="cursor-pointer"
                onClick={() => {
                  fileRef.current?.click();
                }}
              />
            </div>
          ) : (
            renderImages()
          )}
        </div>
      </div>
      <div className="col-span-8 overflow-y-auto py-8 pl-4 pr-8 ">
        {(product?.tags ?? []).length > 0 && (
          <div className="mb-4">
            <small className="font-bold">Tags:</small>
            <div>
              {(product?.tags ?? []).map((tag, index) => (
                <div
                  key={index}
                  className={`inline-block bg-gray-200 rounded-full px-3 py-0.5 text-xs font-semibold text-gray-700 mr-2 `}
                  style={{
                    backgroundColor: tag.color,
                    color: invertColor(tag.color),
                  }}
                >
                  {tag.name}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="w-full p-2"></div>

        <div className="w-full p-2"></div>
        {/* <div className="mb-4">
        <div className="flex flex-row justify-between items-center">
          <small className="font-bold">Discounts:</small>
          <Button
            color="green"
            size="xs"
            className="ml-2"
            onClick={() => {
              setModalAddDiscount(true);
            }}
          >
            Add Discount
          </Button>
        </div>
      </div>
      {(discounts ?? []).length > 0 ? (
        <table className="w-full border border-gray-300 mt-4">
          <thead>
            <tr>
              <th className="px-4 py-2 text-sm border text-left border-gray-300">
                Discount Type
              </th>
              <th className="px-4 py-2 text-sm border border-gray-300">
                Value
              </th>
              <th className="px-4 py-2 text-sm border border-gray-300">
                Date
              </th>
              <th className="px-4 py-2 text-sm border border-gray-300">
                Notes
              </th>
              <th className="px-4 py-2 text-sm border border-gray-300">
                Status
              </th>
              <th className="px-4 py-2 text-sm border border-gray-300">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((v) => (
              <tr key={v.id}>
                <td
                  className="px-4 py-2 text-sm border border-gray-300 hover:underline cursor-pointer text-semibold"
                  onClick={() => {
                    setSelectedDiscount(v);
                    setModalAddDiscount(true);
                  }}
                >
                  {v.type}
                </td>
                <td className="px-4 py-2 text-sm border text-center border-gray-300">
                  {v.type === "PERCENTAGE"
                    ? `${v.value}%`
                    : money(v.value)}
                </td>
                <td className="px-4 py-2 text-sm border border-gray-300 text-left">
                  <div className="flex justify-center items-center">
                    <Moment format="DD/MM/YYYY">{v.start_date}</Moment>{" "}
                    {v.end_date && " - "}
                    {v.end_date && (
                      <Moment format="DD/MM/YYYY">{v.end_date}</Moment>
                    )}{" "}
                  </div>
                </td>
                <td className="px-4 py-2 text-sm border text-center border-gray-300">
                  {v.notes}
                </td>
                <td className="px-4 py-2 text-sm border border-gray-300 text-center">
                  <div className="flex justify-center items-center">
                    {v.is_active && (
                      <BsCheck2Circle
                        size={12}
                        className="text-green-500"
                      />
                    )}
                  </div>
                </td>
                <td className="px-4 py-2 text-sm border border-gray-300 text-center">
                  <div className="flex justify-center">
                    <BsTrash3
                      className="text-red-500 hover:text-red-800 cursor-pointer"
                      size={12}
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this discount?"
                          )
                        ) {
                          // Proceed with the delete action
                          setLoading(true);
                          deleteDiscount(productId!, v.id!)
                            .then(() => {
                              toast.success(
                                "Discount deleted successfully"
                              );
                              getDetail();
                            })
                            .catch((err) => {
                              toast.error(err.message);
                            })
                            .finally(() => {
                              setLoading(false);
                            });
                        }
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-sm text-gray-400">No Discounts Available</p>
      )} */}
        <div className="w-full p-2"></div>

        <div className="mb-4">
          <small className="font-bold">{t("description")}:</small>
          <div
            className="min-h-[100px] text-sm"
            dangerouslySetInnerHTML={{
              __html: product?.description ? nl2br(product?.description) : "",
            }}
          ></div>
        </div>
      </div>
    </div>
  );

  const renderPrices = () => (
    <div className="w-full h-[calc(100vh-180px)] overflow-y-auto">
      <div className="mb-4">
        <div className="flex flex-row justify-between items-center">
          <small className="font-bold"></small>
          <Button
            color="green"
            size="xs"
            className="ml-2"
            onClick={() => {
              setModalAddPrice(true);
            }}
          >
            Add Price
          </Button>
        </div>

        {(product?.prices ?? []).length > 0 ? (
          <table className="w-full border border-gray-300 mt-4">
            <thead>
              <tr>
                <th className="px-4 py-2 text-sm border text-left border-gray-300">
                  {t("category")}
                </th>
                <th className="px-4 py-2 text-sm border border-gray-300">
                  {t("amount")}
                </th>
                <th className="px-4 py-2 text-sm border border-gray-300">
                  {t("effective_date")}
                </th>
                <th className="px-4 py-2 text-sm border border-gray-300">
                  {t("min_quantity")}
                </th>
                <th className="px-4 py-2 text-sm border border-gray-300">
                  {t("action")}
                </th>
              </tr>
            </thead>
            <tbody>
              {product?.prices.map((price) => (
                <tr key={price.id}>
                  <td className="px-4 py-2 text-sm border border-gray-300">
                    {price.price_category?.name}
                  </td>
                  <td className="px-4 py-2 text-sm border text-center border-gray-300">
                    {money(price.amount)}
                  </td>
                  <td className="px-4 py-2 text-sm border border-gray-300 text-center">
                    <Moment format="DD/MM/YYYY">{price.effective_date}</Moment>
                  </td>
                  <td className="px-4 py-2 text-sm border border-gray-300 text-center">
                    {price.min_quantity}
                  </td>
                  <td className="px-4 py-2 text-sm border border-gray-300 text-center">
                    <div className="flex justify-center">
                      <BsTrash3
                        className="text-red-500 hover:text-red-800 cursor-pointer"
                        size={12}
                        onClick={() => removePrice(price.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-gray-400">No Price Available</p>
        )}
      </div>
      <div className="w-full p-2"></div>
    </div>
  );

  const renderVarian = () => (
    <div>
      <div className="mb-4">
        <div className="flex flex-row justify-between items-center">
          <small className="font-bold"></small>
          <Button
            color="green"
            size="xs"
            className="ml-2"
            onClick={() => {
              setModalAddVariant(true);
            }}
          >
            Add Variant
          </Button>
        </div>

        {(variants ?? []).length > 0 ? (
          <table className="w-full border border-gray-300 mt-4">
            <thead>
              <tr>
                <th className="px-4 py-2 text-sm border text-left border-gray-300">
                  {t("display_name")}
                </th>
                <th className="px-4 py-2 text-sm border border-gray-300">
                  {t("price")}
                </th>
                <th className="px-4 py-2 text-sm border border-gray-300">
                  {t("attribute")}
                </th>
                <th className="px-4 py-2 text-sm border border-gray-300">
                  {t("dimension")}
                </th>
                <th className="px-4 py-2 text-sm border border-gray-300">
                  {t("weight")}
                </th>
                <th className="px-4 py-2 text-sm border border-gray-300">
                  {t("sku")}
                </th>
                <th className="px-4 py-2 text-sm border border-gray-300">
                  {t("stock")}
                </th>
                <th className="px-4 py-2 text-sm border border-gray-300">
                  {t("action")}
                </th>
              </tr>
            </thead>
            <tbody>
              {variants.map((v) => (
                <tr key={v.id}>
                  <td
                    className="px-4 py-2 text-sm border border-gray-300 hover:underline cursor-pointer"
                    onClick={() => {
                      setSelectedVariant(v);
                      setModalAddVariant(true);
                    }}
                  >
                    <div>{v.display_name}</div>
                    <div>
                      {(v?.tags ?? []).map((tag, index) => (
                        <div
                          key={index}
                          className={`inline-block bg-gray-200 rounded-full px-1.5 text-[8pt] font-semibold text-gray-700 mr-2 `}
                          style={{
                            backgroundColor: tag.color,
                            color: invertColor(tag.color),
                          }}
                        >
                          {tag.name}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm border text-center border-gray-300">
                    {money(v.price)}
                    {v?.original_price != v?.price && (
                      <>
                        {" "}
                        <br />
                        <span className="line-through text-xs text-gray-400">
                          {money(v?.original_price)}
                        </span>
                      </>
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm border border-gray-300 text-left">
                    <ul className="">
                      {(v.attributes ?? []).map((a) => (
                        <li key={a.id}>
                          {a.attribute?.name} : {a.value}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-2 text-sm border border-gray-300 text-center">
                    {v.length} x {v.width} x {v.height} cm
                  </td>
                  <td className="px-4 py-2 text-sm border border-gray-300 text-center">
                    {v.weight} gr
                  </td>
                  <td className="px-4 py-2 text-sm border border-gray-300 text-center">
                    {v.sku}
                  </td>
                  <td className="px-4 py-2 text-sm border border-gray-300 text-center">
                    {money(v.total_stock)}
                  </td>

                  <td className="px-4 py-2 text-sm border border-gray-300 text-center">
                    <div className="flex justify-center">
                      <BsTrash3
                        className="text-red-500 hover:text-red-800 cursor-pointer"
                        size={12}
                        onClick={() => removeVariant(v.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-gray-400">No Variants Available</p>
        )}
      </div>
    </div>
  );

  const renderInfo = () => (
    <div className="flex flex-col space-y-4 px-4 h-[calc(100vh-180px)] overflow-y-auto">
      <div className="flex flex-row justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{product?.name}</h1>
        </div>
        <div className="gap-2 flex flex-row">
          {product?.status == "PENDING" && (
            <Button
              color="red"
              size="xs"
              onClick={async () => {
                try {
                  if (
                    window.confirm(
                      "Are you sure you want to reject this product?"
                    )
                  ) {
                    setLoading(true);
                    product.status = "REJECTED";
                    await updateProduct(productId!, product);
                    getDetail();
                  }
                } catch (error) {
                  toast.error(`${error}`);
                } finally {
                  setLoading(false);
                }

                // Add your edit functionality here
              }}
            >
              <TbTrash />
              REJECTED
            </Button>
          )}
          {product?.status == "PENDING" && (
            <Button
              color="green"
              size="xs"
              onClick={async () => {
                try {
                  if (
                    window.confirm(
                      "Are you sure you want to approve this product?"
                    )
                  ) {
                    setLoading(true);
                    product.status = "ACTIVE";
                    await updateProduct(productId!, product);
                    getDetail();
                  }
                } catch (error) {
                  toast.error(`${error}`);
                } finally {
                  setLoading(false);
                }

                // Add your edit functionality here
              }}
            >
              <BsCheck />
              APPROVE
            </Button>
          )}
          <Button
            size="xs"
            onClick={() => {
              setModalEdit(true);

              // Add your edit functionality here
            }}
          >
            Edit
          </Button>
        </div>
      </div>
      <div className="mb-4">
        <p className="font-bold">{t("product_category")}</p>
        <p className="text-lg"> {product?.category?.name}</p>
      </div>
      <div className="mb-4">
        <p className="font-bold">SKU:</p>
        <p className="text-lg"> {product?.sku}</p>
      </div>
      <div className="mb-4">
        <p className="font-bold">Barcode:</p>
        {product?.barcode && <Barcode value={product?.barcode} height={60} />}
      </div>
      <div className="mb-4">
        <p className="font-bold">Brand:</p>
        {product?.brand && (
          <p className="text-lg">{product?.brand?.name ?? "-"}</p>
        )}
      </div>
      <div className="mb-4">
        <p className="font-bold">{t("total_stock")}:</p>
        <p className="text-lg">
          {" "}
          {money(product?.total_stock)} {product?.default_unit?.code}
        </p>
      </div>
      <div className="mb-4">
        <p className="font-bold">{t("base_price")}:</p>
        <p className="text-lg ">
          {" "}
          {money(product?.price)}{" "}
          {product?.original_price != product?.price && (
            <span className="line-through text-sm text-gray-400">
              {money(product?.original_price)}
            </span>
          )}{" "}
        </p>
      </div>
      <div className="mb-4">
        <p className="font-bold">{t("description")}</p>
        {product?.description}
      </div>
      {/* <div className="mb-4">
        <small className="font-bold">Dimension (L x W x H):</small>
        <p className="text-sm">
          {product?.length} x {product?.width} x {product?.height} cm
        </p>
      </div> */}
      {/* <div className="mb-4">
        <small className="font-bold">Weight:</small>
        <p className="text-sm">{product?.weight} gr</p>
      </div> */}
    </div>
  );

  const renderUnit = () => (
    <div className="w-full h-[calc(100vh-180px)] overflow-y-auto">
      <div className="mb-4">
        <div className="flex flex-row justify-between items-center">
          <small className="font-bold"></small>
          <Button
            color="green"
            size="xs"
            className="ml-2"
            onClick={() => {
              setModalAddUnit(true);
            }}
          >
            Add Unit
          </Button>
        </div>
        {(product?.units ?? []).length > 0 ? (
          <table className="w-full border border-gray-300 mt-4">
            <thead>
              <tr>
                <th className="px-4 py-2 text-sm border text-left border-gray-300">
                  {t("code")}
                </th>
                <th className="px-4 py-2 text-sm border border-gray-300">
                  {t("name")}
                </th>
                <th className="px-4 py-2 text-sm border border-gray-300">
                  {t("description")}
                </th>
                <th className="px-4 py-2 text-sm border border-gray-300">
                  {t("value")}
                </th>

                <th className="px-4 py-2 text-sm border border-gray-300">
                  {t("action")}
                </th>
              </tr>
            </thead>
            <tbody>
              {(product?.units ?? []).map((v) => (
                <tr key={v.id}>
                  <td
                    className="px-4 py-2 text-sm border border-gray-300 hover:underline cursor-pointer"
                    onClick={() => {
                      setSelectedUnit(v);
                      setModalAddUnit(true);
                    }}
                  >
                    <div>{v.code}</div>
                  </td>
                  <td className="px-4 py-2 text-sm border text-center border-gray-300">
                    {v.name}
                  </td>
                  <td className="px-4 py-2 text-sm border text-center border-gray-300">
                    {v.description}
                  </td>
                  <td className="px-4 py-2 text-sm border text-center border-gray-300">
                    <div className="flex gap-2 items-center justify-between">
                      {money(v.value, 4)} {product?.default_unit?.code}{" "}
                      {v.is_default && (
                        <Tooltip content={"Default Unit"} trigger="hover">
                          <BsCheckCircle className="text-green-400" />
                        </Tooltip>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-2 text-sm border border-gray-300 text-center">
                    <div className="flex justify-center">
                      <BsTrash3
                        className="text-red-500 hover:text-red-800 cursor-pointer"
                        size={12}
                        onClick={() => removeUnit(v.id!)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-gray-400">No Units Available</p>
        )}
      </div>
    </div>
  );

  const renderStockMovement = () => (
    <div className="w-full h-[calc(100vh-180px)] overflow-y-auto">
      <div className="mb-4">
        <small className="font-bold"></small>
        {stockMovements.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-sm border text-left border-gray-300">
                  {t("date")}
                </th>
                <th className="px-4 py-2 text-sm border border-gray-300">
                  {t("quantity")}
                </th>

                <th className="px-4 py-2 text-sm border border-gray-300">
                  {t("merchant")}
                </th>
                <th className="px-4 py-2 text-sm border border-gray-300">
                  {t("warehouse")}
                </th>
                <th className="px-4 py-2 text-sm border border-gray-300">
                  {t("type")}
                </th>
                <th className="px-4 py-2 text-sm border border-gray-300">
                  {t("notes")}
                </th>
              </tr>
            </thead>
            <tbody>
              {stockMovements.map((v) => (
                <tr key={v.id}>
                  <td className="px-4 py-2 text-sm border border-gray-300 text-left">
                    <Moment format="DD/MM/YYYY HH:mm">{v.date}</Moment>
                  </td>
                  <td className="px-4 py-2 text-sm border border-gray-300 text-center">
                    {money(v.quantity)}
                    {v.unit?.code}
                  </td>

                  <td
                    className="px-4 py-2 text-sm border cursor-pointer hover:underline border-gray-300 text-center"
                    onClick={() => {
                      nav(`/merchant/${v.merchant?.id}`);
                    }}
                  >
                    {v.merchant?.name}
                  </td>
                  <td
                    className="px-4 py-2 text-sm border cursor-pointer hover:underline border-gray-300 text-center"
                    onClick={() => {
                      nav(`/warehouse/${v.warehouse?.id}`);
                    }}
                  >
                    {v.warehouse?.name}
                  </td>
                  <td className="px-4 py-2 text-sm border border-gray-300 text-center">
                    {v.type}
                  </td>
                  <td className="px-4 py-2 text-sm border border-gray-300 text-center">
                    {v.description}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th className="px-4 py-2 text-sm border text-left border-gray-300">
                  {t("total_stock")}
                </th>
                <th className="px-4 py-2 text-sm border border-gray-300">
                  {product?.total_stock} {product?.default_unit?.code}
                </th>
                <th className="px-4 py-2 text-sm border border-gray-300" colSpan={5}>
                </th>

                
              </tr>
            </tfoot>
          </table>
        ) : (
          <p className="text-sm text-gray-400">No Stock Movements Available</p>
        )}
      </div>
    </div>
  );
  return (
    <AdminLayout>
      <div className="h-[calc(100vh-80px)] p-6">
        <Tabs
          aria-label="Default tabs"
          variant="default"
          ref={tabsRef}
          onActiveTabChange={(tab) => {
            setActiveTab(tab);
            // console.log(tab);
          }}
        >
          <Tabs.Item title={t("basic_info")} icon={BsInfoCircle}>
            {renderInfo()}
          </Tabs.Item>
          <Tabs.Item title={t("images")} icon={BsImage}>
            {renderImages()}
          </Tabs.Item>
          <Tabs.Item title={t("sale_prices")} icon={TbFlagDollar}>
            {renderPrices()}
          </Tabs.Item>
          <Tabs.Item title={t("variants")} icon={MdOutlineChecklist}>
            {renderVarian()}
          </Tabs.Item>
          <Tabs.Item title={t("units")} icon={MdOutlineBalance}>
            {renderUnit()}
          </Tabs.Item>
          <Tabs.Item title={t("stock_movements")} icon={RxReload}>
            {renderStockMovement()}
          </Tabs.Item>
        </Tabs>
      </div>
      {renderInputFile()}
      <ModalProduct
        show={modalEdit}
        setShow={() => setModalEdit(false)}
        product={product}
        setProduct={setProduct}
        onCreateProduct={() => {
          getDetail();
        }}
      />
      <PriceForm
        product={product}
        open={modalAddPrice}
        onClose={() => setModalAddPrice(false)}
        onSubmit={(val) => {
          val.product_id = product?.id;
          setModalAddPrice(false);
          getDetail();
          //   addPrice(val);
        }}
      />
      {product && (
        <VariantForm
          open={modalAddVariant}
          onClose={() => setModalAddVariant(false)}
          onSubmit={(val) => {
            val.product_id = product?.id!;
            addVariant(val);
          }}
          product={product!}
          variant={selectedVariant}
        />
      )}
      {product && (
        <ModalProductUnit
          product={product}
          show={modalAddUnit}
          setShow={setModalAddUnit}
          onCreate={() => {
            setModalAddUnit(false);
            getDetail();
          }}
        />
      )}
      {/* 
      <DiscountForm
        open={modalAddDiscount}
        onClose={() => setModalAddDiscount(false)}
        onSubmit={(val) => {
          // console.log(val);
          createNewDiscount(val);
        }}
        discount={selectedDiscount}
      /> */}
      <Modal
        dismissible
        show={selectedImage != undefined}
        onClose={() => setSelectedImage(undefined)}
      >
        <ModalBody>
          <img
            src={selectedImage?.url}
            alt=""
            className="object-cover w-full"
          />
        </ModalBody>
      </Modal>
    </AdminLayout>
  );
};
export default ProductDetail;
