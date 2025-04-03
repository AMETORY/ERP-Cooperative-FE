import { Drawer, DrawerItems, Table } from "flowbite-react";
import { useEffect, useState, type FC } from "react";
import { SalesItemModel, SalesModel } from "../models/sales";
import { money } from "../utils/helper";
import { AccountModel } from "../models/account";
import { getAccounts } from "../services/api/accountApi";
import Select from "react-select";
interface DrawerPostInvoiceProps {
  open: boolean;
  onClose: () => void;
  sales: SalesModel;
}

const DrawerPostInvoice: FC<DrawerPostInvoiceProps> = ({
  open,
  onClose,
  sales,
}) => {
  const [incomeAccounts, setIncomeAccounts] = useState<AccountModel[]>([]);
  const [assetAccounts, setAssetAccounts] = useState<AccountModel[]>([]);
  const [items, setItems] = useState<SalesItemModel[]>([]);

  useEffect(() => {
    if (sales) {
      getAllIncome("");
      getAllAsset("");
      setItems(sales.items ?? []);
    }
  }, [sales]);

  const getAllIncome = (s: string) => {
    getAccounts({ page: 1, size: 10, search: s, type: "INCOME" }).then(
      (e: any) => {
        setIncomeAccounts(e.data.items);
      }
    );
  };
  const getAllAsset = (s: string) => {
    getAccounts({
      page: 1,
      size: 10,
      search: s,
      type: "ASSET,RECEIVABLE",
      cashflow_sub_group: "cash_bank,acceptance_from_customers",
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
            {sales?.sales_number} Release
          </h1>
          <div className="overflow-x-auto h-[calc(100vh-160px)]">
            <Table className=" overflow-x-auto border rounded-none" hoverable>
              <Table.Head>
                <Table.HeadCell>Item</Table.HeadCell>
                <Table.HeadCell>Qty</Table.HeadCell>
                <Table.HeadCell>Total</Table.HeadCell>
                <Table.HeadCell>Income Account</Table.HeadCell>
                <Table.HeadCell>Asset Account</Table.HeadCell>
              </Table.Head>
              <Table.Body>
                {items?.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>{item.description}</Table.Cell>
                    <Table.Cell>
                      {item.quantity}
                      {item.unit?.name} x {money(item.unit_price)}
                    </Table.Cell>
                    <Table.Cell> {money(item.total)}</Table.Cell>
                    <Table.Cell>
                      <Select
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
                        formatOptionLabel={(option) => (
                          <div className="flex justify-between items-center w-full space-x-3">
                            <div className="min-w-0 flex-1 text-gray-900">
                              {option.label}
                            </div>
                          </div>
                        )}
                        inputValue={""}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <Select
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
                        formatOptionLabel={(option) => (
                          <div className="flex justify-between items-center w-full space-x-3">
                            <div className="min-w-0 flex-1 text-gray-900">
                              {option.label}
                            </div>
                          </div>
                        )}
                        inputValue={""}
                      />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      </DrawerItems>
    </Drawer>
  );
};
export default DrawerPostInvoice;
