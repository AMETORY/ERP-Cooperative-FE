import { useContext, useEffect, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { useParams } from "react-router-dom";
import {
  addItemStockOpname,
  completeStockOpname,
  deleteItemStockOpname,
  getStockOpnameDetail,
  getStockOpnames,
  updateItemStockOpname,
} from "../services/api/stockOpnameApi";
import { StockOpnameModel } from "../models/stock_opname";
import toast from "react-hot-toast";
import { LoadingContext } from "../contexts/LoadingContext";
import {
  Badge,
  Button,
  Datepicker,
  Label,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Textarea,
  TextInput,
} from "flowbite-react";
import Moment from "react-moment";
import { PiPlusCircle } from "react-icons/pi";
import ModalProduct from "../components/ModalProduct";
import { ProductModel } from "../models/product";
import Select from "react-select";
import { getProducts } from "../services/api/productApi";
import CurrencyInput from "react-currency-input-field";
import { money } from "../utils/helper";
import { AccountModel } from "../models/account";
import { getAccounts } from "../services/api/accountApi";

interface StockOpnameDetailProps {}

const StockOpnameDetail: FC<StockOpnameDetailProps> = ({}) => {
  const { loading, setLoading } = useContext(LoadingContext);
  const { stockOpnameId } = useParams();
  const [data, setData] = useState<StockOpnameModel>();
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isEdittable, setIsEdittable] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [inventoryAccounts, setInventoryAccounts] = useState<AccountModel[]>(
    []
  );
  const [revenueAccounts, setRevenueAccounts] = useState<AccountModel[]>([]);
  const [expenseAccounts, setExpenseAccounts] = useState<AccountModel[]>([]);

  const [selectedInventoryAccount, setSelectedInventoryAccount] =
    useState<AccountModel | null>(null);
  const [selectedRevenueAccount, setSelectedRevenueAccount] =
    useState<AccountModel | null>(null);
  const [selectedExpenseAccount, setSelectedExpenseAccount] =
    useState<AccountModel | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (stockOpnameId && mounted) {
      setLoading(true);
      getDetail();
      getProducts({ page: 1, size: 10, search: "" }).then((res: any) => {
        setProducts(res.data.items);
      });
      getAccounts({
        page: 1,
        size: 10,
        search: "",
        is_inventory_account: true,
      }).then((e: any) => {
        setInventoryAccounts(e.data.items);
      });
      getAccounts({
        page: 1,
        size: 10,
        search: "",
        type: "REVENUE",
      }).then((e: any) => {
        setRevenueAccounts(e.data.items);
      });
      getAccounts({
        page: 1,
        size: 10,
        search: "",
        type: "EXPENSE",
      }).then((e: any) => {
        setExpenseAccounts(e.data.items);
      });
    }

    return () => {};
  }, [stockOpnameId, mounted]);

  const getDetail = () => {
    getStockOpnameDetail(stockOpnameId!)
      .then((response: any) => {
        setData(response.data);
        setIsEdittable(response.data.status == "DRAFT");
      })
      .catch((error) => {
        toast.error(`${error}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <AdminLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Stock Opname Detail</h1>
        <div className="grid grid-cols-2 gap-4">
          <div className=" border rounded-lg">
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableBody>
                  <TableRow>
                    <TableCell className="font-bold">
                      Stock Opname Number
                    </TableCell>
                    <TableCell>{data?.stock_opname_number}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">Warehouse</TableCell>
                    <TableCell>{data?.warehouse?.name}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-bold">Opname Date</TableCell>
                    <TableCell>
                      <Moment format="YYYY-MM-DD">{data?.opname_date}</Moment>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="font-bold">
                      <div>
                        {data?.status == "DRAFT" && (
                          <Button
                            className=""
                            size="sm"
                            color="success"
                            onClick={() => {
                              setShowProcessModal(true);
                            }}
                          >
                            PROCESS
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  {/* Add more fields as necessary */}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className=" border rounded-lg">
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableBody>
                  <TableRow>
                    <TableCell className="font-bold">Notes</TableCell>
                    <TableCell>{data?.notes}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">Status</TableCell>
                    <TableCell>
                      <div className="flex">
                        <Badge
                          color={
                            data?.status === "DRAFT"
                              ? "gray"
                              : data?.status === "APPROVED"
                              ? "success"
                              : data?.status === "REJECTED"
                              ? "danger"
                              : data?.status === "DISTRIBUTED"
                              ? "blue"
                              : data?.status === "SETTLEMENT"
                              ? "indigo"
                              : "gray"
                          }
                        >
                          {data?.status}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">Created By</TableCell>
                    <TableCell>{data?.created_by?.full_name}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold"></TableCell>
                  </TableRow>
                  {/* Add more fields as necessary */}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto mt-8">
          <Table className="min-w-full" striped>
            <TableHead>
              <TableHeadCell>Product Name</TableHeadCell>
              <TableHeadCell className="w-32">SKU</TableHeadCell>
              <TableHeadCell className="w-16">Unit</TableHeadCell>
              <TableHeadCell className="text-right w-[164px]">
                System Qty
              </TableHeadCell>
              <TableHeadCell className="text-right w-[164px]">
                Existing Qty
              </TableHeadCell>
              <TableHeadCell className="text-right w-[164px]">
                Difference
              </TableHeadCell>
              <TableHeadCell className="w-32 text-center">Price</TableHeadCell>
              <TableHeadCell className="w-32 text-center">Notes</TableHeadCell>
              <TableHeadCell className="w-32 text-center"></TableHeadCell>
            </TableHead>
            <TableBody>
              {(data?.details ?? []).map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-bold">
                    {item.product?.name}
                  </TableCell>
                  <TableCell>{item.product?.sku}</TableCell>
                  <TableCell>{item.product?.default_unit?.code}</TableCell>
                  <TableCell className="text-right">
                    {money(item.system_qty)}
                  </TableCell>
                  <TableCell>
                    <CurrencyInput
                      className="rs-input text-right"
                      disabled={!isEdittable}
                      value={item.quantity ?? 0}
                      onValueChange={(value, name, values) => {
                        const newQty = values?.float ?? 0;
                        setData({
                          ...data!,
                          details: (data?.details ?? []).map((detail) => {
                            if (detail.id === item.id) {
                              return {
                                ...detail,
                                difference: newQty - detail.system_qty,
                                quantity: newQty,
                              };
                            }
                            return detail;
                          }),
                        });
                      }}
                      onBlur={(e) => {
                        let selected = data?.details?.find(
                          (d) => d.id === item.id
                        );
                        updateItemStockOpname(
                          data!.id!,
                          selected!.id!,
                          selected
                        )
                          .then(() => {
                            getDetail();
                          })
                          .catch((error) => {
                            toast.error(`${error}`);
                          });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          let selected = data?.details?.find(
                            (d) => d.id === item.id
                          );
                          updateItemStockOpname(
                            data!.id!,
                            selected!.id!,
                            selected
                          )
                            .then(() => {
                              getDetail();
                            })
                            .catch((error) => {
                              toast.error(`${error}`);
                            });
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <CurrencyInput
                      className="rs-input text-right"
                      disabled={!isEdittable}
                      value={item.difference ?? 0}
                      onValueChange={(value, name, values) => {
                        const newDiff = values?.float ?? 0;
                        setData({
                          ...data!,
                          details: (data?.details ?? []).map((detail) => {
                            if (detail.id === item.id) {
                              return {
                                ...detail,
                                difference: newDiff,
                                quantity: newDiff + detail.system_qty,
                              };
                            }
                            return detail;
                          }),
                        });
                      }}
                      onBlur={(e) => {
                        let selected = data?.details?.find(
                          (d) => d.id === item.id
                        );
                        updateItemStockOpname(
                          data!.id!,
                          selected!.id!,
                          selected
                        )
                          .then(() => {
                            getDetail();
                          })
                          .catch((error) => {
                            toast.error(`${error}`);
                          });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          let selected = data?.details?.find(
                            (d) => d.id === item.id
                          );
                          updateItemStockOpname(
                            data!.id!,
                            selected!.id!,
                            selected
                          )
                            .then(() => {
                              getDetail();
                            })
                            .catch((error) => {
                              toast.error(`${error}`);
                            });
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <CurrencyInput
                      className="rs-input text-right"
                      disabled={!isEdittable}
                      value={item.unit_price ?? 0}
                      onValueChange={(value, name, values) => {
                        const newDiff = values?.float ?? 0;
                        setData({
                          ...data!,
                          details: (data?.details ?? []).map((detail) => {
                            if (detail.id === item.id) {
                              return {
                                ...detail,
                                unit_price: newDiff,
                              };
                            }
                            return detail;
                          }),
                        });
                      }}
                      onBlur={(e) => {
                        let selected = data?.details?.find(
                          (d) => d.id === item.id
                        );
                        updateItemStockOpname(
                          data!.id!,
                          selected!.id!,
                          selected
                        )
                          .then(() => {
                            getDetail();
                          })
                          .catch((error) => {
                            toast.error(`${error}`);
                          });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          let selected = data?.details?.find(
                            (d) => d.id === item.id
                          );
                          updateItemStockOpname(
                            data!.id!,
                            selected!.id!,
                            selected
                          )
                            .then(() => {
                              getDetail();
                            })
                            .catch((error) => {
                              toast.error(`${error}`);
                            });
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextInput
                      disabled={!isEdittable}
                      value={item.notes}
                      onChange={(val) =>
                        setData({
                          ...data!,
                          details: (data?.details ?? []).map((detail) =>
                            detail.id === item.id
                              ? { ...detail, notes: val.target.value }
                              : detail
                          ),
                        })
                      }
                      className="input-white"
                      placeholder="Notes"
                      onBlur={(e) => {
                        let selected = data?.details?.find(
                          (d) => d.id === item.id
                        );
                        updateItemStockOpname(
                          data!.id!,
                          selected!.id!,
                          selected
                        )
                          .then(() => {
                            getDetail();
                          })
                          .catch((error) => {
                            toast.error(`${error}`);
                          });
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          let selected = data?.details?.find(
                            (d) => d.id === item.id
                          );
                          updateItemStockOpname(
                            data!.id!,
                            selected!.id!,
                            selected
                          )
                            .then(() => {
                              getDetail();
                            })
                            .catch((error) => {
                              toast.error(`${error}`);
                            });
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <a
                      className="font-medium text-red-600 hover:underline dark:text-red-500 ms-2 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        if (
                          window.confirm(
                            `Are you sure you want to delete  ${item.product?.name}?`
                          )
                        ) {
                          deleteItemStockOpname(data!.id!, item?.id!).then(
                            () => {
                              getDetail();
                            }
                          );
                        }
                      }}
                    >
                      Delete
                    </a>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      color="gray"
                      className="flex items-center justify-center gap-2"
                      onClick={() => setShowModal(true)}
                    >
                      <PiPlusCircle className="mt-0.5 mr-1" />
                      <span>Add Item</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Add Item</Modal.Header>
        <Modal.Body>
          <div className="pb-32">
            <Label>Product</Label>
            <Select
              options={(products ?? []).map((e) => ({
                label: e.name,
                value: e.id,
              }))}
              onInputChange={(val) => {
                getProducts({ page: 1, size: 10, search: val }).then(
                  (res: any) => {
                    setProducts(res.data.items);
                  }
                );
              }}
              onChange={async (val) => {
                try {
                  let selected = products.find((e) => e.id == val?.value);
                  let req = {
                    product_id: selected?.id,
                    stock_opname_id: data?.id,
                    unit_id: selected?.default_unit?.id ?? null,
                    unit_value: selected?.default_unit?.value ?? 1,
                    unit_price: selected?.price ?? 0,
                  };
                  await addItemStockOpname(data!.id!, req);
                  setShowModal(false);
                  getDetail();
                } catch (error) {
                  toast.error(`Failed to add item: ${error}`);
                }
              }}
            />
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={showProcessModal} onClose={() => setShowProcessModal(false)}>
        <Modal.Header>Process Stock Opname</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col space-y-4 pb-64">
            <div className="">
              <Label>Date</Label>
              <Datepicker
                onChange={(e) => {
                  setDate(e!);
                }}
                value={date}
              />
            </div>
            <div>
              <Label>Inventory Account</Label>
              <Select
                isClearable
                options={inventoryAccounts.map((t) => ({
                  label: t.name!,
                  value: t.id!,
                }))}
                value={
                  selectedInventoryAccount
                    ? {
                        label: selectedInventoryAccount!.name!,
                        value: selectedInventoryAccount!.id!,
                      }
                    : { label: "", value: "" }
                }
                onChange={(e) =>
                  setSelectedInventoryAccount(
                    e?.value
                      ? inventoryAccounts.find((v) => v.id === e!.value)!
                      : null
                  )
                }
                onInputChange={(e) => {
                  getAccounts({
                    page: 1,
                    size: 10,
                    search: e,
                    is_inventory_account: true,
                  }).then((e: any) => {
                    setInventoryAccounts(e.data.items);
                  });
                }}
                placeholder="Select Inventory"
              />
            </div>
            <div>
              <Label>Expense Account</Label>
              <Select
                isClearable
                options={expenseAccounts.map((t) => ({
                  label: t.name!,
                  value: t.id!,
                }))}
                value={
                  selectedExpenseAccount
                    ? {
                        label: selectedExpenseAccount!.name!,
                        value: selectedExpenseAccount!.id!,
                      }
                    : { label: "", value: "" }
                }
                onChange={(e) =>
                  setSelectedExpenseAccount(
                    e?.value
                      ? expenseAccounts.find((v) => v.id === e!.value)!
                      : null
                  )
                }
                onInputChange={(e) => {
                  getAccounts({
                    page: 1,
                    size: 10,
                    search: "",
                    type: "EXPENSE",
                  }).then((e: any) => {
                    setExpenseAccounts(e.data.items);
                  });
                }}
                placeholder="Select Expense"
              />
            </div>
            <div>
              <Label>Revenue Account</Label>
              <Select
                isClearable
                options={revenueAccounts.map((t) => ({
                  label: t.name!,
                  value: t.id!,
                }))}
                value={
                  selectedRevenueAccount
                    ? {
                        label: selectedRevenueAccount!.name!,
                        value: selectedRevenueAccount!.id!,
                      }
                    : { label: "", value: "" }
                }
                onChange={(e) =>
                  setSelectedRevenueAccount(
                    e?.value
                      ? revenueAccounts.find((v) => v.id === e!.value)!
                      : null
                  )
                }
                onInputChange={(e) => {
                  getAccounts({
                    page: 1,
                    size: 10,
                    search: "",
                    type: "REVENUE",
                  }).then((e: any) => {
                    setRevenueAccounts(e.data.items);
                  });
                }}
                placeholder="Select Expense"
              />
            </div>
            <div className="">
              <Label>Notes</Label>
              <Textarea
                rows={7}
                onChange={(e) => setNotes(e.target.value)}
                value={notes}
                placeholder="Notes"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="w-full justify-end flex ">
            <Button
              onClick={async () => {
                try {
                if (!selectedInventoryAccount || !selectedExpenseAccount || !selectedRevenueAccount) {
                  toast.error('Account must be selected first');
                  return;
                }
                
                  setLoading(true);
                  await completeStockOpname(data!.id!, {
                    date,
                    notes,
                    inventory_id: selectedInventoryAccount?.id,
                    expense_id: selectedExpenseAccount?.id,
                    revenue_id: selectedRevenueAccount?.id,
                  });
                  setShowProcessModal(false);
                  getDetail();
                } catch (error) {
                  toast.error(`${error}`);
                } finally {
                  setLoading(false);
                }
              }}
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};
export default StockOpnameDetail;
