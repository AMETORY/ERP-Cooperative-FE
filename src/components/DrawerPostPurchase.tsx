import {
  Button,
  Checkbox,
  Datepicker,
  Drawer,
  DrawerItems,
  Label,
  Table,
} from "flowbite-react";
import moment from "moment";
import { useContext, useEffect, useState, type FC } from "react";
import toast from "react-hot-toast";
import Select from "react-select";
import { LoadingContext } from "../contexts/LoadingContext";
import { AccountModel } from "../models/account";
import { PaymentTermModel } from "../models/payment_term";
import { PurchaseItemModel, PurchaseModel } from "../models/purchase";
import { WarehouseModel } from "../models/warehouse";
import { getAccounts } from "../services/api/accountApi";
import { postInvoice } from "../services/api/purchaseApi";
import { getWarehouses } from "../services/api/warehouseApi";
import { money } from "../utils/helper";
interface DrawerPostPurchaseProps {
  open: boolean;
  onClose: () => void;
  purchase: PurchaseModel;
  setPurchase: (purchase: PurchaseModel) => void;
}

const DrawerPostPurchase: FC<DrawerPostPurchaseProps> = ({
  open,
  onClose,
  purchase,
  setPurchase,
}) => {
  const { loading, setLoading } = useContext(LoadingContext);
  const [incomeAccounts, setIncomeAccounts] = useState<AccountModel[]>([]);
  const [assetAccounts, setAssetAccounts] = useState<AccountModel[]>([]);
  const [paymentAccounts, setPaymentAccounts] = useState<AccountModel[]>([]);
  const [items, setItems] = useState<PurchaseItemModel[]>([]);
  const [isGlobalIncome, setIsGlobalIncome] = useState(true);
  const [isGlobalAsset, setIsGlobalAsset] = useState(true);
  const [isGlobalWarehouse, setIsGlobalWarehouse] = useState(false);
  const [warehouses, setWarehouses] = useState<WarehouseModel[]>([]);
  const [transactionDate, setTransactionDate] = useState<Date>();
  const [paymentTerm, setPaymentTerm] = useState<PaymentTermModel>();
  const [dueDate, setDueDate] = useState<Date>(moment().add(30, "days").toDate());

  useEffect(() => {
    if (purchase) {
      getAllPayment("");
      getAllWarehouses("");
      setItems(purchase.items ?? []);
      setTransactionDate(
        purchase.purchase_date
          ? moment(purchase.purchase_date).toDate()
          : new Date()
      );

      if (purchase?.payment_terms) {
        let term = JSON.parse(purchase.payment_terms);
        if (term) {
          if (term.due_days) {
            setDueDate(
              moment(purchase.purchase_date).add(term.due_days, "days").toDate()
            );
          }
        }
        setPaymentTerm(term);
      }
    }
  }, [purchase]);

  const getAllWarehouses = (s: string) => {
    getWarehouses({ page: 1, size: 10, search: s }).then((e: any) => {
      setWarehouses(e.data.items);
    });
  };

  const getAllPayment = (s: string) => {
    getAccounts({
      page: 1,
      size: 10,
      search: s,
      type: "LIABILITY,ASSET",
      cashflow_sub_group: "cash_bank,payment_to_vendors",
    }).then((e: any) => {
      setPaymentAccounts(e.data.items);
    });
  };
  return (
    <Drawer
      style={{
        width: 1000,
      }}
      position="right"
      open={open}
      onClose={onClose}
    >
      <Drawer.Header></Drawer.Header>
      <DrawerItems>
        <div className="mt-8">
          <h1 className="text-2xl font-semibold">
            {purchase?.purchase_number} Release
          </h1>
        </div>
      </DrawerItems>
      <DrawerItems>
        <div className="overflow-x-auto h-[calc(100vh-180px)] mt-4 p-2  space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full">
              <Label className="">Payment Account</Label>
              <Select
                value={{
                  label: purchase?.payment_account?.name!,
                  value: purchase?.payment_account?.id!,
                  type: purchase?.payment_account?.type,
                }}
                options={paymentAccounts.filter((c) => !c.is_inventory_account).map((c) => ({
                  label: c.name!,
                  value: c.id!,
                  type: c.type,
                }))}
                onChange={(val) => {
                  let selected = paymentAccounts.find(
                    (c) => c.id == val!.value
                  );
                  setPurchase({
                    ...purchase,
                    payment_account: selected,
                    payment_account_id: selected?.id,
                    items: [
                      ...items
                    ]
                  });
                }}
                formatOptionLabel={(option) => (
                  <div className="flex justify-between">
                    <span className="text-sm">{option.label}</span>
                    {option.type && (
                      <span
                        className="text-[8pt] text-white rounded-lg px-2 py-0.5"
                        style={{
                          backgroundColor:
                            option.type == "ASSET" ? "#8BC34A" : "#F56565",
                        }}
                      >
                        {option.type == "ASSET" ? "CASH" : "CREDIT"}
                      </span>
                    )}
                  </div>
                )}
                inputValue={""}
                onInputChange={(e) => getAllPayment(e)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Due Date</Label>
              <Datepicker
                value={dueDate ? moment(dueDate).toDate() : new Date()}
                onChange={(e) => setDueDate(e!)}
                className="w-full input-white"
              />
              <small>
                <strong>{paymentTerm?.name}</strong> {paymentTerm?.description}
              </small>
            </div>
            <div>
              <Label>Transaction Date</Label>
              <Datepicker
                value={transactionDate}
                onChange={(e: any) => setTransactionDate(e)}
                className="w-full input-white"
              />
            </div>
          </div>

          <Table
            className=" border !rounded-none !shadow-none !drop-shadow-none"
            hoverable
          >
            <Table.Head>
              <Table.HeadCell style={{ width: "50%" }}>Item</Table.HeadCell>
              <Table.HeadCell style={{ width: "50%" }}>
                Warehouse
              </Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {items?.map((item, i) => (
                <Table.Row key={item.id}>
                  <Table.Cell valign="top">
                    <div className="flex flex-col">
                      <div className="font-semibold">{item.description}</div>
                      {item.notes && (
                        <div className="text-xs">{item.notes}</div>
                      )}
                      <div className="text-xs">
                        {item.quantity} {item.unit?.name} x{" "}
                        {money(item.unit_price)} ={" "}
                        {money(item.subtotal_before_disc)}
                      </div>
                      {(item.discount_percent > 0 ||
                        item.discount_amount > 0) && (
                        <div className="text-xs">
                          Disc:{" "}
                          {money(
                            item.discount_percent > 0
                              ? `${money(item.discount_percent)}%`
                              : money(item.discount_amount)
                          )}
                        </div>
                      )}

                      {item.tax_id && (
                        <div className="text-xs">
                          Tax: {money(item.tax?.amount)}%
                        </div>
                      )}
                      <div className="text-normal font-semibold">
                        {money(item.total)}
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell valign="top">
                    {!item.is_cost && (
                      <div className="flex gap-2">
                        <Select
                          isDisabled={isGlobalWarehouse && i > 0}
                          value={{
                            label: item.warehouse?.name!,
                            value: item.warehouse?.id!,
                          }}
                          options={warehouses.map((c) => ({
                            label: c.name!,
                            value: c.id!,
                          }))}
                          onChange={(val) => {
                            let selected = warehouses.find(
                              (c) => c.id == val!.value
                            );
                            setItems(
                              items.map((c) => {
                                if (isGlobalWarehouse) {
                                  return {
                                    ...c,
                                    warehouse: selected!,
                                    warehouse_id: selected!.id,
                                  };
                                }
                                if (c.id == item.id) {
                                  return {
                                    ...c,
                                    warehouse: selected!,
                                    warehouse_id: selected!.id,
                                  };
                                }
                                return c;
                              })
                            );
                          }}
                          inputValue={""}
                          styles={{
                            control: (base) => ({
                              ...base,
                              width: "300px",
                            }),
                          }}
                        />
                        {i == 0 && (
                          <div>
                            <Checkbox
                              checked={isGlobalWarehouse}
                              onChange={(e) =>
                                setIsGlobalWarehouse(e.target.checked)
                              }
                            />
                            <Label className=""></Label>
                          </div>
                        )}
                      </div>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </DrawerItems>
      <DrawerItems>
        <div className="flex justify-end">
          <Button
            onClick={async () => {
              try {
                setLoading(true);
                if (!purchase.payment_account_id) {
                  toast.error(`Payment account  is required`);
                  return;
                }
                for (const item of items) {
                  if (!item.warehouse_id && !item.is_cost) {
                    toast.error(
                      `Warehouse for ${item.description} is required`
                    );
                    return;
                    break;
                  }
                }

                let data = {
                  purchase: {
                    ...purchase!,
                    due_date: dueDate,
                    items: items,
                  },
                  transaction_date: transactionDate!.toISOString(),
                };

                await postInvoice(purchase!.id!, data);
                toast.success("Invoice Posted successfully");
                onClose();
              } catch (error) {
                toast.error(`${error}`);
              } finally {
                setLoading(false);
              }
            }}
          >
            POST INVOICE
          </Button>
        </div>
      </DrawerItems>
    </Drawer>
  );
};
export default DrawerPostPurchase;
