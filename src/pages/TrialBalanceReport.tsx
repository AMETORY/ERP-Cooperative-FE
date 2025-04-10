import { useContext, useEffect, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { Table } from "flowbite-react";
import { DateRangeContext, LoadingContext } from "../contexts/LoadingContext";
import { trialBalanceReport } from "../services/api/reportApi";
import toast from "react-hot-toast";
import { CashFlowReport } from "../models/report";
import { TrialBalanceReportModel } from "../models/trial_balance";
import { money } from "../utils/helper";
import Moment from "react-moment";

interface TrialBalanceReportProps {}

const TrialBalanceReport: FC<TrialBalanceReportProps> = ({}) => {
  const { setLoading } = useContext(LoadingContext);
  const { dateRange, setDateRange } = useContext(DateRangeContext);
  const [report, setReport] = useState<TrialBalanceReportModel>();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);

    return () => {};
  }, []);

  useEffect(() => {
    if (mounted && dateRange) {
      setLoading(true);
      trialBalanceReport(dateRange[0], dateRange[1])
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
        <h1 className="text-3xl text-gray-900 font-bold">
          Trial Balance Report
        </h1>
        <small>
          <Moment format="DD MMM YYYY">{report?.start_date}</Moment> -{" "}
          <Moment format="DD MMM YYYY">{report?.end_date}</Moment>
        </small>
        <div className=" mt-8 h-[calc(100vh-200px)] overflow-y-auto">
          <Table className="" hoverable>
            <Table.Body className="divide-y">
              <Table.Row className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell></Table.Cell>
                <Table.Cell colSpan={2} className="font-semibold text-center">
                  Saldo Awal
                </Table.Cell>
                <Table.Cell colSpan={2} className="font-semibold text-center">
                  Pergerakan
                </Table.Cell>
                <Table.Cell colSpan={2} className="font-semibold text-center">
                  Saldo Akhir
                </Table.Cell>
              </Table.Row>
              <Table.Row className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="font-semibold text-center"></Table.Cell>
                <Table.Cell className="font-semibold text-center">
                  Debit
                </Table.Cell>
                <Table.Cell className="font-semibold text-center">
                  Kredit
                </Table.Cell>
                <Table.Cell className="font-semibold text-center">
                  Debit
                </Table.Cell>
                <Table.Cell className="font-semibold text-center">
                  Kredit
                </Table.Cell>
                <Table.Cell className="font-semibold text-center">
                  Debit
                </Table.Cell>
                <Table.Cell className="font-semibold text-center">
                  Kredit
                </Table.Cell>
              </Table.Row>
              {report?.trial_balance.map((item, index) => (
                <Table.Row key={index}>
                  <Table.Cell className="font-semibold">
                    {item.code && `(${item.code})`} - {item.name}
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    {item.debit > 0 ? money(item.debit) : "-"}
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    {item.credit > 0 ? money(item.credit) : "-"}
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    {report?.adjustment[index].debit > 0
                      ? money(report?.adjustment[index].debit, 0)
                      : "-"}
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    {report?.adjustment[index].credit > 0
                      ? money(report?.adjustment[index].credit, 0)
                      : "-"}
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    {report?.balance_sheet[index].debit > 0
                      ? money(report?.balance_sheet[index].debit, 0)
                      : "-"}
                  </Table.Cell>
                  <Table.Cell className="text-right">
                    {report?.balance_sheet[index].credit > 0
                      ? money(report?.balance_sheet[index].credit, 0)
                      : "-"}
                  </Table.Cell>
                </Table.Row>
              ))}
              <Table.Row>
                <Table.Cell className="font-semibold text-right">
                    TOTAL
                </Table.Cell>
                <Table.Cell className="text-right font-semibold">
                  {money(
                    report?.trial_balance.reduce(
                      (acc, item) => acc + item.debit,
                      0
                    )
                  )}
                </Table.Cell>
                <Table.Cell className="text-right font-semibold">
                  {money(
                    report?.trial_balance.reduce(
                      (acc, item) => acc + item.credit,
                      0
                    )
                  )}
                </Table.Cell>
                <Table.Cell className="text-right font-semibold">
                  {money(
                    report?.adjustment.reduce(
                      (acc, item) => acc + item.debit,
                      0
                    )
                  )}
                </Table.Cell>
                <Table.Cell className="text-right font-semibold">
                  {money(
                    report?.adjustment.reduce(
                      (acc, item) => acc + item.credit,
                      0
                    )
                  )}
                </Table.Cell>
                <Table.Cell className="text-right font-semibold">
                  {money(
                    report?.balance_sheet.reduce(
                      (acc, item) => acc + item.debit,
                      0
                    )
                  )}
                </Table.Cell>
                <Table.Cell className="text-right font-semibold">
                  {money(
                    report?.balance_sheet.reduce(
                      (acc, item) => acc + item.credit,
                      0
                    )
                  )}
                </Table.Cell>
                
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};
export default TrialBalanceReport;
