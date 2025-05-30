import {
  Drawer,
  DrawerItems,
  Table,
  Label,
  Checkbox,
  Button,
  Datepicker,
  Textarea,
} from "flowbite-react";
import { useContext, useEffect, useState, type FC } from "react";
import { SalesItemModel, SalesModel } from "../models/sales";
import { money } from "../utils/helper";
import { AccountModel } from "../models/account";
import { getAccounts } from "../services/api/accountApi";
import Select from "react-select";
import { WarehouseModel } from "../models/warehouse";
import { getWarehouses } from "../services/api/warehouseApi";
import toast from "react-hot-toast";
import moment from "moment";
import { LoadingContext } from "../contexts/LoadingContext";
import { postInvoice } from "../services/api/salesApi";
import { PaymentTermModel } from "../models/payment_term";
import { useTranslation } from "react-i18next";
interface DrawerPostInvoiceProps {
  open: boolean;
  onClose: () => void;
  sales: SalesModel;
  setSales: (sales: SalesModel) => void;
}

const DrawerPostInvoice: FC<DrawerPostInvoiceProps> = ({
  open,
  onClose,
  sales,
  setSales,
}) => {
  const { t } = useTranslation();
  const { loading, setLoading } = useContext(LoadingContext);
  const [incomeAccounts, setIncomeAccounts] = useState<AccountModel[]>([]);
  const [assetAccounts, setAssetAccounts] = useState<AccountModel[]>([]);
  const [paymentAccounts, setPaymentAccounts] = useState<AccountModel[]>([]);
  const [items, setItems] = useState<SalesItemModel[]>([]);
  const [isGlobalIncome, setIsGlobalIncome] = useState(true);
  const [isGlobalAsset, setIsGlobalAsset] = useState(true);
  const [isGlobalWarehouse, setIsGlobalWarehouse] = useState(false);
  const [warehouses, setWarehouses] = useState<WarehouseModel[]>([]);
  const [transactionDate, setTransactionDate] = useState<Date>();
  const [paymentTerm, setPaymentTerm] = useState<PaymentTermModel>();
  const [dueDate, setDueDate] = useState<Date>(moment().add(30, "days").toDate());

  useEffect(() => {
    if (sales) {
      setItems(sales.items ?? []);
      setTransactionDate(
        sales.sales_date ? moment(sales.sales_date).toDate() : new Date()
      );

      if (sales?.payment_terms) {
        let term = JSON.parse(sales.payment_terms);
        if (term) {
          if (term.due_days) {
            setDueDate(
              moment(sales.sales_date).add(term.due_days, "days").toDate()
            );
          }
        }
        setPaymentTerm(term);
      }
    }
  }, [sales]);
  useEffect(() => {
    getAllIncome("");
    getAllPayment("");
    getAllWarehouses("");
  }, []);

  const getAllPayment = (s: string) => {
    getAccounts({
      page: 1,
      size: 10,
      search: s,
      type: "RECEIVABLE,ASSET",
      cashflow_sub_group: "cash_bank,acceptance_from_customers",
    }).then((e: any) => {
      setPaymentAccounts(e.data.items);
    });
  };

  const getAllIncome = (s: string) => {
    getAccounts({ page: 1, size: 10, search: s, type: "REVENUE" }).then(
      (e: any) => {
        setIncomeAccounts(e.data.items);
      }
    );
  };
  const getAllWarehouses = (s: string) => {
    getWarehouses({ page: 1, size: 10, search: s }).then((e: any) => {
      setWarehouses(e.data.items);
    });
  };
  const getAllAsset = (s: string) => {
    getAccounts({
      page: 1,
      size: 10,
      search: s,
      //   type: "ASSET,RECEIVABLE",
      type: "RECEIVABLE",
      //   cashflow_sub_group: "cash_bank,acceptance_from_customers",
      cashflow_sub_group: "acceptance_from_customers",
    }).then((e: any) => {
      setAssetAccounts(e.data.items);
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
            {sales?.sales_number} {t("release")}
          </h1>
        </div>
      </DrawerItems>
      <DrawerItems>
        <div className="overflow-x-auto h-[calc(100vh-180px)] mt-4 p-2  space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("due_date")}</Label>
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
              <Label>{t("transaction_date")}</Label>
              <Datepicker
                value={transactionDate}
                onChange={(e: any) => setTransactionDate(e)}
                className="w-full input-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full">
              <Label className="">{t("payment_account")}</Label>
              <Select
                value={{
                  label: sales?.payment_account?.name!,
                  value: sales?.payment_account?.id!,
                  type: sales?.payment_account?.type!,
                }}
                options={paymentAccounts.map((c) => ({
                  label: c.name!,
                  value: c.id!,
                  type: c.type!,
                }))}
                onChange={(val) => {
                  let selected = paymentAccounts.find(
                    (c) => c.id == val!.value
                  );
                  setSales({
                    ...sales,
                    payment_account: selected,
                    payment_account_id: selected?.id,
                    items: items,
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
            <div className="w-full">
              <Label className="">{t("notes")}</Label>
              <Textarea
                value={sales?.notes}
                onChange={(e) => {
                  setSales({
                    ...sales,
                    notes: e.target.value,
                    items
                  });
                }}
                className="input-white"
                style={{
                  backgroundColor: "white",
                }}
              />
            </div>
          </div>
          <Table
            className=" border !rounded-none !shadow-none !drop-shadow-none"
            hoverable
          >
            <Table.Head>
              <Table.HeadCell style={{ width: "40%" }}>{t("item")}</Table.HeadCell>
              <Table.HeadCell style={{ width: "30%" }}>
                {t("warehouse")}
              </Table.HeadCell>
              <Table.HeadCell style={{ width: "30%" }}>{t("account")}</Table.HeadCell>
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
                      <div className="text-xs">
                        {t("discount")}:{" "}
                        {money(
                          item.discount_percent > 0
                            ? `${money(item.discount_percent)}%`
                            : money(item.discount_amount)
                        )}
                      </div>
                      {item.tax_id && (
                        <div className="text-xs">
                          {t("tax")}: {money(item.tax?.amount)}%
                        </div>
                      )}
                      <div className="text-normal font-semibold">
                        {money(item.total)}
                      </div>
                    </div>
                  </Table.Cell>
                  <Table.Cell valign="top">
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
                  </Table.Cell>
                  <Table.Cell valign="top">
                    <div className="flex gap-2">
                      <Select
                        isDisabled={isGlobalIncome && i > 0}
                        value={{
                          label: item.sale_account?.name!,
                          value: item.sale_account?.id!,
                        }}
                        options={incomeAccounts.map((c) => ({
                          label: c.name!,
                          value: c.id!,
                        }))}
                        onChange={(val) => {
                          let selected = incomeAccounts.find(
                            (c) => c.id == val!.value
                          );
                          setItems(
                            items.map((c) => {
                              if (isGlobalIncome) {
                                return {
                                  ...c,
                                  sale_account: selected!,
                                  sale_account_id: selected!.id,
                                };
                              }
                              if (c.id == item.id) {
                                return {
                                  ...c,
                                  sale_account: selected!,
                                  sale_account_id: selected!.id,
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
                            checked={isGlobalIncome}
                            onChange={(e) =>
                              setIsGlobalIncome(e.target.checked)
                            }
                          />
                          <Label className=""></Label>
                        </div>
                      )}
                    </div>
                    {/* <div className="h-4"></div> */}
                    {/* <Label className="">{t("asset_account")}</Label>
                    <div className="flex gap-2">
                      <Select
                        isDisabled={isGlobalAsset && i > 0}
                        value={{
                          label: item.asset_account?.name!,
                          value: item.asset_account?.id!,
                        }}
                        options={assetAccounts.map((c) => ({
                          label: c.name!,
                          value: c.id!,
                        }))}
                        onChange={(val) => {
                          let selected = assetAccounts.find(
                            (c) => c.id == val!.value
                          );
                          setItems(
                            items.map((c) => {
                              if (isGlobalAsset) {
                                return {
                                  ...c,
                                  asset_account: selected!,
                                  asset_account_id: selected!.id,
                                };
                              }
                              if (c.id == item.id) {
                                return {
                                  ...c,
                                  asset_account: selected!,
                                  asset_account_id: selected!.id,
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
                            checked={isGlobalAsset}
                            onChange={(e) => setIsGlobalAsset(e.target.checked)}
                          />
                          <Label className=""></Label>
                        </div>
                      )}
                    </div> */}
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
                for (const item of items) {
                  if (!item.sale_account_id) {
                    toast.error(
                      `${t("sales_account_required")} ${item.description}`
                    );
                    return;
                  }

                  if (!item.warehouse_id && item.product_id) {
                    toast.error(
                      `${t("warehouse_required")} ${item.description}`
                    );
                    return;
                  }
                }

                let data = {
                  sales: {
                    ...sales!,
                    due_date: dueDate,
                    items: items,
                  },
                  transaction_date: transactionDate!.toISOString(),
                };

                await postInvoice(sales!.id!, data);
                toast.success(t("invoice_posted_successfully"));
                onClose();
              } catch (error) {
                toast.error(`${error}`);
              } finally {
                setLoading(false);
              }
            }}
          >
            {t("post_invoice")}
          </Button>
        </div>
      </DrawerItems>
    </Drawer>
  );
};
export default DrawerPostInvoice;
