import { useContext, useEffect, useState, type FC } from "react";
import { Link, useParams } from "react-router-dom";
import AdminLayout from "../components/layouts/admin";
import {
  deletePurchaseReturnItem,
  getPurchaseReturn,
  releasePurchaseReturn,
  updatePurchaseReturn,
  updatePurchaseReturnItem,
} from "../services/api/purchaseReturnApi";
import { ReturnItemModel, ReturnModel } from "../models/return";
import { LoadingContext } from "../contexts/LoadingContext";
import toast from "react-hot-toast";
import {
  Button,
  Datepicker,
  Dropdown,
  Label,
  Modal,
  Table,
  Textarea,
} from "flowbite-react";
import Moment from "react-moment";
import { MdOutlinePublish } from "react-icons/md";
import { money } from "../utils/helper";
import CurrencyInput from "react-currency-input-field";
import { AccountModel } from "../models/account";
import { getAccounts } from "../services/api/accountApi";
import Select from "react-select";

interface PurchaseReturnDetailProps {}

const PurchaseReturnDetail: FC<PurchaseReturnDetailProps> = ({}) => {
  const { loading, setLoading } = useContext(LoadingContext);
  const { returnId } = useParams();
  const [mounted, setMounted] = useState(false);
  const [returnPurchase, setReturnPurchase] = useState<ReturnModel>();
  const [selectedItem, setSelectedItem] = useState<ReturnItemModel>();
  const [modalNoteOpen, setModalNoteOpen] = useState(false);
  const [itemNotes, setItemNotes] = useState("");
  const [assetAccounts, setAssetAccounts] = useState<AccountModel[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [isEditable, setIsEditable] = useState(false);

  const [selectedAssetAccount, setSelectedAssetAccount] =
    useState<AccountModel>();

  useEffect(() => {
    setMounted(true);

    return () => {};
  }, []);
  const getDetail = async () => {
    setLoading(true);
    try {
      const res: any = await getPurchaseReturn(returnId!);
      setReturnPurchase(res.data);
      setIsEditable(res.data.status == "DRAFT");
      getAccounts({
        page: 1,
        size: 10,
        search: "",
        type: "ASSET,RECEIVABLE",
        cashflow_sub_group: "cash_bank,acceptance_from_customers",
      }).then((e: any) => {
        setAssetAccounts(e.data.items);
      });
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (mounted && returnId) {
      getDetail();
    }
  }, [mounted, returnId]);
  return (
    <AdminLayout>
      <div className="p-4 h-[calc(100vh-80px)] overflow-y-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-700">
              {returnPurchase?.return_number}
            </h1>
          </div>
          <div className="flex gap-2 items-center">
            <div>{returnPurchase?.status}</div>
            {/* <Dropdown inline>
              <Dropdown.Item icon={MdOutlinePublish}>
                Release Purchase Return
              </Dropdown.Item>
            </Dropdown> */}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-8 mt-4">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col">
              <Label>Date</Label>
              <Moment format="DD MMM YYYY">{returnPurchase?.date}</Moment>
            </div>
            <div className="flex flex-col">
              <Label>Invoice</Label>
              <Link to={`/purchase/${returnPurchase?.purchase_ref?.id}`}>
                {returnPurchase?.purchase_ref?.purchase_number}
              </Link>
            </div>
            <div className="flex flex-col">
              <Label>Description</Label>
              <div>{returnPurchase?.description}</div>
            </div>
            {returnPurchase?.released_at && (
              <div className="flex flex-col">
                <Label>Released</Label>
                <div>
                  <Moment format="DD MMM YYYY, hh:mm">
                    {returnPurchase?.released_at}
                  </Moment>
                </div>
                <small>{returnPurchase?.released_by?.full_name}</small>
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col">
              <Label>Supplier / Vendor</Label>
              <div>
                {returnPurchase?.purchase_ref?.contact_data_parsed?.name}
              </div>
              <div>
                {returnPurchase?.purchase_ref?.contact_data_parsed?.address}
              </div>
              <div>
                {returnPurchase?.purchase_ref?.contact_data_parsed?.phone}{" "}
                {returnPurchase?.purchase_ref?.contact_data_parsed?.email &&
                  "-"}{" "}
                {returnPurchase?.purchase_ref?.contact_data_parsed?.email}
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto mt-8">
          <Table className=" overflow-x-auto border rounded-none" hoverable>
            <Table.Head>
              <Table.HeadCell style={{ width: "200px" }}>Item</Table.HeadCell>
              <Table.HeadCell style={{ width: "100px" }}>
                Warehouse
              </Table.HeadCell>
              <Table.HeadCell style={{ width: "100px" }}>Qty</Table.HeadCell>
              <Table.HeadCell style={{ width: "120px" }}>Price</Table.HeadCell>
              <Table.HeadCell style={{ width: "40px" }}>Disc</Table.HeadCell>
              <Table.HeadCell style={{ width: "40px" }}>Tax</Table.HeadCell>
              <Table.HeadCell style={{ width: "130px" }}>Amount</Table.HeadCell>
              <Table.HeadCell className="w-10"></Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {(returnPurchase?.items ?? []).map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>
                    <div className="font-semibold text-lg">
                      {item.description}
                    </div>
                    {!isEditable ? (
                      <span>{item.notes}</span>
                    ) : (
                      <>
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
                      </>
                    )}
                  </Table.Cell>
                  <Table.Cell>{item.warehouse?.name}</Table.Cell>
                  <Table.Cell>
                    {!isEditable ? (
                      <span>
                        {item.quantity}
                        <span className="text-xs ml-1">{item.unit?.code}</span>
                      </span>
                    ) : (
                      <div className=" relative min-w-[32px]">
                        <CurrencyInput
                          className="rs-input !p-1.5 "
                          value={item.quantity ?? 0}
                          groupSeparator=","
                          decimalSeparator="."
                          onValueChange={(value, name, values) => {
                            if (
                              (values?.float ?? 0) > item.original_quantity!
                            ) {
                              toast.error(
                                "Quantity must be less than or equal to original quantity"
                              );
                              return;
                            }
                            item.quantity = values?.float ?? 0;
                            setReturnPurchase({
                              ...returnPurchase,
                              items: (returnPurchase?.items ?? []).map((i) => {
                                if (i.id === item.id) {
                                  return item;
                                }
                                return i;
                              }),
                            });
                          }}
                          onKeyUp={(e) => {
                            if (e.key === "Enter") {
                              updatePurchaseReturnItem(
                                returnPurchase!.id!,
                                item!.id!,
                                item
                              ).then(() => {
                                getDetail();
                              });
                            }
                          }}
                        />
                        {item.unit && (
                          <div className="absolute top-2.5 right-2 text-xs">
                            {item?.unit?.code}
                          </div>
                        )}
                      </div>
                    )}
                  </Table.Cell>
                  <Table.Cell>{money(item.unit_price)}</Table.Cell>
                  <Table.Cell>{money(item.discount_percent)} %</Table.Cell>
                  <Table.Cell>{money(item.tax?.amount)} %</Table.Cell>
                  <Table.Cell>{money(item.total)}</Table.Cell>
                  <Table.Cell className="text-center">
                    {isEditable && (
                      <div
                        className="font-medium text-red-400 hover:text-red-600 text-xs hover:underline dark:text-red-500 cursor-pointer"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this item?"
                            )
                          ) {
                            deletePurchaseReturnItem(
                              returnPurchase!.id!,
                              item!.id!
                            ).then(() => {
                              getDetail();
                            });
                          }
                        }}
                      >
                        Delete
                      </div>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
              <Table.Row className="border-t">
                <Table.Cell colSpan={6} className="font-semibold">
                  Subtotal
                </Table.Cell>
                <Table.Cell>
                  {money(
                    returnPurchase?.items?.reduce(
                      (acc, item) => acc + item.total!,
                      0
                    )
                  )}
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {returnPurchase?.purchase_ref && isEditable && (
            <div className="mt-4  rounded-lg bg-gray-50 p-4 border min-h-[200px]">
              <div className="flex flex-col space-y-4">
                <div>
                  <Label>Date</Label>
                  <Datepicker
                    value={date}
                    onChange={(e) => {
                      setDate(e!);
                    }}
                    className="input-white"
                  />
                </div>

                <div>
                  <Label>Account</Label>
                  {returnPurchase?.purchase_ref?.payment_account?.type ==
                    "ASSET" && (
                    <div>
                      {returnPurchase?.purchase_ref?.payment_account?.name}
                    </div>
                  )}
                  {returnPurchase?.purchase_ref?.payment_account?.type !=
                    "ASSET" &&
                    returnPurchase!.purchase_ref!.paid! > 0 && (
                      <Select
                        options={assetAccounts
                          .filter((a) => {
                            let returnTotal =
                              returnPurchase?.items?.reduce(
                                (acc, item) => acc + item.total!,
                                0
                              ) ?? 0;
                            return (
                              (a.type === "ASSET" &&
                                returnTotal <
                                  returnPurchase?.purchase_ref?.paid!) ||
                              a.type !== "ASSET"
                            );
                          })
                          .map((a) => {
                            return {
                              value: a.id,
                              label: a.name,
                              type: a.type,
                            };
                          })}
                        value={{
                          value: selectedAssetAccount?.id,
                          label: selectedAssetAccount?.name,
                          type: selectedAssetAccount?.type,
                        }}
                        onChange={(e) => {
                          let selected = assetAccounts.find(
                            (a) => a.id === e?.value
                          );
                          setSelectedAssetAccount(selected);
                        }}
                        formatOptionLabel={(option) => (
                          <div className="flex justify-between">
                            <span className="text-sm">{option.label}</span>
                            {option.type && (
                              <span
                                className="text-[8pt] text-white rounded-lg px-2 py-0.5"
                                style={{
                                  backgroundColor:
                                    option.type == "ASSET"
                                      ? "#8BC34A"
                                      : "#F56565",
                                }}
                              >
                                {option.type == "ASSET" ? "CASH" : "CREDIT"}
                              </span>
                            )}
                          </div>
                        )}
                      />
                    )}
                </div>

                {(returnPurchase?.purchase_ref?.paid ?? 0) > 0 && (
                  <div>
                    <Label>Invoice Paid</Label>
                    <h3 className="text-2xl font-semibold">
                      {money(returnPurchase?.purchase_ref?.paid)}
                    </h3>
                  </div>
                )}

                <div>
                  <Label>Return Amount</Label>
                  <h3 className="text-2xl font-semibold">
                    {money(
                      returnPurchase?.items?.reduce(
                        (acc, item) => acc + item.total!,
                        0
                      )
                    )}
                  </h3>
                </div>

                <div>
                  <Button
                    className="w-full"
                    onClick={async () => {
                      try {
                        setLoading(true);
                        await updatePurchaseReturn(
                          returnPurchase!.id!,
                          returnPurchase!
                        );
                        await releasePurchaseReturn(returnPurchase!.id!, {
                          date,
                          account_id: selectedAssetAccount?.id,
                          notes: returnPurchase?.notes,
                        });
                        toast.success("Return released successfully");
                        getDetail();
                      } catch (error) {
                        toast.error(`${error}`);
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    Release Return
                  </Button>
                </div>
              </div>
            </div>
          )}
          <div className="py-4">
            <Label>Notes</Label>
            {isEditable ? (
              <Textarea
                rows={9}
                value={returnPurchase?.notes}
                onChange={(val) => {
                  setReturnPurchase({
                    ...returnPurchase!,
                    notes: val.target.value,
                  });
                }}
                className="input-white"
                placeholder="Notes..."
                style={{ backgroundColor: "white" }}
              />
            ) : (
              <div>{returnPurchase?.notes}</div>
            )}
          </div>
        </div>
      </div>
      <Modal show={modalNoteOpen} onClose={() => setModalNoteOpen(false)}>
        <Modal.Header>{selectedItem?.description}'s Notes</Modal.Header>
        <Modal.Body>
          <Textarea
            value={itemNotes}
            onChange={(val) => {
              setItemNotes(val.target.value);
            }}
            rows={9}
            placeholder="Item's Notes"
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="flex w-full justify-end">
            <Button
              onClick={() => {
                updatePurchaseReturnItem(
                  returnPurchase!.id!,
                  selectedItem!.id!,
                  {
                    ...selectedItem,
                    notes: itemNotes,
                  }
                ).then(() => {
                  getDetail();
                  setItemNotes("");
                  setModalNoteOpen(false);
                });
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
export default PurchaseReturnDetail;
