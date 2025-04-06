import { useContext, useEffect, useState, type FC } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../components/layouts/admin";
import {
  deletePurchaseReturnItem,
  getPurchaseReturn,
  updatePurchaseReturnItem,
} from "../services/api/purchaseReturnApi";
import { ReturnModel } from "../models/return";
import { LoadingContext } from "../contexts/LoadingContext";
import toast from "react-hot-toast";
import { Dropdown, Label, Table } from "flowbite-react";
import Moment from "react-moment";
import { MdOutlinePublish } from "react-icons/md";
import { money } from "../utils/helper";
import CurrencyInput from "react-currency-input-field";

interface PurchaseReturnDetailProps {}

const PurchaseReturnDetail: FC<PurchaseReturnDetailProps> = ({}) => {
  const { loading, setLoading } = useContext(LoadingContext);
  const { returnId } = useParams();
  const [mounted, setMounted] = useState(false);
  const [returnPurchase, setReturnPurchase] = useState<ReturnModel>();

  useEffect(() => {
    setMounted(true);

    return () => {};
  }, []);
  const getDetail = () => {
    setLoading(true);
    getPurchaseReturn(returnId!)
      .then((res: any) => {
        setReturnPurchase(res.data);
      })
      .catch((error) => {
        toast.error(`${error}`);
      })
      .finally(() => {
        setLoading(false);
      });
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
            <Dropdown inline>
              <Dropdown.Item icon={MdOutlinePublish}>
                Release Purchase Return
              </Dropdown.Item>
            </Dropdown>
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
              <div>{returnPurchase?.purchase_ref?.purchase_number}</div>
            </div>
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
              <Table.HeadCell style={{ width: "300px" }}>Item</Table.HeadCell>
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
                  <Table.Cell>{item.description} {item.original_quantity}</Table.Cell>
                  <Table.Cell>
                    <div className=" relative min-w-[32px]">
                      <CurrencyInput
                        className="rs-input !p-1.5 "
                        value={item.quantity ?? 0}
                        groupSeparator="."
                        decimalSeparator=","
                        onValueChange={(value, name, values) => {
                          if ((values?.float ?? 0) > item.original_quantity!) {
                            toast.error("Quantity must be less than or equal to original quantity");
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
                              getDetail ();
                            })
                          }
                        }}
                      />
                      {item.unit && (
                        <div className="absolute top-2.5 right-2 text-xs">
                          {item?.unit?.code}
                        </div>
                      )}
                    </div>
                  </Table.Cell>
                  <Table.Cell>{money(item.unit_price)}</Table.Cell>
                  <Table.Cell>{money(item.discount_percent)} %</Table.Cell>
                  <Table.Cell>{money(item.tax?.amount)} %</Table.Cell>
                  <Table.Cell>{money(item.total)}</Table.Cell>
                  <Table.Cell className="text-center">
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
                  </Table.Cell>
                  
                </Table.Row>
              ))}
            <Table.Row>
              <Table.Cell colSpan={5} className="font-semibold">Subtotal</Table.Cell>
              <Table.Cell>{money(returnPurchase?.items?.reduce((acc, item) => acc + item.total!, 0))}</Table.Cell>
              <Table.Cell></Table.Cell>
            </Table.Row>
            </Table.Body>
            
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};
export default PurchaseReturnDetail;
