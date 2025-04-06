import { useContext, useEffect, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { DateRangeContext, LoadingContext } from "../contexts/LoadingContext";
import {
  cashFlowReport,
  cogsReport,
  profitLossReport,
} from "../services/api/reportApi";
import { Table } from "flowbite-react";
import { CashflowSubGroup, CashFlowReport } from "../models/report";
import toast from "react-hot-toast";
import { money } from "../utils/helper";
import { Link } from "react-router-dom";
import { LuLink } from "react-icons/lu";

interface CashFlowProps {}

const CashFlow: FC<CashFlowProps> = ({}) => {
  const { setLoading } = useContext(LoadingContext);
  const { dateRange, setDateRange } = useContext(DateRangeContext);
  const [report, setReport] = useState<CashFlowReport>();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);

    return () => {};
  }, []);

  useEffect(() => {
    if (mounted && dateRange) {
      setLoading(true);
      cashFlowReport(dateRange[0], dateRange[1])
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
        <h1 className="text-3xl text-gray-900 font-bold">Cash Flow Report</h1>
        <div className=" mt-8 h-[calc(100vh-180px)] overflow-y-auto">
          <Table className="" hoverable>
            <Table.Body className="divide-y">
              <Table.Row className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                  OPERASIONAL
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
              {report?.operating.map(
                (item: CashflowSubGroup, index: number) => (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={index}
                  >
                    <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
                      {item.description}
                    </Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell align="right">{money(item.amount)}</Table.Cell>
                  </Table.Row>
                )
              )}
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white"></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell align="right" className="font-semibold">
                  {money(report?.total_operating)}
                </Table.Cell>
              </Table.Row>
              <Table.Row className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                  INVESTASI
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

              {report?.investing.map(
                (item: CashflowSubGroup, index: number) => (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={index}
                  >
                    <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
                      {item.description}
                    </Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell align="right">{money(item.amount)}</Table.Cell>
                  </Table.Row>
                )
              )}
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white"></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell align="right" className="font-semibold">
                  {money(report?.total_investing)}
                </Table.Cell>
              </Table.Row>
              <Table.Row className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                  PENDANAAN
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
              {report?.financing.map(
                (item: CashflowSubGroup, index: number) => (
                  <Table.Row
                    className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    key={index}
                  >
                    <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
                      {item.description}
                    </Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell></Table.Cell>
                    <Table.Cell align="right">{money(item.amount)}</Table.Cell>
                  </Table.Row>
                )
              )}
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white"></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell align="right" className="font-semibold">
                  {money(report?.total_financing)}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};
export default CashFlow;
