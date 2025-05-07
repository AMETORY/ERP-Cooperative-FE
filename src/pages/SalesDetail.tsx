import { Editor } from "@tinymce/tinymce-react";
import {
  Badge,
  Button,
  Checkbox,
  Datepicker,
  Dropdown,
  HelperText,
  HR,
  Label,
  Modal,
  Table,
  TableRow,
  Textarea,
} from "flowbite-react";
import moment from "moment";
import { useContext, useEffect, useState, type FC } from "react";
import CurrencyInput from "react-currency-input-field";
import toast from "react-hot-toast";
import {
  BsAirplane,
  BsCart2,
  BsDownload,
  BsPlusCircle,
  BsTrash,
} from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import AdminLayout from "../components/layouts/admin";
import ModalListContact from "../components/ModalListContact";
import ModalProduct from "../components/ModalProduct";
import ModalSales from "../components/ModalSales";
import { LoadingContext } from "../contexts/LoadingContext";
import { PaymentTermModel } from "../models/payment_term";
import { ProductModel } from "../models/product";
import { SalesItemModel, SalesModel, SalesPaymentModel } from "../models/sales";
import { TaxModel } from "../models/tax";
import { WarehouseModel } from "../models/warehouse";
import { getPaymentTermGroups } from "../services/api/paymentTermApi";
import { getProducts } from "../services/api/productApi";
import {
  createSales,
  downloadSalesPdf,
  getSalesDetail,
  getSalesItems,
  paymentInvoice,
  publishSales,
  salesAddItem,
  salesDeleteItem,
  salesUpdateItem,
  updateSales,
} from "../services/api/salesApi";
import { getTaxes } from "../services/api/taxApi";
import { getWarehouses } from "../services/api/warehouseApi";
import { groupBy, money } from "../utils/helper";
import DrawerPostInvoice from "../components/DrawerPostInvoice";
import { FaPaperPlane, FaPlane } from "react-icons/fa6";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { TbFileInvoice, TbTruckDelivery, TbTruckReturn } from "react-icons/tb";
import { MdOutlinePublish } from "react-icons/md";
import { PiQuotes } from "react-icons/pi";
import Moment from "react-moment";
import { paymentMethods } from "../utils/constants";
import { AccountModel } from "../models/account";
import { getAccounts } from "../services/api/accountApi";
import ModalSalesReturn from "../components/ModalSalesReturn";
import { useTranslation } from "react-i18next";

interface SalesDetailProps {}

const SalesDetail: FC<SalesDetailProps> = ({}) => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { loading, setLoading } = useContext(LoadingContext);
  const { salesId } = useParams();
  const [mounted, setMounted] = useState(false);
  const [mountedAmount, setMountedAmount] = useState(true);
  const [sales, setSales] = useState<SalesModel>();
  const [showWarehouse, setShowWarehouse] = useState(true);
  const [showTax, setShowTax] = useState(true);
  const [items, setItems] = useState<SalesItemModel[]>([]);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [product, setProduct] = useState<ProductModel>();
  const [selectedItem, setSelectedItem] = useState<SalesItemModel>();
  const [showModalProduct, setShowModalProduct] = useState(false);
  const [taxes, setTaxes] = useState<TaxModel[]>([]);
  const [modalNoteOpen, setModalNoteOpen] = useState(false);
  const [modalBilledOpen, setModalBilledOpen] = useState(false);
  const [modalShippingOpen, setModalShippingOpen] = useState(false);
  const [warehouses, setWarehouses] = useState<WarehouseModel[]>([]);
  const [itemNotes, setItemNotes] = useState("");
  const [isEdited, setIsEdited] = useState(false);
  const [salesTitle, setSalesTitle] = useState("");
  const [tempSales, setTempSales] = useState<SalesModel>();
  const [showCreateSales, setShowCreateSales] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [payment, setPayment] = useState<SalesPaymentModel>();
  const [discountEnabled, setDiscountEnabled] = useState(false);
  const [assets, setAssets] = useState<AccountModel[]>([]);
  const [paymentPercentage, setPaymentPercentage] = useState(100);
  const [balance, setBalance] = useState(0);
  const [showReturn, setShowReturn] = useState(false);
  const [paymentTermGroups, setPaymentTermGroups] = useState<
    { group: string; terms: PaymentTermModel[] }[]
  >([]);
  const [paymentTerms, setPaymentTerms] = useState<PaymentTermModel[]>([]);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (mounted && salesId) {
      getDetail();
    }
  }, [mounted, salesId]);

  const getDetail = () => {
    getSalesDetail(salesId!).then((res: any) => {
      setSales(res.data);
      setIsEditable(
        res.data.status == "DRAFT" && res.data.document_type != "DELIVERY"
      );
    });
    getAllItems();
    getAllTaxes("");
    getAllWarehouses("");
    getPaymentTermGroups().then((res: any) => {
      let groups: { group: string; terms: PaymentTermModel[] }[] = [];
      let terms: PaymentTermModel[] = [];
      for (const key of Object.keys(res.data)) {
        groups.push({
          group: key,
          terms: res.data[key],
        });
        for (const term of res.data[key]) {
          terms.push(term);
        }
      }
      setPaymentTermGroups(groups);
      setPaymentTerms(terms);
    });
  };
  useEffect(() => {
    if (sales) {
      setPaymentPercentage(
        100 - ((sales?.paid ?? 0) / (sales?.total ?? 0)) * 100
      );
    }
  }, [sales]);
  useEffect(() => {
    if (product) {
    }
  }, [product]);

  const handleEditorChange = (e: any) => {
    setSales({
      ...sales!,
      term_condition: e.target.getContent(),
    });
    setIsEdited(true);
  };

  const saveSales = async (data: SalesModel) => {
    try {
      // if (!data.sales_number) {
      //   toast.error("Sales number is required");
      //   return;
      // }
      setLoading(true);
      let resp: any = await createSales(data);
      toast.success("sales created successfully");
      setShowCreateSales(false);
      // getAllContacts("");
      nav(`/sales/${resp.data.id}`);
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setLoading(false);
    }
  };

  const getAllItems = () => {
    getSalesItems(salesId!).then((res: any) => {
      let items = [];
      for (const item of res.data as SalesItemModel[]) {
        if (item.product?.prices) {
          item.availablePrices = [];
          let prices = groupBy(item.product.prices, "price_category_id");
          for (const key of Object.keys(prices)) {
            if (prices[key].length > 0) {
              item.availablePrices?.push({
                id: key,
                name: prices[key][0].price_category.name,
                prices: prices[key],
              });
            }
          }
        }
        items.push(item);
      }
      setItems(items);
    });
  };

  useEffect(() => {}, [items]);

  const getAllTaxes = (s: string) => {
    getTaxes({ page: 1, size: 10, search: s })
      .then((e: any) => {
        setTaxes(e.data.items);
      })
      .catch((error) => {
        toast.error(`${error}`);
      });
  };

  const getAllWarehouses = (s: string) => {
    getWarehouses({ page: 1, size: 10, search: s })
      .then((e: any) => {
        setWarehouses(e.data.items);
      })
      .catch((error) => {
        toast.error(`${error}`);
      });
  };

  const searchProduct = (e: string) => {
    getProducts({ page: 1, size: 10, search: e }).then((res: any) => {
      setProducts(res.data.items);
    });
  };
  const renderHeader = () => {
    switch (sales?.document_type) {
      case "INVOICE":
        return (
          <Badge
            icon={TbFileInvoice}
            className="flex gap-2 flex-row"
            color="green"
          >
            {t("invoice")}
          </Badge>
        );
        break;

      case "DELIVERY":
        return (
          <Badge
            icon={TbTruckDelivery}
            className="flex gap-2 flex-row"
            color="pink"
          >
            {t("delivery_order")}
          </Badge>
        );
        break;

      case "SALES_ORDER":
        return (
          <Badge icon={BsCart2} className="flex gap-2 flex-row" color="purple">
            {t("sales_order")}
          </Badge>
        );
        break;

      case "SALES_QUOTE":
        return (
          <Badge
            icon={PiQuotes}
            className="flex gap-2 flex-row"
            color="warning"
          >
            {t("sales_quote")}
          </Badge>
        );
        break;

      default:
        break;
    }
    return null;
  };

  const updateItem = (item: SalesItemModel) => {
    let data = items.find((c) => c.id === item.id);
    if (data) {
      salesUpdateItem(salesId!, item.id!, data).then((v: any) => {
        getSalesDetail(salesId!).then((res: any) => {
          setSales(res.data);
          getAllItems();
          setMountedAmount(false)
          setTimeout(() => {
            setMountedAmount(true)
          }, 100);
        });
      });
    }
  };
  return (
    <AdminLayout>
      <div className="p-4 h-[calc(100vh-80px)] overflow-y-auto">
        <div className="flex justify-between items-center">
          <div>
            <div className="w-fit">{renderHeader()}</div>
            <h1 className="text-3xl font-bold text-gray-700">
              {sales?.sales_number}
            </h1>
          </div>
          <div className="flex gap-2 items-center">
            <div>{sales?.status}</div>
            <Dropdown inline>
              {!sales?.published_at && sales?.document_type == "INVOICE" && (
                <Dropdown.Item
                  icon={IoPaperPlaneOutline}
                  onClick={() => {
                    setShowPostModal(true);
                  }}
                >
                  POST INVOICE
                </Dropdown.Item>
              )}
              {sales?.status != "DRAFT" && (
                <Dropdown.Item
                  icon={BsDownload}
                  onClick={() => {
                    setLoading(true);
                    downloadSalesPdf(sales?.id!)
                      .then((res: any) => {
                        const url = window.URL.createObjectURL(res);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = `${sales?.sales_number}.pdf`;
                        link.click();
                      })
                      .finally(() => {
                        setLoading(false);
                      });
                  }}
                >
                  DOWNLOAD {sales?.document_type?.toUpperCase()}
                </Dropdown.Item>
              )}
              {sales?.published_at && sales?.document_type == "INVOICE" && (
                <Dropdown.Item
                  icon={TbTruckReturn}
                  onClick={() => {
                    setShowReturn(true);
                  }}
                >
                  Create Return
                </Dropdown.Item>
              )}
              {!sales?.published_at && sales?.document_type != "INVOICE" && (
                <Dropdown.Item
                  icon={MdOutlinePublish}
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to release this document?"
                      )
                    ) {
                      setLoading(true);
                      publishSales(sales?.id!)
                        .then((res: any) => {
                          getDetail();
                        })
                        .catch((error) => {
                          toast.error(`${error}`);
                        })
                        .finally(() => {
                          setLoading(false);
                        });
                    }
                  }}
                >
                  RELEASE
                </Dropdown.Item>
              )}
              {(sales?.document_type == "SALES_QUOTE" ||
                sales?.document_type == "SALES_ORDER") && (
                <Dropdown.Item
                  icon={TbFileInvoice}
                  onClick={() => {
                    setTempSales({
                      ...sales,
                      document_type: "INVOICE",
                      sales_number: "",
                      notes: "",
                      status: "DRAFT",
                      ref_id: sales?.id,
                      ref_type: sales?.document_type,
                      sales_date: moment().toISOString(),
                      items: items,
                    });
                    setSalesTitle("Invoice");
                    setShowCreateSales(true);
                  }}
                >
                  Create Invoice
                </Dropdown.Item>
              )}
              {sales?.document_type == "INVOICE" && (
                <Dropdown.Item
                  icon={TbTruckDelivery}
                  onClick={() => {
                    setTempSales({
                      ...sales,
                      document_type: "DELIVERY",
                      sales_number: "",
                      notes: "",
                      status: "DRAFT",
                      ref_id: sales?.id,
                      ref_type: sales?.document_type,
                      sales_date: moment().toISOString(),
                      items: items,
                    });
                    setSalesTitle("Delivery Letter");
                    setShowCreateSales(true);
                  }}
                >
                  Create Delivery Letter
                </Dropdown.Item>
              )}
            </Dropdown>
            {isEdited && (
              <Button
                size="xs"
                onClick={() => {
                  setLoading(true);
                  updateSales(sales?.id!, sales!)
                    .then(() => {
                      getDetail();
                      setIsEdited(false);
                      toast.success("Sales updated successfully");
                    })
                    .catch((err) => toast.error(`${err}`))
                    .finally(() => setLoading(false));
                }}
              >
                Update
              </Button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-8 mt-4">
          <div className="flex flex-col space-y-4">
            <div>
              <Label>{t("date")}</Label>
              {isEditable ? (
                <Datepicker
                  value={moment(sales?.sales_date).toDate()}
                  onChange={(date) => {
                    setSales({
                      ...sales,
                      sales_date: moment(date).toISOString(),
                    });
                  }}
                  className="input-white"
                />
              ) : (
                <div className="text-data">
                  <Moment format="DD MMM YYYY">{sales?.sales_date}</Moment>
                </div>
              )}
            </div>
            <div>
              <Label>{t("due_date")}</Label>
              {isEditable ? (
                <Datepicker
                  value={moment(
                    sales?.due_date ?? moment().add(30, "days")
                  ).toDate()}
                  onChange={(date) => {
                    setSales({
                      ...sales!,
                      due_date: moment(date!).toISOString(),
                    });
                  }}
                  className="input-white"
                />
              ) : (
                <div className="text-data">
                  {sales?.due_date && (
                    <Moment format="DD MMM YYYY">{sales?.due_date}</Moment>
                  )}
                </div>
              )}
            </div>
            <div>
              <Label>{t("notes")}</Label>
              {isEditable ? (
                <Textarea
                  value={sales?.notes}
                  onChange={(e) => {
                    setSales({
                      ...sales,
                      notes: e.target.value,
                    });
                    setIsEdited(true);
                  }}
                  className="input-white"
                  style={{
                    backgroundColor: "white",
                  }}
                />
              ) : (
                <div className="text-data">{sales?.notes}</div>
              )}
            </div>
            {sales?.published_at && (
              <div className="flex flex-col">
                <Label>{t("released")}</Label>
                <div>
                  <Moment format="DD MMM YYYY, hh:mm">
                    {sales?.published_at}
                  </Moment>
                </div>
                <small>{sales?.published_by?.full_name}</small>
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-4">
            <div>
              <Label>{t("billed_to")}</Label>
              <div
                className="cursor-pointer p-2 hover:bg-gray-50"
                onClick={() => {
                  if (isEditable) {
                    setModalBilledOpen(true);
                  }
                }}
              >
                <div>{sales?.contact_data_parsed?.name}</div>
                <div>{sales?.contact_data_parsed?.address}</div>
                <div>
                  {sales?.contact_data_parsed?.phone}{" "}
                  {sales?.contact_data_parsed?.email && "-"}{" "}
                  {sales?.contact_data_parsed?.email}
                </div>
              </div>
            </div>
            <div>
              <Label>{t("shipped_to")}</Label>
              {sales?.delivery ? (
                <div
                  className="cursor-pointer p-2 hover:bg-gray-50"
                  onClick={() => {
                    if (isEditable) {
                      setModalShippingOpen(true);
                    }
                  }}
                >
                  <div>{sales?.delivery_data_parsed?.name}</div>
                  <div>{sales?.delivery_data_parsed?.address}</div>
                  <div>
                    {sales?.delivery_data_parsed?.phone}{" "}
                    {sales?.delivery_data_parsed?.email && "-"}{" "}
                    {sales?.delivery_data_parsed?.email}
                  </div>
                </div>
              ) : (
                <div
                  className="text-xs italic cursor-pointer"
                  onClick={() => {
                    setModalShippingOpen(true);
                  }}
                >
                  + Shipping Address
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between mt-4"></div>
        <div className="overflow-x-auto">
          <Table className=" overflow-x-auto border rounded-none" striped>
            <Table.Head>
              <Table.HeadCell style={{ width: "300px" }}>
                {t("item")}
              </Table.HeadCell>
              {/* {showWarehouse && (
                <Table.HeadCell style={{ width: "150px" }}>
                  {t('warehouse')}
                </Table.HeadCell>
              )} */}
              <Table.HeadCell style={{ width: "100px" }}>
                {t("qty")}
              </Table.HeadCell>
              <Table.HeadCell style={{ width: "120px" }}>
                {t("price")}
              </Table.HeadCell>
              <Table.HeadCell style={{ width: "40px" }}>
                {t("discount")}
              </Table.HeadCell>
              {showTax && (
                <Table.HeadCell style={{ width: "100px" }}>
                  {t("tax")}
                </Table.HeadCell>
              )}
              <Table.HeadCell style={{ width: "130px" }}>
                {t("amount")}
              </Table.HeadCell>
              <Table.HeadCell className="w-10">
                {/* <div className="flex justify-end">
                  <Dropdown
                    label=""
                    size="xs"
                    color="gray"
                    inline
                    dismissOnClick={false}
                  >
                    <Dropdown.Item>
                      <Checkbox
                        className="mr-2"
                        checked={showWarehouse}
                        onChange={(e) => setShowWarehouse(e.target.checked)}
                      />{" "}
                      Warehouse
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Checkbox
                        className="mr-2"
                        checked={showTax}
                        onChange={(e) => setShowTax(e.target.checked)}
                      />{" "}
                      Tax
                    </Dropdown.Item>
                  </Dropdown>
                </div> */}
              </Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {items.map((item) => (
                <TableRow
                  className=" dark:border-gray-700 dark:bg-gray-800 border"
                  key={item.id}
                >
                  <Table.Cell key={item.id}>
                    {isEditable ? (
                      <div>
                        <CreatableSelect
                          id="product"
                          value={{
                            label: item.product_id
                              ? item.product?.name
                              : item.description,
                            value: item.product_id,
                          }}
                          options={products.map((c) => ({
                            label: c.name!,
                            value: c.id!,
                          }))}
                          onChange={(e) => {
                            if (e?.value) {
                              setItems([
                                ...items.map((i) => {
                                  let prod = products.find(
                                    (c) => c.id === e!.value
                                  );
                                  if (i.id === item.id) {
                                    i.product_id = e!.value;
                                    i.product = prod;
                                    i.unit_price = prod?.price ?? 0;
                                    i.description = prod?.display_name ?? "";
                                  }
                                  return i;
                                }),
                              ]);
                              setTimeout(() => {
                                updateItem(item);
                              }, 300);
                            }
                          }}
                          isSearchable
                          onCreateOption={(e) => {
                            // setSelectedItem(item);
                            // setProduct({
                            //   name: e,
                            //   price: 0,
                            //   description: "",
                            //   product_images: [],
                            //   prices: [],
                            // });
                            // setShowModalProduct(true);
                            console.log("Create", e);
                            setItems([
                              ...items.map((i) => {
                                if (i.id === item.id) {
                                  i.description = e;
                                }
                                return i;
                              }),
                            ]);
                            setTimeout(() => {
                              updateItem(item);
                            }, 300);
                          }}
                          formatCreateLabel={(inputValue) =>
                            `Add Non Product "${inputValue}"`
                          }
                          onInputChange={(e) => {
                            if (e) {
                              searchProduct(e);
                            }
                          }}
                        />
                        {!item?.notes ? (
                          <div
                            className="text-xs italic cursor-pointer"
                            onClick={() => {
                              setSelectedItem(item);
                              setModalNoteOpen(true);
                            }}
                          >
                            + Notes
                          </div>
                        ) : (
                          <div
                            className="bg-gray-50 px-2 text-xs py-1 mt-2 rounded-lg cursor-pointer"
                            onClick={() => {
                              setItemNotes(item.notes ?? "");
                              setSelectedItem(item);
                              setModalNoteOpen(true);
                            }}
                          >
                            {item.notes}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <div className="text-data font-semibold">
                          <Link
                            to={
                              item.product_id
                                ? `/product/${item.product_id}`
                                : "#"
                            }
                          >
                            {item.description}
                          </Link>
                        </div>
                        <small className="text-data">{item.notes}</small>
                      </div>
                    )}
                  </Table.Cell>
                  {/* {showWarehouse && (
                    <Table.Cell valign="top">
                      <Select
                        isDisabled={!item.product_id}
                        value={{
                          label: item.warehouse?.name,
                          value: item.warehouse_id,
                        }}
                        options={warehouses.map((c) => ({
                          label: c.name!,
                          value: c.id!,
                        }))}
                        onChange={(val) => {
                          let seleted = warehouses.find(
                            (c) => c.id === val!.value
                          );
                          setItems([
                            ...items.map((i) => {
                              if (i.id === item.id) {
                                i.warehouse = seleted;
                                i.warehouse_id = val!.value;
                              }
                              return i;
                            }),
                          ]);
                        }}
                        inputValue={""}
                      />
                    </Table.Cell>
                  )} */}
                  <Table.Cell valign="top">
                    {isEditable ? (
                      <div className="flex w-full items-center">
                        <div className=" relative min-w-[32px]">
                          {mountedAmount && (
                            <CurrencyInput
                              className="rs-input !p-1.5 " style={{zIndex: 0}}
                              defaultValue={item.quantity ?? 0}
                              groupSeparator="."
                              decimalSeparator=","
                              onValueChange={(value, name, values) => {
                                setItems([
                                  ...items.map((i) => {
                                    if (i.id === item.id) {
                                      i.quantity = values?.float ?? 0;
                                    }
                                    return i;
                                  }),
                                ]);
                              }}
                              onKeyUp={(e) => {
                                if (e.key === "Enter") {
                                  updateItem(item);
                                }
                              }}
                              onBlur={(e) => {
                                updateItem(item);
                              }}
                            />
                          )}

                          {item.unit && (
                            <div className="absolute top-2.5 right-2 text-xs">
                              {item?.unit?.code}
                            </div>
                          )}
                        </div>
                        {(item.product?.units ?? []).length > 0 ? (
                          <Dropdown inline placement="bottom-end"  >
                            {(item.product?.units ?? []).map((t) => (
                              <Dropdown.Item
                                key={t.id}
                                onClick={() => {
                                  setItems([
                                    ...items.map((i) => {
                                      if (i.id === item.id) {
                                        i.unit_id = t.id;
                                        i.unit = t;
                                      }
                                      return i;
                                    }),
                                  ]);
                                  setTimeout(() => {
                                    updateItem(item);
                                  }, 300);
                                }}
                              >
                                <div
                                  className="flex justify-between items-center w-full"
                                  style={{ width: "100px" }}
                                >
                                  <span>{t.name}</span>
                                </div>
                              </Dropdown.Item>
                            ))}
                          </Dropdown>
                        ) : (
                          <div className="w-[38px]"></div>
                        )}
                      </div>
                    ) : (
                      <div className="text-data">
                        {money(item.quantity)} {item?.unit?.code}
                      </div>
                    )}
                  </Table.Cell>
                  <Table.Cell valign="top">
                    {isEditable ? (
                      <div className="flex gap-2 relative">
                        {mountedAmount && (
                        <CurrencyInput
                          className="rs-input !p-1.5"
                          defaultValue={item.unit_price ?? 0}
                          groupSeparator="."
                          decimalSeparator=","
                          onValueChange={(value, name, values) => {
                            setItems([
                              ...items.map((i) => {
                                if (i.id === item.id) {
                                  i.unit_price = values?.float ?? 0;
                                }
                                return i;
                              }),
                            ]);
                          }}
                          onKeyUp={(e) => {
                            if (e.key === "Enter") {
                              updateItem(item);
                            }
                          }}
                          onBlur={(e) => {
                            updateItem(item);
                          }}
                        />
                        )}
                        {(item.availablePrices ?? []).length > 0 && (
                          <div className="absolute top-2 right-2">
                            <Dropdown inline placement="bottom-end">
                              {(item.availablePrices ?? []).map((t) => (
                                <Dropdown.Item
                                  key={t.id}
                                  onClick={() => {
                                    let priceSelected = item.unit_price;
                                    for (const price of t.prices.sort(
                                      (a, b) => b.min_quantity - a.min_quantity
                                    )) {
                                      if (
                                        price.min_quantity <=
                                        item.quantity * (item.unit_value ?? 1)
                                      ) {
                                        priceSelected = price.amount;
                                        break;
                                      }
                                    }
                                    setItems([
                                      ...items.map((i) => {
                                        if (i.id === item.id) {
                                          i.unit_price = priceSelected;
                                        }
                                        return i;
                                      }),
                                    ]);
                                    setTimeout(() => {
                                      updateItem(item);
                                    }, 300);
                                  }}
                                >
                                  <div
                                    className="flex justify-between items-center w-full"
                                    style={{ width: "100px" }}
                                  >
                                    <span>{t.name}</span>
                                  </div>
                                </Dropdown.Item>
                              ))}
                            </Dropdown>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-data">{money(item.unit_price)}</div>
                    )}
                  </Table.Cell>
                  <Table.Cell valign="top">
                    {isEditable ? (
                      <div className="relative flex justify-end w-fit">
                        {mountedAmount && (
                          <CurrencyInput
                            className="rs-input !p-1.5 "
                            defaultValue={item.discount_percent ?? 0}
                            groupSeparator="."
                            decimalSeparator=","
                            onValueChange={(value, name, values) => {
                              setItems([
                                ...items.map((i) => {
                                  if (i.id === item.id) {
                                    i.discount_percent = values?.float ?? 0;
                                  }
                                  return i;
                                }),
                              ]);
                            }}
                            onKeyUp={(e) => {
                              if (e.key === "Enter") {
                                updateItem(item);
                              }
                            }}
                            onBlur={(e) => {
                              updateItem(item);
                            }}
                          />
                        )}

                        <span className="absolute top-2 right-1">%</span>
                      </div>
                    ) : (
                      item.discount_percent > 0 && (
                        <div className="text-data">
                          {money(item.discount_percent)}%
                        </div> // TODO: fix this
                      )
                    )}
                  </Table.Cell>
                  {showTax && (
                    <Table.Cell valign="top">
                      {isEditable ? (
                        <div className="flex min-h-[32px] items-center">
                          {item.tax?.amount ? `${item.tax?.amount}%` : "0%"}
                          <Dropdown inline placement="bottom-end">
                            {taxes.map((t) => (
                              <Dropdown.Item
                                key={t.id}
                                onClick={() => {
                                  setItems([
                                    ...items.map((i) => {
                                      if (i.id === item.id) {
                                        i.tax = t;
                                        i.tax_id = t.id;
                                      }
                                      return i;
                                    }),
                                  ]);

                                  setTimeout(() => {
                                    updateItem(item);
                                  }, 300);
                                }}
                              >
                                <div className="flex justify-between items-center w-full">
                                  <span>{t.code}</span>
                                  <span>{t.amount}%</span>
                                </div>
                              </Dropdown.Item>
                            ))}
                            <Dropdown.Item
                              onClick={() => {
                                setItems([
                                  ...items.map((i) => {
                                    if (i.id === item.id) {
                                      i.tax = undefined;
                                      i.tax_id = undefined;
                                    }
                                    return i;
                                  }),
                                ]);

                                setTimeout(() => {
                                  updateItem(item);
                                }, 300);
                              }}
                            >
                              <div
                                className="flex justify-between items-center w-full"
                                style={{ width: 100 }}
                              >
                                <span>Delete Tax</span>
                                <BsTrash className="text-red-500" />
                              </div>
                            </Dropdown.Item>
                          </Dropdown>
                        </div>
                      ) : (
                        (item?.tax?.amount ?? 0) > 0 && (
                          <div className="text-data">
                            {money(item?.tax?.amount)}%
                          </div> // TODO: fix this
                        )
                      )}
                    </Table.Cell>
                  )}

                  <Table.Cell valign="top">
                    <div className="text-data">{money(item.total ?? 0)}</div>
                  </Table.Cell>
                  <Table.Cell valign="top">
                    {isEditable && (
                      <div className="flex gap-2 min-h-[32px] items-center">
                        {/* {item.is_editing && (
                        <div
                          className="font-medium text-green-400 hover:text-green-600 text-xs hover:underline dark:text-green-500 cursor-pointer"
                          onClick={() => {
                            updateItem(item);
                          }}
                        >
                          Save
                        </div>
                      )} */}
                        <div
                          className="font-medium text-red-400 hover:text-red-600 text-xs hover:underline dark:text-red-500 cursor-pointer"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this item?"
                              )
                            ) {
                              salesDeleteItem(sales!.id!, item.id).then(() => {
                                getAllItems();
                              });
                            }
                          }}
                        >
                          Delete
                        </div>
                      </div>
                    )}
                  </Table.Cell>
                </TableRow>
              ))}
              {isEditable && (
                <Table.Row>
                  <Table.Cell colSpan={8}>
                    <div className="flex gap-2 justify-center item">
                      <button
                        className="flex gap-2 justify-center item"
                        onClick={() => {
                          salesAddItem(salesId!, {
                            description: "new item",
                            quantity: 1,
                            sales_id: salesId,
                          }).then((res: any) => {
                            let item = res.data;
                            setItems([...items, item]);
                            searchProduct("");
                          });
                        }}
                      >
                        <BsPlusCircle />
                        {t("add_item")}
                      </button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>
        <HR />
        {sales?.document_type !== "DELIVERY" && (
          <div className="grid grid-cols-2 gap-8 mt-4 ">
            <div className="flex flex-col gap-2 space-y-4 bg-gray-50 rounded-lg p-4">
              <div>
                <Label>{t("description")}</Label>
                {isEditable ? (
                  <Textarea
                    value={sales?.description}
                    onChange={(e) => {
                      setSales({
                        ...sales,
                        description: e.target.value,
                      });
                      setIsEdited(true);
                    }}
                    className="input-white"
                    style={{
                      backgroundColor: "white",
                    }}
                    placeholder={t("description")}
                    onBlur={() => {}}
                  />
                ) : (
                  <div className="text-data">{sales?.description}</div>
                )}
              </div>
              <div>
                <div>
                  <Label>{t("payment_terms")}</Label>
                </div>
                {isEditable ? (
                  <div>
                    <select
                      className="rs-input"
                      value={sales?.payment_terms_code}
                      onChange={(val: any) => {
                        setIsEdited(true);
                        let selected = paymentTerms.find(
                          (e) => e.code == val.target.value
                        );
                        if (selected) {
                          setSales({
                            ...sales,
                            payment_terms: JSON.stringify(selected),
                            payment_terms_code: selected.code,
                          });
                        }
                      }}
                    >
                      <option value={""}>{t("select_payment_terms")}</option>
                      {paymentTermGroups.map((pt) => (
                        <optgroup label={pt.group} key={pt.group}>
                          {pt.terms.map((t) => (
                            <option key={t.code} value={t.code}>
                              {t.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                    {sales?.payment_terms && (
                      <div className="p-2 rounded-lg bg-gray-50 text-xs">
                        {
                          (JSON.parse(sales?.payment_terms) as PaymentTermModel)
                            .description
                        }
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-data">
                    {sales?.payment_terms && (
                      <>
                        <strong>{JSON.parse(sales?.payment_terms).name}</strong>{" "}
                        {JSON.parse(sales?.payment_terms).description}{" "}
                      </>
                    )}
                  </div>
                )}
              </div>
              <div>
                <Label>{t("term_condition")}</Label>
                {isEditable ? (
                  <Editor
                    apiKey={process.env.REACT_APP_TINY_MCE_KEY}
                    init={{
                      plugins:
                        "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount ",
                      toolbar:
                        "closeButton saveButton aiButton | undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat ",

                      menubar:
                        "file edit view insert format tools table custom",
                      menu: {
                        custom: {
                          title: "Editor",
                          items: "closeButton saveButton",
                        },
                      },
                    }}
                    initialValue={sales?.term_condition ?? ""}
                    onChange={handleEditorChange}
                  />
                ) : (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: sales?.term_condition ?? "",
                    }}
                  />
                )}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{t("summary")}</h3>
              <div className="flex flex-col gap-2  border rounded-lg h-fit mb-4">
                <div className="w-full h-fit">
                  <table className="w-full">
                    <tr className="border-b last:border-b-0 hover:bg-gray-50 ">
                      <td className="py-2 px-4">
                        <strong className="text-sm">
                          {t("total_before_discount")}
                        </strong>
                      </td>
                      <td className="text-right px-4">
                        <span>{money(sales?.total_before_disc)}</span>
                      </td>
                    </tr>
                    <tr className="border-b last:border-b-0 hover:bg-gray-50 ">
                      <td className="py-2 px-4">
                        <strong className="text-sm">
                          {t("total_discount")}
                        </strong>
                      </td>
                      <td className="text-right px-4">
                        <span>{money(sales?.total_discount)}</span>
                      </td>
                    </tr>
                    <tr className="border-b last:border-b-0 hover:bg-gray-50 ">
                      <td className="py-2 px-4">
                        <strong className="text-sm">
                          {t("after_discount")}
                        </strong>
                      </td>
                      <td className="text-right px-4">
                        <span>{money(sales?.subtotal)}</span>
                      </td>
                    </tr>
                    <tr className="border-b last:border-b-0 hover:bg-gray-50 ">
                      <td className="py-2 px-4">
                        <strong className="text-sm">{t("total_tax")}</strong>
                      </td>
                      <td className="text-right px-4">
                        <span>{money(sales?.total_tax)}</span>
                      </td>
                    </tr>
                    <tr className="border-b last:border-b-0 hover:bg-gray-50 ">
                      <td className="py-2 px-4">
                        <strong className="text-lg">{t("total")}</strong>
                      </td>
                      <td className="text-right px-4">
                        <span className="text-lg">{money(sales?.total)}</span>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
              {sales?.document_type == "INVOICE" && (
                <div>
                  {sales?.status == "POSTED" && (
                    <>
                      <div className="flex justify-between items-center ">
                        <h3 className="font-semibold text-lg">
                          {t("payment_history")}
                        </h3>
                        {(sales.total ?? 0) - (sales.paid ?? 0) > 0 && (
                          <Button
                            size="xs"
                            color="green"
                            onClick={() => {
                              let payment_discount = 0;
                              let paymentTerm: PaymentTermModel;
                              if (sales?.payment_terms) {
                                paymentTerm = JSON.parse(
                                  sales?.payment_terms
                                ) as PaymentTermModel;
                                if (
                                  paymentTerm.discount_due_days &&
                                  moment(sales?.discount_due_date) <
                                    moment(sales?.published_at).add(
                                      paymentTerm.discount_due_days,
                                      "days"
                                    )
                                ) {
                                  setDiscountEnabled(true);
                                  payment_discount =
                                    paymentTerm.discount_amount ?? 0;
                                }
                              }
                              setPayment({
                                payment_date: new Date(),
                                sales_id: sales?.id!,
                                amount: sales?.total! - sales?.paid!,
                                notes: "",
                                payment_discount,
                                payment_method: "CASH",
                                payment_method_notes: "",
                              });
                              getAccounts({
                                page: 1,
                                size: 10,
                                cashflow_sub_group: "cash_bank",
                              }).then((e: any) => {
                                setAssets(e.data.items);
                              });
                            }}
                          >
                            + {t("payment")}
                          </Button>
                        )}
                      </div>
                      <div className="flex flex-col gap-2  border rounded-lg h-fit mb-4 mt-4">
                        <div className="w-full h-fit">
                          <table className="w-full">
                            {(sales?.sales_payments ?? []).map((payment) => (
                              <tr className="border-b last:border-b-0 hover:bg-gray-50 ">
                                <td className="py-2 px-4">
                                  <div className="flex flex-col">
                                    <strong className="text-sm">
                                      {payment.notes}
                                    </strong>
                                    <Moment
                                      className="text-xs"
                                      format="DD/MM/YYYY"
                                    >
                                      {payment?.payment_date}
                                    </Moment>
                                  </div>
                                </td>
                                <td className="text-right px-4">
                                  <span>{money(payment?.amount)}</span>
                                </td>
                              </tr>
                            ))}
                            <tr className="border-b last:border-b-0 hover:bg-gray-50 ">
                              <td className="py-2 px-4">
                                <div className="flex flex-col">
                                  <strong className="text-xl">
                                    {t("balance")}
                                  </strong>
                                </div>
                              </td>
                              <td className="text-right px-4">
                                <span className="text-xl">
                                  {money(
                                    (sales?.total ?? 0) - (sales?.paid ?? 0)
                                  ) == 0
                                    ? "PAID"
                                    : money(
                                        (sales?.total ?? 0) - (sales?.paid ?? 0)
                                      )}
                                </span>
                              </td>
                            </tr>
                          </table>
                        </div>
                      </div>
                    </>
                  )}
                  {sales?.payment_account?.type == "ASSET" && (
                    <div
                      className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                      role="alert"
                    >
                      <strong className="font-bold">Attention!</strong>
                      <span className="block sm:inline">
                        {" "}
                        This invoice is already paid in cash, you cannot add
                        payment
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Modal show={payment != undefined} onClose={() => setPayment(undefined)}>
        <Modal.Header>Payment</Modal.Header>
        <Modal.Body>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await paymentInvoice(sales!.id!, payment!);
                setPayment(undefined);
                toast.success("Payment added successfully");
                setTimeout(() => {
                  getDetail();
                }, 300);
              } catch (error) {
                toast.error(`${error}`);
              } finally {
                setLoading(false);
              }
            }}
          >
            <div className="flex flex-col space-y-4">
              <div>
                <label className="font-semibold text-sm">
                  {t("payment_date")}
                </label>
                <Datepicker
                  required
                  value={payment?.payment_date}
                  onChange={(val) => {
                    setPayment({
                      ...payment!,
                      payment_date: val!,
                    });
                  }}
                  className="input-white"
                />
              </div>
              <div>
                <label className="font-semibold text-sm">
                  {t("description")}
                </label>
                <Textarea
                  required
                  placeholder={t("description")}
                  value={payment?.notes}
                  onChange={(val) => {
                    setPayment({
                      ...payment!,
                      notes: val!.target.value,
                    });
                  }}
                  style={{ backgroundColor: "white" }}
                />
              </div>
              <div>
                <label className="font-semibold text-sm">
                  {t("payment_amount")}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <CurrencyInput
                      className="rs-input !p-1.5  text-xl"
                      required
                      value={payment?.amount}
                      groupSeparator="."
                      decimalSeparator=","
                      onValueChange={(_, __, val) => {
                        if (
                          (val?.float ?? 0) >
                          (sales?.total ?? 0) - (sales?.paid ?? 0)
                        ) {
                          toast.error("Payment amount is greater than balance");
                          return;
                        }
                        let balance =
                          ((val?.float ?? 0) /
                            ((sales?.total ?? 0) - (sales?.paid ?? 0))) *
                          100;
                        setPaymentPercentage(balance); // Update payment percentage
                        setPayment({
                          ...payment!,
                          amount: val?.float ?? 0,
                        });
                      }}
                      style={{ fontSize: "1.5rem" }}
                    />
                    <HelperText>
                      {t("balance")} :{" "}
                      {money(
                        (sales?.total ?? 0) -
                          (sales?.paid ?? 0) -
                          (payment?.amount ?? 0),
                        0
                      )}
                    </HelperText>
                  </div>
                  <div>
                    <div className="relative">
                      <CurrencyInput
                        className="rs-input !p-1.5  text-xl text-right !pr-6"
                        required
                        value={paymentPercentage}
                        // groupSeparator="."
                        // decimalSeparator=","
                        decimalsLimit={0}
                        onValueChange={(_, __, val) => {
                          if (
                            (val?.float ?? 0) >
                            100 -
                              ((sales?.paid ?? 0) / (sales?.total ?? 0)) * 100
                          )
                            return;
                          setPaymentPercentage(val?.float ?? 0);
                          let balance =
                            ((sales?.total ?? 0) * (val?.float ?? 0)) / 100;
                          setPayment({
                            ...payment!,
                            amount: balance,
                          });
                        }}
                        style={{ fontSize: "1.5rem" }}
                      />
                      <span className="absolute top-4 right-3">%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="font-semibold text-sm">{t("account")}</label>
                <Select
                  options={assets.map((a) => ({
                    label: a.name,
                    value: a.id,
                  }))}
                  value={{
                    label: assets.find(
                      (a) => a.id === payment?.asset_account_id
                    )?.name,
                    value: payment?.asset_account_id,
                  }}
                  onChange={(val) => {
                    setPayment({
                      ...payment!,
                      asset_account_id: val?.value!,
                    });
                  }}
                  onInputChange={(val) => {
                    getAccounts({
                      page: 1,
                      size: 10,
                      cashflow_sub_group: "cash_bank",
                      search: val,
                    }).then((e: any) => {
                      setAssets(e.data.items);
                    });
                  }}
                />
              </div>
              <div>
                <label className="font-semibold text-sm">
                  {t("payment_method")}
                </label>
                <Select
                  options={paymentMethods}
                  required
                  value={{
                    value: payment?.payment_method,
                    label: paymentMethods.find(
                      (m) => m.value === payment?.payment_method
                    )?.label,
                  }}
                  onChange={(val) => {
                    setPayment({
                      ...payment!,
                      payment_method: val?.value!,
                    });
                  }}
                />
              </div>
              <div>
                <label className="font-semibold text-sm">
                  {t("payment_method_notes")}
                </label>
                <Textarea
                  placeholder={t("payment_method_notes")}
                  value={payment?.payment_method_notes}
                  onChange={(val) => {
                    setPayment({
                      ...payment!,
                      payment_method_notes: val!.target.value,
                    });
                  }}
                  style={{ backgroundColor: "white" }}
                />
              </div>
              {discountEnabled && (
                <div>
                  <label className="font-semibold text-sm">
                    {t("payment_discount")}
                  </label>
                  <div className="relative w-fit">
                    <CurrencyInput
                      disabled={!discountEnabled}
                      className="rs-input !p-1.5 text-right !pr-6"
                      value={payment?.payment_discount ?? 0}
                      max={payment?.payment_discount ?? 0}
                      groupSeparator="."
                      decimalSeparator=","
                      onValueChange={(_, __, val) => {
                        setPayment({
                          ...payment!,
                          payment_discount: val?.float ?? 0,
                        });
                      }}
                      style={{ width: 60 }}
                    />
                    <span className="absolute top-1.5 right-2">%</span>
                  </div>
                </div>
              )}
              <div className="h-6"></div>
              <div className="w-full flex">
                <Button type="submit" className="w-full">
                  <IoPaperPlaneOutline className="mr-2" />
                  {t("send_payment")}
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <ModalProduct
        product={product}
        show={showModalProduct}
        setShow={setShowModalProduct}
        setProduct={setProduct}
        onCreateProduct={(product: ProductModel) => {
          setItems([
            ...items.map((i) => {
              if (i.id === selectedItem!.id) {
                i.product_id = product.id!;
                i.product = product;
                i.unit_price = product.price;
              }
              return i;
            }),
          ]);
        }}
      />
      <Modal show={modalNoteOpen} onClose={() => setModalNoteOpen(false)}>
        <Modal.Header>{selectedItem?.description}'s Notes</Modal.Header>
        <Modal.Body>
          <Textarea
            value={itemNotes}
            onChange={(val) => {
              setItemNotes(val.target.value);
              setItems([
                ...items.map((i) => {
                  if (i.id === selectedItem!.id) {
                    i.notes = val.target.value;
                  }
                  return i;
                }),
              ]);
            }}
            rows={9}
            placeholder="Item's Notes"
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="flex w-full justify-end">
            <Button
              onClick={() => {
                updateItem({
                  ...selectedItem!,
                  notes: itemNotes,
                });
                setModalNoteOpen(false);
                setTimeout(() => {
                  setItemNotes("");
                }, 300);
              }}
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
      <ModalListContact
        show={modalBilledOpen}
        onClose={() => setModalBilledOpen(false)}
        onSelect={(val) => {
          setModalBilledOpen(false);
          setSales({
            ...sales,
            contact_id: val.id,
            contact: val,
            contact_data: JSON.stringify(val),
            contact_data_parsed: val,
          });
          setIsEdited(true);
        }}
      />
      <ModalListContact
        show={modalShippingOpen}
        onClose={() => setModalShippingOpen(false)}
        onSelect={(val) => {
          setModalShippingOpen(false);
          setSales({
            ...sales,
            delivery_id: val.id,
            delivery: val,
            delivery_data: JSON.stringify(val),
            delivery_data_parsed: val,
          });
          setIsEdited(true);
        }}
      />
      {tempSales && (
        <ModalSales
          show={showCreateSales}
          onClose={() => setShowCreateSales(false)}
          title={salesTitle}
          sales={tempSales}
          setSales={setTempSales}
          saveSales={saveSales}
        />
      )}
      {sales && showPostModal && (
        <DrawerPostInvoice
          open={showPostModal}
          onClose={() => {
            setShowPostModal(false);
            setTimeout(() => {
              getDetail();
            }, 300);
          }}
          sales={{
            ...sales!,
            items: items,
          }}
          setSales={(val) => {
            setSales(val);
            setItems(val.items ?? []);
          }}
        />
      )}
      <ModalSalesReturn
        show={showReturn}
        onClose={() => setShowReturn(false)}
        salesList={[]}
        sales={sales}
        onInputChange={(val) => {}}
        onSuccess={(val) => {
          nav(`/sales-return/${val.id}`);
        }}
        setSales={(val) => {
          // setSelectedPurchase(val);
        }}
        hideSelectSales
      />
    </AdminLayout>
  );
};
export default SalesDetail;
