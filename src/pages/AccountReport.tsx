import { useContext, useEffect, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { DateRangeContext, LoadingContext } from "../contexts/LoadingContext";
import { TransactionModel } from "../models/transaction";
import { PaginationResponse } from "../objects/pagination";
import { SearchContext } from "../contexts/SearchContext";
import { Link, useParams } from "react-router-dom";
import { getTransactions } from "../services/api/transactionApi";
import { getPagination, money } from "../utils/helper";
import { LuFilter } from "react-icons/lu";
import { Datepicker, Drawer, Label, Pagination, Table } from "flowbite-react";
import Moment from "react-moment";
import moment from "moment";
import { getAccountReport } from "../services/api/accountApi";
import { AccountReportModel } from "../models/report";

interface AccountReportProps {}

const AccountReport: FC<AccountReportProps> = ({}) => {
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

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (mounted && accountId && dateRange) {
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
        start_date: moment(dateRange[0]!).format("YYYY-MM-DD"),
        end_date: moment(dateRange[1]!).format("YYYY-MM-DD"),
      }).then((resp: any) => {
        setReport(resp.data);
      });
    }

    return () => {};
  }, [mounted, page, size, search, accountId, dateRange]);
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
        <Table>
          <Table.Head>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Description</Table.HeadCell>
            <Table.HeadCell>Account</Table.HeadCell>
            <Table.HeadCell align="right">Debit</Table.HeadCell>
            <Table.HeadCell align="right">Credit</Table.HeadCell>
            <Table.HeadCell align="right">Saldo</Table.HeadCell>
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
            {(report?.balance_before ?? 0) > 0 &&
            <Table.Row>
              <Table.Cell colSpan={5} className="font-semibold">
                Saldo Sebelumnya{" "}
              </Table.Cell>
              <Table.Cell align="right" className="font-semibold">
                {money(report?.balance_before)}
              </Table.Cell>
            </Table.Row>
            }
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
                <Table.Cell>{transaction.description}</Table.Cell>
                <Table.Cell>
                  <Link
                    to={`/account/${transaction?.transaction_ref?.account?.id}/report`}
                  >
                    {transaction.transaction_ref?.account?.name}
                  </Link>
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
                  value={dateRange?.[0]}
                  onChange={(val) => {
                    setDateRange([
                      val!,
                      dateRange?.[1]
                        ? dateRange?.[1]
                        : moment().add(1, "d").toDate(),
                    ]);
                  }}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Datepicker
                  className="mt-2" // Add this class
                  value={dateRange?.[1]}
                  onChange={(val) => {
                    setDateRange([
                      dateRange?.[0] ? dateRange?.[0] : moment().toDate(),
                      val!,
                    ]);
                  }}
                />
              </div>
            </div>
          </Drawer.Items>
        </div>
      </Drawer>
    </AdminLayout>
  );
};
export default AccountReport;
