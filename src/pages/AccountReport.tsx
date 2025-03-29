import { useContext, useEffect, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { LoadingContext } from "../contexts/LoadingContext";
import { TransactionModel } from "../models/transaction";
import { PaginationResponse } from "../objects/pagination";
import { SearchContext } from "../contexts/SearchContext";
import { Link, useParams } from "react-router-dom";
import { getTransactions } from "../services/api/transactionApi";
import { getPagination, money } from "../utils/helper";
import { LuFilter } from "react-icons/lu";
import { Pagination, Table } from "flowbite-react";
import Moment from "react-moment";

interface AccountReportProps {}

const AccountReport: FC<AccountReportProps> = ({}) => {
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

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (mounted && accountId) {
      getTransactions({ page, size, search, account_id: accountId }).then(
        (resp: any) => {
          setTransactions(resp.data.items);
          setPagination(getPagination(resp.data));
        }
      );
    }

    return () => {};
  }, [mounted, page, size, search, accountId]);
  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold ">Account Report</h1>
          <div className="flex items-center gap-2">
            {/* <Button gradientDuoTone="purpleToBlue" pill onClick={onAdd}>
                + {label}
              </Button> */}
            <LuFilter
              className=" cursor-pointer text-gray-400 hover:text-gray-600"
              onClick={() => {}}
            />
          </div>
        </div>
        <Table>
          <Table.Head>
            <Table.HeadCell>Date</Table.HeadCell>
            <Table.HeadCell>Description</Table.HeadCell>
            <Table.HeadCell>Amount</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Account</Table.HeadCell>
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
                  <Link
                    to={`/account/${transaction?.transaction_ref?.account?.id}/report`}
                  >
                    {transaction.transaction_ref?.account?.name}
                  </Link>
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
      </div>
    </AdminLayout>
  );
};
export default AccountReport;
