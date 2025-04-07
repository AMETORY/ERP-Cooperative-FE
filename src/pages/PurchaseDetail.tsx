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
  TextInput,
} from "flowbite-react";
import moment from "moment";
import { useContext, useEffect, useState, type FC } from "react";
import CurrencyInput from "react-currency-input-field";
import toast from "react-hot-toast";
import { BsAirplane, BsCart2, BsPlusCircle, BsTrash } from "react-icons/bs";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import AdminLayout from "../components/layouts/admin";
// import ModalListContact from "../components/ModalListContact";
import ModalProduct from "../components/ModalProduct";
import ModalPurchase from "../components/ModalPurchase";
import { LoadingContext } from "../contexts/LoadingContext";
import { PaymentTermModel } from "../models/payment_term";
import { ProductModel } from "../models/product";
import {
  PurchaseItemModel,
  PurchaseModel,
  PurchasePaymentModel,
} from "../models/purchase";
import { TaxModel } from "../models/tax";
import { WarehouseModel } from "../models/warehouse";
import { getPaymentTermGroups } from "../services/api/paymentTermApi";
import { getProducts } from "../services/api/productApi";
import {
  createPurchase,
  getPurchaseDetail,
  getPurchaseItems,
  paymentPurchase,
  publishPurchase,
  purchaseAddItem,
  purchaseDeleteItem,
  purchaseUpdateItem,
  updatePurchase,
} from "../services/api/purchaseApi";
import { getTaxes } from "../services/api/taxApi";
import { getWarehouses } from "../services/api/warehouseApi";
import { groupBy, money } from "../utils/helper";
import DrawerPostInvoice from "../components/DrawerPostInvoice";
import { FaPaperPlane } from "react-icons/fa6";
import { IoPaperPlaneOutline } from "react-icons/io5";
import { TbFileInvoice, TbTruckDelivery } from "react-icons/tb";
import { MdOutlinePublish } from "react-icons/md";
import { PiQuotes } from "react-icons/pi";
import Moment from "react-moment";
import DrawerPostPurchase from "../components/DrawerPostPurchase";
import { AccountModel } from "../models/account";
import { getAccounts } from "../services/api/accountApi";
import { paymentMethods } from "../utils/constants";

interface PurchaseDetailProps {}

const PurchaseDetail: FC<PurchaseDetailProps> = ({}) => {
  const nav = useNavigate();
  const { loading, setLoading } = useContext(LoadingContext);
  const { purchaseId } = useParams();
  const [mounted, setMounted] = useState(false);
  const [purchase, setPurchase] = useState<PurchaseModel>();
  const [showWarehouse, setShowWarehouse] = useState(true);
  const [showTax, setShowTax] = useState(true);
  const [items, setItems] = useState<PurchaseItemModel[]>([]);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [product, setProduct] = useState<ProductModel>();
  const [selectedItem, setSelectedItem] = useState<PurchaseItemModel>();
  const [showModalProduct, setShowModalProduct] = useState(false);
  const [taxes, setTaxes] = useState<TaxModel[]>([]);
  const [modalNoteOpen, setModalNoteOpen] = useState(false);
  const [modalShippingOpen, setModalShippingOpen] = useState(false);
  const [warehouses, setWarehouses] = useState<WarehouseModel[]>([]);
  const [itemNotes, setItemNotes] = useState("");
  const [isEdited, setIsEdited] = useState(false);
  const [purchaseTitle, setPurchaseTitle] = useState("");
  const [tempPurchase, setTempPurchase] = useState<PurchaseModel>();
  const [showCreatePurchase, setShowCreatePurchase] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [payment, setPayment] = useState<PurchasePaymentModel>();
  const [discountEnabled, setDiscountEnabled] = useState(false);
  const [assets, setAssets] = useState<AccountModel[]>([]);
  const [paymentPercentage, setPaymentPercentage] = useState(100);
  const [balance, setBalance] = useState(0);

  const [paymentTermGroups, setPaymentTermGroups] = useState<
    { group: string; terms: PaymentTermModel[] }[]
  >([]);
  const [paymentTerms, setPaymentTerms] = useState<PaymentTermModel[]>([]);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (mounted && purchaseId) {
      getDetail();
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
    }
  }, [mounted, purchaseId]);

  const getDetail = () => {
    getPurchaseDetail(purchaseId!).then((res: any) => {
      setPurchase(res.data);
      setIsEditable(res.data.status == "DRAFT");
    });
  };
  useEffect(() => {
    if (purchase) {
    }
  }, [purchase]);
  useEffect(() => {
    if (product) {
    }
  }, [product]);

  const handleEditorChange = (e: any) => {
    setPurchase({
      ...purchase!,
      term_condition: e.target.getContent(),
    });
    setIsEdited(true);
  };

  const savePurchase = async (data: PurchaseModel) => {
    try {
      if (!data.purchase_number) {
        toast.error("Purchase number is required");
        return;
      }
      setLoading(true);
      let resp: any = await createPurchase(data);
      toast.success("purchase created successfully");
      setShowCreatePurchase(false);
      // getAllContacts("");
      nav(`/purchase/${resp.data.id}`);
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setLoading(false);
    }
  };

  const getAllItems = () => {
    getPurchaseItems(purchaseId!).then((res: any) => {
      let items = [];
      for (const item of res.data as PurchaseItemModel[]) {
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
    switch (purchase?.document_type) {
      case "BILL":
        return (
          <Badge
            icon={TbFileInvoice}
            className="flex gap-2 flex-row"
            color="green"
          >
            Purchase
          </Badge>
        );
        break;

      case "PURCHASE_ORDER":
        return (
          <Badge icon={BsCart2} className="flex gap-2 flex-row" color="purple">
            Purchase Order
          </Badge>
        );
        break;

      default:
        break;
    }
    return null;
  };

  const updateItem = (item: PurchaseItemModel) => {
    let data = items.find((c) => c.id === item.id);
    if (data) {
      purchaseUpdateItem(purchaseId!, item.id!, data).then((v: any) => {
        getPurchaseDetail(purchaseId!).then((res: any) => {
          setPurchase(res.data);
        });
        setItems([
          ...items.map((i) => {
            if (i.id === item.id) {
              return v.data;
            }
            return i;
          }),
        ]);
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
              {purchase?.purchase_number}
            </h1>
          </div>
          <div className="flex gap-2 items-center">
            <div>{purchase?.status}</div>
            <Dropdown inline>
              {!purchase?.published_at && purchase?.document_type == "BILL" && (
                <Dropdown.Item
                  icon={IoPaperPlaneOutline}
                  onClick={() => {
                    setShowPostModal(true);
                  }}
                >
                  POST INVOICE
                </Dropdown.Item>
              )}
              {!purchase?.published_at && purchase?.document_type != "BILL" && (
                <Dropdown.Item
                  icon={MdOutlinePublish}
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to release this document?"
                      )
                    ) {
                      setLoading(true);
                      publishPurchase(purchase?.id!)
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
              {purchase?.document_type == "PURCHASE_ORDER" && (
                <Dropdown.Item
                  icon={TbFileInvoice}
                  onClick={() => {
                    setTempPurchase({
                      ...purchase,
                      document_type: "BILL",
                      purchase_number: "",
                      notes: "",
                      status: "DRAFT",
                      ref_id: purchase?.id,
                      ref_type: purchase?.document_type,
                      purchase_date: moment().toISOString(),
                      items: items,
                    });
                    setPurchaseTitle("Purchase");
                    setShowCreatePurchase(true);
                  }}
                >
                  Create Invoice
                </Dropdown.Item>
              )}
              {/* {purchase?.document_type == "BILL" && (
                <Dropdown.Item icon={TbTruckDelivery}>
                  Create Delivery Letter
                </Dropdown.Item>
              )} */}
            </Dropdown>
            {isEdited && (
              <Button
                size="xs"
                onClick={() => {
                  setLoading(true);
                  updatePurchase(purchase?.id!, purchase!)
                    .then(() => {
                      getDetail();
                      setIsEdited(false);
                      toast.success("Purchase updated successfully");
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
              <Label>Date</Label>
              {isEditable ? (
                <Datepicker
                  value={moment(purchase?.purchase_date).toDate()}
                  onChange={(date) => {
                    setPurchase({
                      ...purchase!,
                      purchase_date: moment(date).toISOString(),
                    });
                  }}
                  className="input-white"
                />
              ) : (
                <div className="text-data">
                  <Moment format="DD MMM YYYY">
                    {purchase?.purchase_date}
                  </Moment>
                </div>
              )}
            </div>
            <div>
              <Label>Notes</Label>
              {isEditable ? (
                <Textarea
                  value={purchase?.notes}
                  onChange={(e) => {
                    setPurchase({
                      ...purchase!,
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
                <div className="text-data">{purchase?.notes}</div>
              )}
            </div>
          </div>
          <div className="flex flex-col space-y-4">
            <div>
              <Label>Billed To</Label>
              <div>{purchase?.contact_data_parsed?.name}</div>
              <div>{purchase?.contact_data_parsed?.address}</div>
              <div>
                {purchase?.contact_data_parsed?.phone}{" "}
                {purchase?.contact_data_parsed?.email && "-"}{" "}
                {purchase?.contact_data_parsed?.email}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between mt-4"></div>
        <div className="overflow-x-auto">
          <Table className=" overflow-x-auto border rounded-none" hoverable>
            <Table.Head>
              <Table.HeadCell style={{ width: "300px" }}>Item</Table.HeadCell>
              {/* {showWarehouse && (
                <Table.HeadCell style={{ width: "150px" }}>
                  Warehouse
                </Table.HeadCell>
              )} */}
              <Table.HeadCell style={{ width: "100px" }}>Qty</Table.HeadCell>
              <Table.HeadCell style={{ width: "120px" }}>Price</Table.HeadCell>
              <Table.HeadCell style={{ width: "40px" }}>Disc</Table.HeadCell>
              {showTax && (
                <Table.HeadCell style={{ width: "100px" }}>Tax</Table.HeadCell>
              )}
              <Table.HeadCell style={{ width: "130px" }}>Amount</Table.HeadCell>
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
                        {item.is_cost ? (
                          <TextInput
                            className="input-white"
                            value={item.description}
                            onChange={(e) => {
                              setItems([
                                ...items.map((i) => {
                                  if (i.id === item.id) {
                                    i.description = e.target.value;
                                  }
                                  return i;
                                }),
                              ]);
                            }}
                          />
                        ) : (
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
                        )}

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
                          {item.description}
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
                          <CurrencyInput
                            className="rs-input !p-1.5 "
                            value={item.quantity ?? 0}
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
                          />
                          {item.unit && (
                            <div className="absolute top-2.5 right-2 text-xs">
                              {item?.unit?.code}
                            </div>
                          )}
                        </div>
                        {(item.product?.units ?? []).length > 0 ? (
                          <Dropdown inline placement="bottom-end">
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
                        <CurrencyInput
                          className="rs-input !p-1.5"
                          value={item.unit_price ?? 0}
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
                        />
                      </div>
                    ) : (
                      <div className="text-data">{money(item.unit_price)}</div>
                    )}
                  </Table.Cell>
                  <Table.Cell valign="top">
                    {isEditable && !item.is_cost ? (
                      <div className="relative flex justify-end w-fit">
                        <CurrencyInput
                          className="rs-input !p-1.5 "
                          value={item.discount_percent ?? 0}
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
                        />

                        <span className="absolute top-2 right-1">%</span>
                      </div>
                    ) : (
                      item.discount_percent > 0 && (
                        <div className="text-data">
                          {money(item.discount_percent)}%
                        </div>
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
                              purchaseDeleteItem(purchase!.id!, item.id).then(
                                () => {
                                  getAllItems();
                                }
                              );
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
                    <div className="flex gap-2 justify-center items-center">
                      <button
                        className="flex gap-2 justify-center items-center hover:bg-gray-100 py-2 px-4 rounded-lg"
                        onClick={() => {
                          purchaseAddItem(purchaseId!, {
                            description: "new item",
                            quantity: 1,
                            purchase_id: purchaseId,
                          }).then((res: any) => {
                            let item = res.data;
                            setItems([...items, item]);
                            searchProduct("");
                          });
                        }}
                      >
                        <BsPlusCircle />
                        Add Item
                      </button>
                      <button
                        className="flex gap-2 justify-center items-center hover:bg-gray-100 py-2 px-4 rounded-lg"
                        onClick={() => {
                          purchaseAddItem(purchaseId!, {
                            description: "Biaya Angkut",
                            quantity: 1,
                            is_cost: true,
                            purchase_id: purchaseId,
                          }).then((res: any) => {
                            let item = res.data;
                            setItems([...items, item]);
                            searchProduct("");
                          });
                        }}
                      >
                        <BsPlusCircle />
                        Add Cost
                      </button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>
        <HR />
        <div className="grid grid-cols-2 gap-8 mt-4 ">
          <div className="flex flex-col gap-2 space-y-4 bg-gray-50 rounded-lg p-4">
            <div>
              <Label>Description</Label>
              {isEditable ? (
                <Textarea
                  value={purchase?.description}
                  onChange={(e) => {
                    setPurchase({
                      ...purchase!,
                      description: e.target.value,
                    });
                    setIsEdited(true);
                  }}
                  className="input-white"
                  style={{
                    backgroundColor: "white",
                  }}
                  placeholder="Purchase Description"
                  onBlur={() => {}}
                />
              ) : (
                <div className="text-data">{purchase?.description}</div>
              )}
            </div>
            <div>
              <Label>Payment Term</Label>
              {isEditable ? (
                <div>
                  <select
                    className="rs-input"
                    value={purchase?.payment_terms_code}
                    onChange={(val: any) => {
                      setIsEdited(true);
                      let selected = paymentTerms.find(
                        (e) => e.code == val.target.value
                      );
                      if (selected) {
                        setPurchase({
                          ...purchase!,
                          payment_terms: JSON.stringify(selected),
                          payment_terms_code: selected.code,
                        });
                      }
                    }}
                  >
                    <option value={""}>Select Payment Term</option>
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
                  {purchase?.payment_terms && (
                    <div className="p-2 rounded-lg bg-gray-50 text-xs">
                      {
                        (
                          JSON.parse(
                            purchase?.payment_terms
                          ) as PaymentTermModel
                        ).description
                      }
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-data">
                  {purchase?.payment_terms && (
                    <>
                      <strong>
                        {JSON.parse(purchase?.payment_terms).name}
                      </strong>{" "}
                      {JSON.parse(purchase?.payment_terms).description}{" "}
                    </>
                  )}
                </div>
              )}
            </div>
            <div>
              <Label>Term & Condition</Label>
              {isEditable ? (
                <Editor
                  apiKey={process.env.REACT_APP_TINY_MCE_KEY}
                  init={{
                    plugins:
                      "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount ",
                    toolbar:
                      "closeButton saveButton aiButton | undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat ",

                    menubar: "file edit view insert format tools table custom",
                    menu: {
                      custom: {
                        title: "Editor",
                        items: "closeButton saveButton",
                      },
                    },
                  }}
                  initialValue={purchase?.term_condition ?? ""}
                  onChange={handleEditorChange}
                />
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: purchase?.term_condition ?? "",
                  }}
                />
              )}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Summary</h3>
            <div className="flex flex-col gap-2  border rounded-lg h-fit mb-4">
              <div className="w-full h-fit">
                <table className="w-full">
                  <tr className="border-b last:border-b-0 hover:bg-gray-50 ">
                    <td className="py-2 px-4">
                      <strong className="text-sm">Sub Total</strong>
                    </td>
                    <td className="text-right px-4">
                      <span>{money(purchase?.total_before_disc)}</span>
                    </td>
                  </tr>
                  <tr className="border-b last:border-b-0 hover:bg-gray-50 ">
                    <td className="py-2 px-4">
                      <strong className="text-sm">Total Discount</strong>
                    </td>
                    <td className="text-right px-4">
                      <span>{money(purchase?.total_discount)}</span>
                    </td>
                  </tr>
                  <tr className="border-b last:border-b-0 hover:bg-gray-50 ">
                    <td className="py-2 px-4">
                      <strong className="text-sm">After Discount</strong>
                    </td>
                    <td className="text-right px-4">
                      <span>{money(purchase?.subtotal)}</span>
                    </td>
                  </tr>
                  <tr className="border-b last:border-b-0 hover:bg-gray-50 ">
                    <td className="py-2 px-4">
                      <strong className="text-sm">Total Tax</strong>
                    </td>
                    <td className="text-right px-4">
                      <span>{money(purchase?.total_tax)}</span>
                    </td>
                  </tr>
                  <tr className="border-b last:border-b-0 hover:bg-gray-50 ">
                    <td className="py-2 px-4">
                      <strong className="text-lg">Total</strong>
                    </td>
                    <td className="text-right px-4">
                      <span className="text-lg">{money(purchase?.total)}</span>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            {purchase?.document_type == "BILL" && (
              <div>
                {purchase?.status == "POSTED" && (
                  <>
                    <div className="flex justify-between items-center ">
                      <h3 className="font-semibold text-lg">Payment History</h3>
                      {(purchase.total ?? 0) - (purchase.paid ?? 0) > 0 && (
                        <Button
                          size="xs"
                          color="green"
                          onClick={() => {
                            let payment_discount = 0;
                            let paymentTerm: PaymentTermModel;
                            if (purchase?.payment_terms) {
                              paymentTerm = JSON.parse(
                                purchase?.payment_terms
                              ) as PaymentTermModel;
                              if (
                                paymentTerm.discount_due_days &&
                                moment(purchase?.discount_due_date) <
                                  moment(purchase?.published_at).add(
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
                              purchase_id: purchase?.id!,
                              amount:
                                (purchase?.total ?? 0) - (purchase?.paid ?? 0),
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
                          + Payment
                        </Button>
                      )}
                    </div>
                    <div className="flex flex-col gap-2  border rounded-lg h-fit mb-4 mt-4">
                      <div className="w-full h-fit">
                        <table className="w-full">
                          {(purchase?.purchase_payments ?? []).map(
                            (payment) => (
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
                            )
                          )}
                          <tr className="border-b last:border-b-0 hover:bg-gray-50 ">
                            <td className="py-2 px-4">
                              <div className="flex flex-col">
                                <strong className="text-xl">Balance</strong>
                              </div>
                            </td>
                            <td className="text-right px-4">
                              <span className="text-xl">
                                {money(
                                  (purchase?.total ?? 0) - (purchase?.paid ?? 0)
                                ) == 0
                                  ? "PAID"
                                  : money(
                                      (purchase?.total ?? 0) -
                                        (purchase?.paid ?? 0)
                                    )}
                              </span>
                            </td>
                          </tr>
                        </table>
                      </div>
                    </div>
                  </>
                )}
                {purchase?.payment_account?.type == "ASSET" && (
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
      </div>
      <Modal show={payment != undefined} onClose={() => setPayment(undefined)}>
        <Modal.Header>Payment</Modal.Header>
        <Modal.Body>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await paymentPurchase(purchaseId!, payment!);
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
                <label className="font-semibold text-sm">Payment Date</label>
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
                <label className="font-semibold text-sm">Description</label>
                <Textarea
                  required
                  placeholder="Description"
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
                <label className="font-semibold text-sm">Payment Amount</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <CurrencyInput
                      className="rs-input !p-1.5  text-xl"
                      required
                      value={payment?.amount ?? 0}
                      groupSeparator="."
                      decimalSeparator=","
                      onValueChange={(_, __, val) => {
                        if (
                          (val?.float ?? 0) >
                          (purchase?.total ?? 0) - (purchase?.paid ?? 0)
                        ) {
                          toast.error("Payment amount is greater than balance");
                          return;
                        }
                        let balance =
                          ((val?.float ?? 0) /
                            ((purchase?.total ?? 0) - (purchase?.paid ?? 0))) *
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
                      Balance :{" "}
                      {money(
                        (purchase?.total ?? 0) -
                          (purchase?.paid ?? 0) -
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
                              ((purchase?.paid ?? 0) / (purchase?.total ?? 0)) *
                                100
                          )
                            return;
                          setPaymentPercentage(val?.float ?? 0);
                          let balance =
                            ((purchase?.total ?? 0) * (val?.float ?? 0)) / 100;
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
                <label className="font-semibold text-sm">Account</label>
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
                <label className="font-semibold text-sm">Payment Method</label>
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
                  Payment Method Notes
                </label>
                <Textarea
                  placeholder="Payment Method Notes"
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
                    Payment Discount
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
                  Send Payment
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
      {/* <ModalListContact
        show={modalShippingOpen}
        onClose={() => setModalShippingOpen(false)}
        onSelect={(val) => {
          setModalShippingOpen(false);
          setPurchase({
            ...purchase,
            delivery_id: val.id,
            delivery: val,
            delivery_data: JSON.stringify(val),
            delivery_data_parsed: val,
          });
          setIsEdited(true);
        }}
      /> */}
      {tempPurchase && (
        <ModalPurchase
          show={showCreatePurchase}
          onClose={() => setShowCreatePurchase(false)}
          title={purchaseTitle}
          purchase={tempPurchase}
          setPurchase={setTempPurchase}
          savePurchase={savePurchase}
        />
      )}
      {purchase && (
        <DrawerPostPurchase
          open={showPostModal}
          onClose={() => {
            setShowPostModal(false);
            setTimeout(() => {
              getDetail();
            }, 300);
          }}
          purchase={{
            ...purchase!,
            items: items,
          }}
          setPurchase={(val) => {
            setPurchase(val);
            setItems(val.items ?? []);
          }}
        />
      )}
    </AdminLayout>
  );
};
export default PurchaseDetail;
