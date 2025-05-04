import {
  Button,
  Datepicker,
  Label,
  Modal,
  Pagination,
  Table,
  Textarea,
  TextInput,
  ToggleSwitch,
} from "flowbite-react";
import moment from "moment";
import { useContext, useEffect, useRef, useState, type FC } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { BsCartCheck, BsJournal } from "react-icons/bs";
import { LuFilter } from "react-icons/lu";
import { TbFileInvoice } from "react-icons/tb";
import Moment from "react-moment";
import { Link } from "react-router-dom";
import Select from "react-select";
import { DateRangeContext, LoadingContext } from "../contexts/LoadingContext";
import { SearchContext } from "../contexts/SearchContext";
import { AccountModel } from "../models/account";
import { TransactionModel } from "../models/transaction";
import { PaginationResponse } from "../objects/pagination";
import { getAccounts } from "../services/api/accountApi";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "../services/api/transactionApi";
import { money } from "../utils/helper";

interface TransactionTableProps {
  transactionType: string;
  disableCreate?: boolean;
}

const TransactionTable: FC<TransactionTableProps> = ({
  transactionType,
  disableCreate = false,
}) => {
        const { t } = useTranslation();
  
  const { dateRange, setDateRange } = useContext(DateRangeContext);

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
  const [isOpeningBalance, setIsOpeningBalance] = useState(false);
  const [isPrive, setIsPrive] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<TransactionModel>();

  const renderHeader = (label: string, onAdd: () => void) => {
    return (
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold ">{label}</h1>
        <div className="flex items-center gap-2">
          {!disableCreate && (
            <Button gradientDuoTone="purpleToBlue" pill onClick={onAdd}>
              + {label}
            </Button>
          )}
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
  }, [mounted, page, size, search, dateRange]);

  const getAllTransactions = async () => {
    try {
      setLoading(true);
      const resp: any = await getTransactions({
        page,
        size,
        search,
        type: transactionType,
        start_date: dateRange ? dateRange?.[0].toISOString() : null,
        end_date: dateRange ? dateRange?.[1].toISOString() : null,
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
      case "REVENUE":
        return t("revenue_transaction");
      case "EXPENSE":
        return t("expense_transaction");
      case "EQUITY":
        return t("equity_transaction");
      case "TRANSFER":
        return t("transfer_transaction");
      case "PAYABLE":
        return t("payable_transaction");
      case "RECEIVABLE":
        return t("receivable_transaction");
      default:
        return t("");
    }
  };
  return (
    <div className="h-[calc(100vh-200px)] overflow-y-auto">
      {renderHeader(headerLabel(), () => {
        switch (transactionType) {
          case "REVENUE":
            getAccounts({ page: 1, size: 100, type: "REVENUE" }).then(
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
          <Table.HeadCell>{t("date")}</Table.HeadCell>
          <Table.HeadCell>{t("description")}</Table.HeadCell>
          <Table.HeadCell>{t("amount")}</Table.HeadCell>
          <Table.HeadCell>
            {transactionType == "TRANSFER" ? t("from") : t("category")}
          </Table.HeadCell>
          <Table.HeadCell>
            {transactionType == "TRANSFER" ? t("to") : t("account_ref")}
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
                {transaction?.sales_ref && (
                  <Link
                    to={`/sales/${transaction?.sales_ref?.id}`}
                    className="flex gap-1 items-center"
                  >
                    <TbFileInvoice /> {transaction.sales_ref?.sales_number}
                  </Link>
                )}
                {transaction?.purchase_ref && (
                  <Link
                    to={`/purchase/${transaction?.purchase_ref?.id}`}
                    className="flex gap-1 items-center"
                  >
                    <BsCartCheck /> {transaction.purchase_ref?.purchase_number}
                  </Link>
                )}
              </Table.Cell>
              <Table.Cell>
                <a
                  className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer"
                  onClick={() => setSelectedTransaction(transaction)}
                >
                  Edit
                </a>
                <a
                  className="font-medium text-red-600 hover:underline dark:text-red-500 ms-2 cursor-pointer"
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
        <Modal.Header>{headerLabel()}</Modal.Header>
        <Modal.Body>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                setLoading(true);

                let data = {
                  date: date?.toISOString(),
                  description: description,
                  amount: isPrive ? -amount : amount,
                  source_id: selectedSource?.id,
                  destination_id: selectedDestination?.id,
                  is_income: transactionType === "REVENUE",
                  is_expense: transactionType === "EXPENSE",
                  is_equity: transactionType === "EQUITY",
                  is_transfer: transactionType === "TRANSFER",
                  is_opening_balance: isOpeningBalance,
                };
                await createTransaction(data);

                toast.success("Transaction created successfully");
                setModalOpen(false);
                getAllTransactions();
                setDate(new Date());
                setAmount(0);
                setDescription("");
                setSelectedSource(null);
                setSelectedDestination(null);
                setIsPrive(false);
              } catch (error) {
                toast.error(`${error}`);
              } finally {
                setLoading(false);
              }
            }}
          >
            <div className="space-y-4">
              <div>
                <Label>{t("date")}</Label>
                <Datepicker
                  required
                  value={date}
                  onChange={(e) => setDate(e!)}
                  placeholder={t("Select date")}
                />
              </div>
              <div>
                <Label>{t("description")}</Label>
                <Textarea
                  rows={7}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("Enter description")}
                />
              </div>
              <div>
                <Label>{t("amount")}</Label>
                <TextInput
                  type="number"
                  ref={amountRef}
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder={t("Enter amount")}
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
              {transactionType === "EQUITY" && (
                <ToggleSwitch
                  checked={isOpeningBalance}
                  onChange={(e) => {
                    setIsOpeningBalance(e);
                  }}
                  label={t("Is Opening Balance?")}
                />
              )}
              {transactionType === "EQUITY" && (
                <ToggleSwitch
                  checked={isPrive}
                  onChange={(e) => {
                    setIsPrive(e);
                  }}
                  label={t("Is Prive / Dividend?")}
                />
              )}
              <div>
                <Label>
                  {transactionType == "TRANSFER" ? t("from") : t("category")}
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
                  {transactionType == "TRANSFER" ? t("to") : t("account")}
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
                <span>{t("save")}</span>
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <Modal
        show={selectedTransaction != undefined}
        onClose={() => setSelectedTransaction(undefined)}
      >
        <Modal.Header>{headerLabel()}</Modal.Header>
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
                  {transactionType == "TRANSFER" ? t("from") : t("category")}
                </Label>
                <div>{selectedTransaction?.account?.name}</div>
              </div>
              <div>
                <Label>
                  {transactionType == "TRANSFER" ? t("to") : t("account")}
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
