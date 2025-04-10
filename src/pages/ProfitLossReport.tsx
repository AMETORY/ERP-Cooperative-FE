import { useContext, useEffect, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { DateRangeContext, LoadingContext } from "../contexts/LoadingContext";
import { cogsReport, profitLossReport } from "../services/api/reportApi";
import { Table } from "flowbite-react";
import { ProfitLossAccount, ProfitLossModel } from "../models/report";
import toast from "react-hot-toast";
import { money } from "../utils/helper";
import { Link } from "react-router-dom";
import { LuLink } from "react-icons/lu";

interface ProfitLossProps {}

const ProfitLoss: FC<ProfitLossProps> = ({}) => {
  const { setLoading } = useContext(LoadingContext);
  const { dateRange, setDateRange } = useContext(DateRangeContext);
  const [report, setReport] = useState<ProfitLossModel>();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);

    return () => {};
  }, []);

  useEffect(() => {
    if (mounted && dateRange) {
      setLoading(true);
      profitLossReport(dateRange[0], dateRange[1])
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
        <h1 className="text-3xl text-gray-900 font-bold">Profit Loss Report</h1>
        <div className=" mt-8">
          <Table className="">
            <Table.Body className="divide-y">
              <Table.Row className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                  PENDAPATAN
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
              {report?.profit
                .filter((item) => item.sum !== 0)
                .map((item: ProfitLossAccount, index: number) => (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={index}
                  >
                    <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
                      <Link
                        to={
                          item.link != ""
                            ? item.link
                            : `/account/${item.id}/report`
                        }
                        className="hover:font-semibold"
                      >
                        {item.name}
                      </Link>
                    </Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell align="right">{money(item.sum)}</Table.Cell>
                  </Table.Row>
                ))}
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                  Laba Kotor
                </Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell align="right" className="font-semibold">
                  {money(report?.gross_profit)}
                </Table.Cell>
              </Table.Row>

              <Table.Row className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                  PENGELUARAN
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
              {report?.loss
                .filter((item) => item.sum !== 0)
                .map((item: ProfitLossAccount, index: number) => (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={index}
                  >
                    <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
                      <Link
                        to={
                          item.link != ""
                            ? item.link
                            : `/account/${item.id}/report`
                        }
                        className="hover:font-semibold"
                      >
                        {item.name}
                      </Link>
                    </Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell align="right">{money(item.sum)}</Table.Cell>
                  </Table.Row>
                ))}
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                  Total Pengeluaran
                </Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell align="right" className="font-semibold">
                  {money(report?.total_expense)}
                </Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                  LABA RUGI
                </Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell align="right" className="font-semibold">
                  {money(report?.net_profit)}
                </Table.Cell>
              </Table.Row>
              {(report?.total_net_surplus ?? 0) != 0 && (
                <Table.Row className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                    Sisa Hasil Usaha Sudah Dibagi
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
              )}
              {report?.net_surplus
                .filter((item) => item.sum !== 0)
                .map((item: ProfitLossAccount, index: number) => (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={index}
                  >
                    <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
                      <Link
                        to={
                          item.link != ""
                            ? item.link
                            : `/account/${item.id}/report`
                        }
                        className="hover:font-semibold"
                      >
                        {item.name}
                      </Link>
                    </Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell align="right">{money(item.sum)}</Table.Cell>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};
export default ProfitLoss;
