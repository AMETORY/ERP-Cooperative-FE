import { useContext, useEffect, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { DateRangeContext, LoadingContext } from "../contexts/LoadingContext";
import {
  balanceSheetReport,
  cogsReport,
  profitLossReport,
} from "../services/api/reportApi";
import { Table } from "flowbite-react";
import { BalanceSheetAccount, BalanceSheetModel } from "../models/report";
import toast from "react-hot-toast";
import { money } from "../utils/helper";
import { Link } from "react-router-dom";
import { LuLink } from "react-icons/lu";

interface BalanceSheetProps {}

const BalanceSheet: FC<BalanceSheetProps> = ({}) => {
  const { setLoading } = useContext(LoadingContext);
  const { dateRange, setDateRange } = useContext(DateRangeContext);
  const [report, setReport] = useState<BalanceSheetModel>();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);

    return () => {};
  }, []);

  useEffect(() => {
    if (mounted && dateRange) {
      setLoading(true);
      balanceSheetReport(dateRange[0], dateRange[1])
        .catch((err) => toast.error(`${err}`))
        .then((resp: any) => {
          setReport(resp.data);
        })
        .finally(() => setLoading(false));
    }
  }, [mounted, dateRange]);
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl text-gray-900 font-bold">Balance Sheet</h1>
        <div className=" mt-4 h-[calc(100vh-200px)] overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md h-fit">
              <Table className="">
                <Table.Body className="divide-y">
                  <Table.Row className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                      AKTIVA
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                    <Table.Cell
                      className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"
                      align="right"
                    >
                      {money(report?.total_assets)}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row className="">
                    <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                      AKTIVA TETAP
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                    <Table.Cell
                      className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"
                      align="right"
                    >
                      Jumlah
                    </Table.Cell>
                  </Table.Row>
                  {report?.fixed_assets.filter((item) => item.sum !== 0).map(
                    (item: BalanceSheetAccount, index: number) => (
                      <Table.Row className="" key={index}>
                        <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white pl-[40px]">
                          <Link
                            to={
                              item.link != ""
                                ? item.link
                                : `/account/${item.id}/report`
                            }
                            className="hover:font-semibold"
                          >
                            {item.code && `${item.code} - `}{item.name}
                          </Link>
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>

                        <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                        <Table.Cell
                          className="whitespace-nowrap  text-gray-900 dark:text-white"
                          align="right"
                        >
                          {money(item.sum)}
                        </Table.Cell>
                      </Table.Row>
                    )
                  )}
                  <Table.Row className="">
                    <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                    <Table.Cell
                      className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"
                      align="right"
                    >
                      {money(report?.total_fixed)}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row className="">
                    <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                      AKTIVA LANCAR
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                    <Table.Cell
                      className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"
                      align="right"
                    >
                      Jumlah
                    </Table.Cell>
                  </Table.Row>
                  {report?.current_assets.filter((item) => item.sum !== 0).map(
                    (item: BalanceSheetAccount, index: number) => (
                      <Table.Row className="" key={index}>
                        <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white pl-[40px]">
                          <Link
                            to={
                              item.link != ""
                                ? item.link
                                : `/account/${item.id}/report`
                            }
                            className="hover:font-semibold"
                          >
                            {item.code && `${item.code} - `}{item.name}
                          </Link>
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>

                        <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                        <Table.Cell
                          className="whitespace-nowrap  text-gray-900 dark:text-white"
                          align="right"
                        >
                          {money(item.sum)}
                        </Table.Cell>
                      </Table.Row>
                    )
                  )}
                  <Table.Row className="">
                    <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                    <Table.Cell
                      className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"
                      align="right"
                    >
                      {money(report?.total_current)}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </div>
            <div className="bg-white rounded-lg shadow-md  h-fit">
              <Table className="">
                <Table.Body className="divide-y">
                  <Table.Row className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                      PASIVA
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                    <Table.Cell
                      className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"
                      align="right"
                    >
                      {money(report?.total_liabilities_and_equity)}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row className="">
                    <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                      HUTANG
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                    <Table.Cell
                      className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"
                      align="right"
                    >
                      Jumlah
                    </Table.Cell>
                  </Table.Row>
                  {report?.liable_assets.filter((item) => item.sum !== 0).map(
                    (item: BalanceSheetAccount, index: number) => (
                      <Table.Row className="" key={index}>
                        <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white pl-[40px]">
                          <Link
                            to={
                              item.link != ""
                                ? item.link
                                : `/account/${item.id}/report`
                            }
                            className="hover:font-semibold"
                          >
                            {item.code && `${item.code} - `}{item.name}
                          </Link>
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>

                        <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                        <Table.Cell
                          className="whitespace-nowrap  text-gray-900 dark:text-white"
                          align="right"
                        >
                          {money(item.sum)}
                        </Table.Cell>
                      </Table.Row>
                    )
                  )}
                  <Table.Row className="">
                    <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                    <Table.Cell
                      className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"
                      align="right"
                    >
                      {money(report?.total_liability)}
                    </Table.Cell>
                  </Table.Row>
                  <Table.Row className="">
                    <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                      MODAL
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                    <Table.Cell
                      className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"
                      align="right"
                    >
                      Jumlah
                    </Table.Cell>
                  </Table.Row>
                  {report?.equity.filter((item) => item.sum !== 0).map(
                    (item: BalanceSheetAccount, index: number) => (
                      <Table.Row className="" key={index}>
                        <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white pl-[40px]">
                          <Link
                            to={
                              item.link != ""
                                ? item.link
                                : `/account/${item.id}/report`
                            }
                            className="hover:font-semibold"
                          >
                            {item.code && `${item.code} - `}{item.name}
                          </Link>
                        </Table.Cell>
                        <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>

                        <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                        <Table.Cell
                          className="whitespace-nowrap  text-gray-900 dark:text-white"
                          align="right"
                        >
                          {money(item.sum)}
                        </Table.Cell>
                      </Table.Row>
                    )
                  )}
                  <Table.Row className="">
                    <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                    <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                    <Table.Cell
                      className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"
                      align="right"
                    >
                      {money(report?.total_equity)}
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BalanceSheet;
