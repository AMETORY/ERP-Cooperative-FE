import {
  Checkbox,
  Datepicker,
  Dropdown,
  Label,
  Table,
  TableRow,
  Textarea,
  TextInput,
} from "flowbite-react";
import moment from "moment";
import { useEffect, useState, type FC } from "react";
import toast from "react-hot-toast";
import { BsPlusCircle, BsTrash } from "react-icons/bs";
import { useParams } from "react-router-dom";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import AdminLayout from "../components/layouts/admin";
import ModalProduct from "../components/ModalProduct";
import { ProductModel } from "../models/product";
import { SalesItemModel, SalesModel } from "../models/sales";
import { TaxModel } from "../models/tax";
import { getProducts } from "../services/api/productApi";
import {
  getSalesDetail,
  getSalesItems,
  salesAddItem,
  salesUpdateItem,
} from "../services/api/salesApi";
import { getTaxes } from "../services/api/taxApi";
import { groupBy, money } from "../utils/helper";
import { getWarehouses } from "../services/api/warehouseApi";
import { WarehouseModel } from "../models/warehouse";
import CurrencyInput from "react-currency-input-field";

interface SalesDetailProps {}

const SalesDetail: FC<SalesDetailProps> = ({}) => {
  const { salesId } = useParams();
  const [mounted, setMounted] = useState(false);
  const [sales, setSales] = useState<SalesModel>();
  const [showWarehouse, setShowWarehouse] = useState(true);
  const [showTax, setShowTax] = useState(true);
  const [items, setItems] = useState<SalesItemModel[]>([]);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [product, setProduct] = useState<ProductModel>();
  const [selectedItem, setSelectedItem] = useState<SalesItemModel>();
  const [showModalProduct, setShowModalProduct] = useState(false);
  const [taxes, setTaxes] = useState<TaxModel[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseModel[]>([]);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (mounted && salesId) {
      getSalesDetail(salesId).then((res: any) => {
        setSales(res.data);
      });
    }
  }, [mounted, salesId]);
  useEffect(() => {
    if (sales) {
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
      getAllTaxes("");
      getAllWarehouses("");
    }
  }, [sales]);
  useEffect(() => {
    if (product) {
    }
  }, [product]);

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

  const updateItem = (item: SalesItemModel) => {
    let data = items.find((c) => c.id === item.id);
    if (data) {
      salesUpdateItem(salesId!, item.id!, data).then((v: any) => {
        getSalesDetail(salesId!).then((res: any) => {
          setSales(res.data);
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
        <h1 className="text-3xl font-bold text-gray-700">
          {sales?.sales_number}
        </h1>
        <div className="grid grid-cols-3 gap-8 mt-4">
          <div className="flex flex-col space-y-4">
            <div>
              <Label>Date</Label>
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
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                value={sales?.notes}
                onChange={(e) => {
                  setSales({
                    ...sales,
                    notes: e.target.value,
                  });
                }}
                className="input-white"
                style={{
                  backgroundColor: "white",
                }}
              />
            </div>
          </div>
          <div className="flex flex-col space-y-4">
            <div>
              <Label>Billed To</Label>
              <div>{sales?.contact_data_parsed?.name}</div>
              <div>{sales?.contact_data_parsed?.address}</div>
              <div>
                {sales?.contact_data_parsed?.phone}{" "}
                {sales?.contact_data_parsed?.email && "-"}{" "}
                {sales?.contact_data_parsed?.email}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between mt-4"></div>
        <div className="overflow-x-auto">
          <Table className=" overflow-x-auto border rounded-none" hoverable>
            <Table.Head>
              <Table.HeadCell style={{ width: "300px" }}>Item</Table.HeadCell>
              {showWarehouse && (
                <Table.HeadCell style={{ width: "150px" }}>
                  Warehouse
                </Table.HeadCell>
              )}
              <Table.HeadCell style={{ width: "100px" }}>Qty</Table.HeadCell>
              <Table.HeadCell style={{ width: "120px" }}>Price</Table.HeadCell>
              <Table.HeadCell style={{ width: "100px" }}>Disc</Table.HeadCell>
              {showTax && (
                <Table.HeadCell style={{ width: "100px" }}>Tax</Table.HeadCell>
              )}
              <Table.HeadCell style={{ width: "130px" }}>Amount</Table.HeadCell>
              <Table.HeadCell className="w-10">
                <div className="flex justify-end">
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
                </div>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {items.map((item) => (
                <TableRow
                  className=" dark:border-gray-700 dark:bg-gray-800 border"
                  key={item.id}
                >
                  <Table.Cell key={item.id}>
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
                                i.is_editing = true;
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
                              i.is_editing = true;
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
                  </Table.Cell>
                  {showWarehouse && (
                    <Table.Cell>
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
                                i.is_editing = true;
                              }
                              return i;
                            }),
                          ]);
                        }}
                        inputValue={""}
                      />
                    </Table.Cell>
                  )}
                  <Table.Cell>
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
                              i.is_editing = true;
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
                  </Table.Cell>
                  <Table.Cell>
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
                                i.is_editing = true;
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
                                    if (price.min_quantity <= item.quantity) {
                                      priceSelected = price.amount;
                                      break;
                                    }
                                  }
                                  setItems([
                                    ...items.map((i) => {
                                      if (i.id === item.id) {
                                        i.unit_price = priceSelected;
                                        i.is_editing = true;
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
                  </Table.Cell>
                  <Table.Cell>
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
                                i.is_editing = true;
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
                  </Table.Cell>
                  {showTax && (
                    <Table.Cell>
                      {/* <Select
                             value={selectedItem?.tax}
                             onChange={(val) => {
                               setItems([
                                 ...items.map((i) => {
                                   if (i.id === item.id) {
                                     i.tax = val!;
                                     i.tax_id = val!.id;
                                     i.is_editing = true;
                                   }
                                   return i;
                                 }),
                               ]);
                             }}
                             options={taxes}
                             formatOptionLabel={(option: any) => (
                               <div className="flex flex-row gap-2  items-center ">
                                 {option.code}
                                 <span>{option.amount}%</span>
                               </div>
                             )}
                             inputValue={""}
                           /> */}
                      <div className="flex">
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
                                      i.is_editing = true;
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
                                    i.is_editing = true;
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
                    </Table.Cell>
                  )}

                  <Table.Cell>{money(item.total ?? 0)}</Table.Cell>
                  <Table.Cell>
                    <div className="flex gap-2">
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
                        onClick={() => {}}
                      >
                        Delete
                      </div>
                    </div>
                  </Table.Cell>
                </TableRow>
              ))}
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
                      Add Item
                    </button>
                  </div>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
        <div className="grid grid-cols-2 gap-8 mt-4 ">
          <div className="flex flex-col gap-2"></div>
          <div className="flex flex-col gap-2  border rounded-lg ">
            <table>
              <tr className="border-b last:border-b-0 hover:bg-gray-50 ">
                <td className="py-2 px-4">
                  <strong className="text-sm">Sub Total</strong>
                </td>
                <td className="text-right px-4">
                  <span>{money(sales?.total_before_disc)}</span>
                </td>
              </tr>
              <tr className="border-b last:border-b-0 hover:bg-gray-50 ">
                <td className="py-2 px-4">
                  <strong className="text-sm">Total Discount</strong>
                </td>
                <td className="text-right px-4">
                  <span>{money(sales?.total_discount)}</span>
                </td>
              </tr>
              <tr className="border-b last:border-b-0 hover:bg-gray-50 ">
                <td className="py-2 px-4">
                  <strong className="text-sm">Total Tax</strong>
                </td>
                <td className="text-right px-4">
                  <span>{money(sales?.total_tax)}</span>
                </td>
              </tr>
              <tr className="border-b last:border-b-0 hover:bg-gray-50 ">
                <td className="py-2 px-4">
                  <strong className="text-lg">Total</strong>
                </td>
                <td className="text-right px-4">
                  <span className="text-lg">{money(sales?.total)}</span>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
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
                i.is_editing = true;
              }
              return i;
            }),
          ]);
        }}
      />
    </AdminLayout>
  );
};
export default SalesDetail;
function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}
