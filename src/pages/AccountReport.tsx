import { Datepicker, Drawer, Label, Table } from "flowbite-react";
import moment from "moment";
import { useContext, useEffect, useState, type FC } from "react";
import { BsCartCheck, BsJournal } from "react-icons/bs";
import { LuFilter } from "react-icons/lu";
import Moment from "react-moment";
import { Link, useParams } from "react-router-dom";
import AdminLayout from "../components/layouts/admin";
import { DateRangeContext, LoadingContext } from "../contexts/LoadingContext";
import { SearchContext } from "../contexts/SearchContext";
import { AccountReportModel } from "../models/report";
import { TransactionModel } from "../models/transaction";
import { PaginationResponse } from "../objects/pagination";
import { getAccountReport } from "../services/api/accountApi";
import { money } from "../utils/helper";
import { TbFileInvoice } from "react-icons/tb";
import { HiOutlineChartPie } from "react-icons/hi2";
import { useTranslation } from "react-i18next";

interface AccountReportProps {}

const AccountReport: FC<AccountReportProps> = ({}) => {
  const { t } = useTranslation();
  const { dateRange, setDateRange } = useContext(DateRangeContext);
  const { loading, setLoading } = useContext(LoadingContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState<TransactionModel[]>([]);
  const [page, setPage] = useState(1);
  const [size, setsize] = useState(20);
  const [pagination, setPagination] = useState<PaginationResponse>();
  const { search, setSearch } = useContext(SearchContext);
  const { accountId } = useParams();
  const [showFilter, setShowFilter] = useState(false);
  const [report, setReport] = useState<AccountReportModel>();
  const [startDate, setStartDate] = useState(
    moment().subtract(7, "days").toDate()
  );
  const [endDate, setEndDate] = useState(moment().add(1, "days").toDate());

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (mounted && accountId) {
      //   getTransactions({ page, size, search, account_id: accountId }).then(
      //     (resp: any) => {
      //       setTransactions(resp.data.items);
      //       setPagination(getPagination(resp.data));
      //     }
      //   );

      getAccountReport(accountId, {
        page,
        size,
        search,
        start_date: moment(startDate ?? dateRange![0]).format("YYYY-MM-DD"),
        end_date: moment(endDate ?? dateRange![1]).format("YYYY-MM-DD"),
      }).then((resp: any) => {
        setReport(resp.data);
      });
    }

    return () => {};
  }, [mounted, page, size, search, accountId, startDate, endDate]);
  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold ">{report?.account.name}</h1>
            <small>
              <Moment format="DD MMM YYYY">{report?.start_date}</Moment> -{" "}
              <Moment format="DD MMM YYYY">{report?.end_date}</Moment>
            </small>
          </div>
          <div className="flex items-center gap-2">
            {/* <Button gradientDuoTone="purpleToBlue" pill onClick={onAdd}>
                + {label}
              </Button> */}
            <LuFilter
              className=" cursor-pointer text-gray-400 hover:text-gray-600"
              onClick={() => {
                setShowFilter(true);
              }}
            />
          </div>
        </div>
        <div className=" p-1 h-[calc(100vh-200px)] overflow-y-scroll">
          <Table>
            <Table.Head>
              <Table.HeadCell>{t("date")}</Table.HeadCell>
              <Table.HeadCell>{t("description")}</Table.HeadCell>
              <Table.HeadCell>{t("account")}</Table.HeadCell>
              <Table.HeadCell align="right">{t("debit")}</Table.HeadCell>
              <Table.HeadCell align="right">{t("credit")}</Table.HeadCell>
              <Table.HeadCell align="right">{t("balance")}</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {report?.transactions.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={5} className="text-center">
                    No transactions found.
                  </Table.Cell>
                </Table.Row>
              )}
              {(report?.balance_before ?? 0) > 0 && (
                <Table.Row>
                  <Table.Cell colSpan={5} className="font-semibold">
                    Saldo Sebelumnya{" "}
                  </Table.Cell>
                  <Table.Cell align="right" className="font-semibold">
                    {money(report?.balance_before)}
                  </Table.Cell>
                </Table.Row>
              )}
              {report?.transactions.map((transaction, i) => (
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
                  <Table.Cell>
                    <div className="flex flex-col">
                      <span className="font-semibold">
                        {transaction.description}
                      </span>
                      {transaction.notes && (
                        <span className="text-xs text-gray-500">
                          {transaction.notes}
                        </span>
                      )}
                    </div>
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
                        <BsCartCheck />{" "}
                        {transaction.purchase_ref?.purchase_number}
                      </Link>
                    )}
                    {transaction?.net_surplus_ref && (
                      <Link
                        to={`/cooperative/net-surplus/${transaction?.net_surplus_ref?.id}`}
                        className="flex gap-1 items-center"
                      >
                        <HiOutlineChartPie />{" "}
                        {transaction.net_surplus_ref?.net_surplus_number}
                      </Link>
                    )}
                  </Table.Cell>
                  <Table.Cell align="right">
                    {money(transaction.debit)}
                  </Table.Cell>
                  <Table.Cell align="right">
                    {money(transaction.credit)}
                  </Table.Cell>
                  <Table.Cell align="right">
                    {money(transaction.balance)}
                  </Table.Cell>

                  <Table.Cell>
                    {/* <a
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
                  </a> */}
                  </Table.Cell>
                </Table.Row>
              ))}
              <Table.Row>
                <Table.Cell colSpan={5} className="font-semibold">
                  Total{" "}
                  <span>
                    <Moment format="DD MMM YYYY">{report?.start_date}</Moment> -{" "}
                    <Moment format="DD MMM YYYY">{report?.end_date}</Moment>
                  </span>
                </Table.Cell>
                <Table.Cell align="right">
                  {money(report?.current_balance)}
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell colSpan={5} className="font-bold text-black">
                  Total{" "}
                </Table.Cell>
                <Table.Cell align="right" className="font-bold text-black">
                  {money(report?.total_balance)}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
        {/* <Pagination
          className="mt-4"
          currentPage={page}
          totalPages={pagination?.total_pages ?? 0}
          onPageChange={(val) => {
            setPage(val);
          }}
          showIcons
        /> */}
      </div>
      <Drawer
        position="right"
        open={showFilter}
        onClose={() => setShowFilter(false)}
      >
        <div className="mt-16">
          <Drawer.Items>
            <div className="flex flex-col space-y-8">
              <h3 className="font-semibold text-2xlpro">Filter</h3>
              <div>
                <Label>Start Date</Label>
                <Datepicker
                  className="mt-2" // Add this class
                  value={startDate}
                  onChange={(val) => {
                    setStartDate(val!);
                  }}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Datepicker
                  className="mt-2" // Add this class
                  value={endDate}
                  onChange={(val) => {
                    setEndDate(val!);
                  }}
                />
              </div>
            </div>
            <div className="min-h-64 mt-4">
              <Label>Time Range</Label>
              <ul className="grid grid-cols-2 gap-4 mt-4">
                <li>
                  <button
                    className="rs-input clear-start text-center hover:font-semibold hover:bg-gray-50"
                    onClick={() => {
                      const start = new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        1
                      );
                      const end = new Date(
                        new Date().getFullYear(),
                        new Date().getMonth() + 1,
                        0
                      );
                      setStartDate(start);
                      setEndDate(end);
                    }}
                  >
                    This Month
                  </button>
                </li>
                <li>
                  <button
                    className="rs-input clear-start text-center hover:font-semibold hover:bg-gray-50"
                    onClick={() => {
                      const start = new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        new Date().getDate() - new Date().getDay() + 1
                      );
                      const end = new Date(
                        new Date().getFullYear(),
                        new Date().getMonth(),
                        new Date().getDate() -
                          new Date().getDay() +
                          7
                      );
                      setStartDate(start);
                      setEndDate(end);
                    }}
                  >
                    This Week
                  </button>
                </li>
                {[...Array(4)].map((_, i) => {
                  const quarter = i + 1;
                  const start = new Date(
                    new Date().getFullYear(),
                    (quarter - 1) * 3,
                    1
                  );
                  const end = new Date(
                    new Date().getFullYear(),
                    quarter * 3,
                    0
                  );
                  return (
                    <li key={i}>
                      <button
                        key={i}
                        className="rs-input clear-start text-center hover:font-semibold hover:bg-gray-50"
                        onClick={() => {
                          setStartDate(start);
                          setEndDate(end);
                        }}
                      >
                        Q{quarter}
                      </button>
                    </li>
                  );
                })}

                {[...Array(4)].map((_, i) => {
                  const year = new Date().getFullYear() - (i === 0 ? 0 : i);
                  return (
                    <li key={i}>
                      <button
                        key={i}
                        className="rs-input clear-start text-center hover:font-semibold hover:bg-gray-50"
                        onClick={() => {
                          setStartDate(new Date(year, 0, 1));
                          setEndDate(new Date(year, 11, 31));
                        }}
                      >
                        {year == new Date().getFullYear() ? "This Year" : year}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Drawer.Items>
        </div>
      </Drawer>
    </AdminLayout>
  );
};
export default AccountReport;
