import {
  Button,
  Datepicker,
  Label,
  Modal,
  Pagination,
  Table,
  Textarea,
  TextInput,
} from "flowbite-react";
import { useContext, useEffect, useRef, useState, type FC } from "react";
import { LoadingContext } from "../contexts/LoadingContext";
import toast from "react-hot-toast";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "../services/api/transactionApi";
import Select, { InputActionMeta } from "react-select";
import { AccountModel } from "../models/account";
import { PaginationResponse } from "../objects/pagination";
import { SearchContext } from "../contexts/SearchContext";
import { LuFilter } from "react-icons/lu";
import { getAccounts } from "../services/api/accountApi";
import { TransactionModel } from "../models/transaction";
import Moment from "react-moment";
import { money } from "../utils/helper";
import { Link } from "react-router-dom";
import moment from "moment";
import { BsJournal } from "react-icons/bs";

interface TransactionTableProps {
  transactionType: string;
}

const TransactionTable: FC<TransactionTableProps> = ({ transactionType }) => {
  const { loading, setLoading } = useContext(LoadingContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sourceAccounts, setSourceAccounts] = useState<AccountModel[]>([]);
  const [destinationAccounts, setDestinationAccounts] = useState<
    AccountModel[]
  >([]);
  const [selectedSource, setSelectedSource] = useState<AccountModel | null>(
    null
  );
  const [selectedDestination, setSelectedDestination] =
    useState<AccountModel | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState<TransactionModel[]>([]);
  const [page, setPage] = useState(1);
  const [size, setsize] = useState(20);
  const [pagination, setPagination] = useState<PaginationResponse>();
  const { search, setSearch } = useContext(SearchContext);
  const amountRef = useRef<HTMLInputElement | null>(null);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionModel>();

  const renderHeader = (label: string, onAdd: () => void) => {
    return (
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold ">{label}</h1>
        <div className="flex items-center gap-2">
          <Button gradientDuoTone="purpleToBlue" pill onClick={onAdd}>
            + {label}
          </Button>
          <LuFilter
            className=" cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => {}}
          />
        </div>
      </div>
    );
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      getAllTransactions();
    }
  }, [mounted, page, size, search]);

  const getAllTransactions = async () => {
    try {
      setLoading(true);
      const resp: any = await getTransactions({
        page,
        size,
        search,
        type: transactionType,
      });
      setTransactions(resp.data.items);
      setPagination(resp.data.pagination);
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setLoading(false);
    }
  };

  const headerLabel = () => {
    switch (transactionType) {
      case "INCOME":
        return "Income Transaction";
      case "EXPENSE":
        return "Expense Transaction";
      case "EQUITY":
        return "Equity Transaction";
      case "TRANSFER":
        return "Transfer Transaction";
      default:
        return "";
    }
  };
  return (
    <div>
      {renderHeader(headerLabel(), () => {
        switch (transactionType) {
          case "INCOME":
            getAccounts({ page: 1, size: 100, type: "INCOME" }).then(
              (v: any) => {
                setSourceAccounts(v.data.items);
              }
            );
            break;
          case "EXPENSE":
            getAccounts({ page: 1, size: 100, type: "EXPENSE,COST" }).then(
              (v: any) => {
                setSourceAccounts(v.data.items);
              }
            );
            break;
          case "EQUITY":
            getAccounts({ page: 1, size: 100, type: "EQUITY" }).then(
              (v: any) => {
                setSourceAccounts(v.data.items);
              }
            );
            break;
          case "TRANSFER":
            getAccounts({
              page: 1,
              size: 100,
              type: "ASSET",
              cashflow_sub_group: "cash_bank",
            }).then((v: any) => {
              setSourceAccounts(v.data.items);
            });
            break;

          default:
            break;
        }

        getAccounts({
          page: 1,
          size: 100,
          type: "ASSET",
          cashflow_sub_group: "cash_bank",
        }).then((v: any) => {
          setDestinationAccounts(v.data.items);
        });

        setModalOpen(true);
      })}
      <Table>
        <Table.Head>
          <Table.HeadCell>Date</Table.HeadCell>
          <Table.HeadCell>Description</Table.HeadCell>
          <Table.HeadCell>Amount</Table.HeadCell>
          <Table.HeadCell>
            {transactionType == "TRANSFER" ? "From" : "Category"}
          </Table.HeadCell>
          <Table.HeadCell>
            {transactionType == "TRANSFER" ? "To" : "Account"}
          </Table.HeadCell>
          <Table.HeadCell></Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {transactions.length === 0 && (
            <Table.Row>
              <Table.Cell colSpan={5} className="text-center">
                No transactions found.
              </Table.Cell>
            </Table.Row>
          )}
          {transactions.map((transaction, i) => (
            <Table.Row
              key={i}
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
            >
              <Table.Cell
                className="whitespace-nowrap font-medium text-gray-900 dark:text-white cursor-pointer hover:font-semibold"
                onClick={() => {}}
              >
                <Moment format="DD/MM/YYYY">{transaction.date}</Moment>
              </Table.Cell>
              <Table.Cell>{transaction.description}</Table.Cell>
              <Table.Cell>{money(transaction.amount)}</Table.Cell>
              <Table.Cell>
                <Link to={`/account/${transaction.account?.id}/report`}>
                  {transaction.account?.name}
                </Link>
              </Table.Cell>
              <Table.Cell>
                {transaction?.transaction_ref && (
                  <Link
                    to={`/account/${transaction?.transaction_ref?.account?.id}/report`}
                  >
                    {transaction.transaction_ref?.account?.name}
                  </Link>
                )}
                {transaction?.journal_ref && (
                  <Link
                    to={`/journal/${transaction?.journal_ref?.id}`}
                    className="flex gap-1 items-center"
                  >
                    <BsJournal /> {transaction.journal_ref?.description}
                  </Link>
                )}
              </Table.Cell>
              <Table.Cell>
                <a
                  href="#"
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                  onClick={() => setSelectedTransaction(transaction)}
                >
                  Edit
                </a>
                <a
                  href="#"
                  className="font-medium text-red-600 hover:underline dark:text-red-500 ms-2"
                  onClick={(e) => {
                    e.preventDefault();
                    if (
                      window.confirm(
                        `Are you sure you want to delete project ${transaction.description}?`
                      )
                    ) {
                      deleteTransaction(transaction?.id!).then(() => {
                        getAllTransactions();
                      });
                    }
                  }}
                >
                  Delete
                </a>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Pagination
        className="mt-4"
        currentPage={page}
        totalPages={pagination?.total_pages ?? 0}
        onPageChange={(val) => {
          setPage(val);
        }}
        showIcons
      />
      <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Header>{headerLabel()} Form</Modal.Header>
        <Modal.Body>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                setLoading(true);

                let data = {
                  date: date?.toISOString(),
                  description: description,
                  amount: amount,
                  source_id: selectedSource?.id,
                  destination_id: selectedDestination?.id,
                  is_income: transactionType === "INCOME",
                  is_expense: transactionType === "EXPENSE",
                  is_equity: transactionType === "EQUITY",
                  is_transfer: transactionType === "TRANSFER",
                };
                await createTransaction(data);

                toast.success("Transaction created successfully");
                setModalOpen(false);
                getAllTransactions();
              } catch (error) {
                toast.error(`${error}`);
              } finally {
                setLoading(false);
              }
            }}
          >
            <div className="space-y-4">
              <div>
                <Label>Date</Label>
                <Datepicker
                  required
                  value={date}
                  onChange={(e) => setDate(e!)}
                  placeholder="Select date"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  rows={7}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                />
              </div>
              <div>
                <Label>Amount</Label>
                <TextInput
                  type="number"
                  ref={amountRef}
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="Enter amount"
                />
                {
                  <h1
                    className="text-4xl font-semibold text-right cursor-pointer"
                    onClick={() => {
                      amountRef.current?.focus();
                    }}
                  >
                    {money(amount)}
                  </h1>
                }
              </div>
              <div>
                <Label>
                  {transactionType == "TRANSFER" ? "From" : "Category"}
                </Label>
                <Select
                  options={sourceAccounts.map((t) => ({
                    label: t.name!,
                    value: t.id!,
                  }))}
                  value={
                    selectedSource
                      ? {
                          label: selectedSource!.name!,
                          value: selectedSource!.id!,
                        }
                      : { label: "", value: "" }
                  }
                  onChange={(e) =>
                    setSelectedSource(
                      sourceAccounts.find((v) => v.id === e!.value)!
                    )
                  }
                />
              </div>
              <div>
                <Label>
                  {transactionType == "TRANSFER" ? "To" : "Account"}
                </Label>
                <Select
                  options={destinationAccounts.map((t) => ({
                    label: t.name!,
                    value: t.id!,
                  }))}
                  value={
                    selectedDestination
                      ? {
                          label: selectedDestination!.name!,
                          value: selectedDestination!.id!,
                        }
                      : { label: "", value: "" }
                  }
                  onChange={(e) =>
                    setSelectedDestination(
                      destinationAccounts.find((v) => v.id === e!.value)!
                    )
                  }
                />
              </div>
            </div>
            <div className="h-16"></div>
            <div className="flex justify-end">
              <Button type="submit" onClick={() => {}}>
                <span>Save</span>
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <Modal
        show={selectedTransaction != undefined}
        onClose={() => setSelectedTransaction(undefined)}
      >
        <Modal.Header>{headerLabel()} Form</Modal.Header>
        <Modal.Body>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                setLoading(true);
                let data = {
                  date: selectedTransaction?.date,
                  description: selectedTransaction?.description,
                  amount: selectedTransaction?.amount,
                };
                await updateTransaction(selectedTransaction!.id!, data);

                toast.success("Transaction updated successfully");
                setSelectedTransaction(undefined);
                getAllTransactions();
              } catch (error) {
                toast.error(`${error}`);
              } finally {
                setLoading(false);
              }
            }}
          >
            <div className="space-y-4">
              <div>
                <Label>Date</Label>
                <Datepicker
                  required
                  value={moment(selectedTransaction?.date).toDate()}
                  onChange={(e) =>
                    setSelectedTransaction({
                      ...selectedTransaction!,
                      date: e!.toISOString(),
                    })
                  }
                  placeholder="Select date"
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  rows={7}
                  required
                  value={selectedTransaction?.description}
                  onChange={(e) => {
                    setSelectedTransaction({
                      ...selectedTransaction!,
                      description: e.target.value,
                    });
                  }}
                  placeholder="Enter description"
                />
              </div>
              <div>
                <Label>Amount</Label>
                <TextInput
                  type="number"
                  ref={amountRef}
                  required
                  value={selectedTransaction?.amount}
                  onChange={(e) => {
                    setSelectedTransaction({
                      ...selectedTransaction!,
                      amount: Number(e.target.value),
                    });
                  }}
                  placeholder="Enter amount"
                />
                {
                  <h1
                    className="text-4xl font-semibold text-right cursor-pointer"
                    onClick={() => {
                      amountRef.current?.focus();
                    }}
                  >
                    {money(selectedTransaction?.amount)}
                  </h1>
                }
              </div>
              <div>
                <Label>
                  {transactionType == "TRANSFER" ? "From" : "Category"}
                </Label>
                <div>{selectedTransaction?.account?.name}</div>
              </div>
              <div>
                <Label>
                  {transactionType == "TRANSFER" ? "To" : "Account"}
                </Label>
                <div>{selectedTransaction?.transaction_ref?.account?.name}</div>
              </div>
            </div>
            <div className="h-16"></div>
            <div className="flex justify-end">
              <Button type="submit" onClick={() => {}}>
                <span>Save</span>
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default TransactionTable;
