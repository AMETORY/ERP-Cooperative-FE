import { Button, Label, Modal, Table, TextInput } from "flowbite-react";
import { useContext, useEffect, useState, type FC } from "react";
import toast from "react-hot-toast";
import { LuFilter } from "react-icons/lu";
import AdminLayout from "../components/layouts/admin";
import { LoadingContext } from "../contexts/LoadingContext";
import { SearchContext } from "../contexts/SearchContext";
import { TaxModel } from "../models/tax";
import { PaginationResponse } from "../objects/pagination";
import {
  createTax,
  deleteTax,
  getTaxes,
  updateTax,
} from "../services/api/taxApi";
import { getPagination, money } from "../utils/helper";
import { AccountModel } from "../models/account";
import { getAccountDetail, getAccounts } from "../services/api/accountApi";
import Select, { InputActionMeta } from "react-select";
import { BsPercent } from "react-icons/bs";
import { Link } from "react-router-dom";

interface TaxPageProps {}

const TaxPage: FC<TaxPageProps> = ({}) => {
  const { search, setSearch } = useContext(SearchContext);
  const [showModal, setShowModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { loading, setLoading } = useContext(LoadingContext);
  const [taxes, setTaxes] = useState<TaxModel[]>([]);
  const [page, setPage] = useState(1);
  const [size, setsize] = useState(20);
  const [pagination, setPagination] = useState<PaginationResponse>();
  const [tax, setTax] = useState<TaxModel | null>(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [amount, setAmount] = useState(0);
  const [payableAccounts, setPayableAccounts] = useState<AccountModel[]>([]);
  const [receibleAccounts, setReceivableAccounts] = useState<AccountModel[]>(
    []
  );
  const [selectedPayable, setSelectedPayable] = useState<AccountModel | null>(
    null
  );
  const [selectedReceivable, setSelectedReceivable] =
    useState<AccountModel | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      getAllTaxes();
      getPayables("");
      getReceivables("");
    }
  }, [mounted, page, size, search]);

  const getPayables = (s: string) => {
    getAccounts({
      page: 1,
      size: 20,
      search: s,
      type: "LIABILITY",
      is_tax: true,
    }).then((e: any) => {
      setPayableAccounts(e.data.items);
    });
  };
  const getReceivables = (s: string) => {
    getAccounts({
      page: 1,
      size: 20,
      search: s,
      type: "RECEIVABLE",
      is_tax: true,
    }).then((e: any) => {
      setReceivableAccounts(e.data.items);
    });
  };

  const getAllTaxes = () => {
    setLoading(true);
    getTaxes({ page, size, search })
      .then((e: any) => {
        setTaxes(e.data.items);
        setPagination(getPagination(e.data));
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
      <div className="p-8 ">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold ">Tax</h1>
          <div className="flex items-center gap-2">
            <Button
              gradientDuoTone="purpleToBlue"
              pill
              onClick={() => {
                setShowModal(true);
              }}
            >
              + Create new tax
            </Button>
            <LuFilter
              className=" cursor-pointer text-gray-400 hover:text-gray-600"
              onClick={() => {
                setShowFilter(true);
              }}
            />
          </div>
        </div>
        <div className="h-[calc(100vh-200px)] overflow-y-auto">
          <Table>
            <Table.Head>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Amount</Table.HeadCell>
              <Table.HeadCell>Payable Account</Table.HeadCell>
              <Table.HeadCell>Receivable Account</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {taxes.map((tax) => (
                <Table.Row
                  key={tax.id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>{tax.name}</Table.Cell>
                  <Table.Cell>{money(tax.amount)}%</Table.Cell>
                  <Table.Cell>
                    {tax.account_payable && (
                      <Link to={`/account/${tax.account_payable.id}/report`}>
                        {tax.account_payable?.name}
                      </Link>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    {tax.account_receivable && (
                      <Link
                        to={`/account/${tax.account_receivable?.id}/report`}
                      >
                        {tax.account_receivable?.name}
                      </Link>
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-2">
                      <button
                        className="font-medium text-blue-600 hover:underline dark:text-blue-500 ms-2"
                        onClick={() => {
                          setTax(tax);
                          setShowModal(true);
                          setName(tax.name!);
                          setCode(tax.code!);
                          setAmount(tax.amount!);
                          if (tax.account_payable_id)
                            getAccountDetail(tax.account_payable_id!).then(
                              (e: any) => {
                                setSelectedPayable(e.data);
                              }
                            );
                          if (tax.account_receivable_id)
                            getAccountDetail(tax.account_receivable_id!).then(
                              (e: any) => {
                                setSelectedReceivable(e.data);
                              }
                            );
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="font-medium text-red-600 hover:underline dark:text-red-500 ms-2"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this tax?"
                            )
                          ) {
                            deleteTax(tax.id!).then(() => getAllTaxes());
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header> Tax Form</Modal.Header>
        <Modal.Body>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                setLoading(true);
                let data = {
                  name: name,
                  code: code,
                  amount: amount,
                  account_payable_id: selectedPayable?.id,
                  account_receivable_id: selectedReceivable?.id,
                };
                if (tax) {
                  await updateTax(tax.id!, data);
                } else {
                  await createTax(data);
                }
                toast.success("Tax created successfully");
                setShowModal(false);
                setName("");
                setCode("");
                setAmount(0);
                setSelectedPayable(null);
                setSelectedReceivable(null);
                setShowModal(false);
                setTax(null);
                getAllTaxes();
              } catch (error) {
                toast.error(`${error}`);
              } finally {
                setLoading(false);
              }
            }}
          >
            <div className="flex flex-col space-y-4">
              <div>
                <Label htmlFor="tax-title" value="Name" />
                <TextInput
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  id="tax-title"
                  placeholder="Tax Name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="tax-code" value="Code" />
                <TextInput
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                  }}
                  id="tax-code"
                  placeholder="Tax Code"
                  required
                />
              </div>
              <div>
                <Label htmlFor="tax-amount" value="Amount" />
                <TextInput
                  value={amount}
                  onChange={(e) => {
                    setAmount(Number(e.target.value));
                  }}
                  className="text-right"
                  max={100}
                  type="number"
                  id="tax-amount"
                  placeholder="Tax Amount"
                  required
                  rightIcon={BsPercent}
                />
              </div>
              <div>
                <Label htmlFor="payable-account" value="Payable Account" />
                <Select
                  options={payableAccounts.map((t) => ({
                    label: t.name!,
                    value: t.id!,
                  }))}
                  value={
                    selectedPayable
                      ? {
                          label: selectedPayable!.name!,
                          value: selectedPayable!.id!,
                        }
                      : { label: "", value: "" }
                  }
                  onChange={(e) =>
                    setSelectedPayable(
                      e?.value
                        ? payableAccounts.find((v) => v.id === e!.value)!
                        : null
                    )
                  }
                  onInputChange={(e) => {
                    getPayables(e);
                  }}
                  placeholder="Select source"
                />
              </div>
              <div>
                <Label
                  htmlFor="receivable-account"
                  value="Receivable Account"
                />
                <Select
                  options={receibleAccounts.map((t) => ({
                    label: t.name!,
                    value: t.id!,
                  }))}
                  value={
                    selectedReceivable
                      ? {
                          label: selectedReceivable!.name!,
                          value: selectedReceivable!.id!,
                        }
                      : { label: "", value: "" }
                  }
                  onChange={(e) =>
                    setSelectedReceivable(
                      e?.value
                        ? receibleAccounts.find((v) => v.id === e!.value)!
                        : null
                    )
                  }
                  onInputChange={(e) => {
                    getReceivables(e);
                  }}
                  placeholder="Select source"
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <Button type="submit" onClick={() => {}}>
                {tax ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </AdminLayout>
  );
};
export default TaxPage;
