import { useContext, useEffect, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { DateRangeContext, LoadingContext } from "../contexts/LoadingContext";
import { cogsReport } from "../services/api/reportApi";
import { Table } from "flowbite-react";
import { CogsReportModel } from "../models/report";
import toast from "react-hot-toast";
import { money } from "../utils/helper";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface CogsReportProps {}

const CogsReport: FC<CogsReportProps> = ({}) => {
      const { t } = useTranslation();
  
  const { setLoading } = useContext(LoadingContext);
  const { dateRange, setDateRange } = useContext(DateRangeContext);
  const [report, setReport] = useState<CogsReportModel>();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);

    return () => {};
  }, []);

  useEffect(() => {
    if (mounted && dateRange) {
      setLoading(true);
      cogsReport(dateRange[0], dateRange[1])
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
        <h1 className="text-3xl text-gray-900 font-bold">{t('cogs_statement')}</h1>
        <div className=" mt-8">
          <Table className="">
            <Table.Head>
              <Table.HeadCell>{t('description')}</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
              <Table.HeadCell align="right">{t('amount')}</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
                  {t('beginning_inventory')}
                </Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell align="right">
                  {money(report?.beginning_inventory)}
                </Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
                  {t('purchases')}
                </Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell align="right">
                  {money(report?.purchases)}
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
                  {t('freight_in_and_other_cost')}
                </Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell align="right">
                  {money(report?.freight_in_and_other_cost)}
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
                <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                  {t('total_purchases')}
                </Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell align="right" className=" font-semibold ">
                  {money(report?.total_purchases)}
                </Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
                  {t('purchase_discounts')}
                </Table.Cell>
                <Table.Cell align="right">
                  {money(report?.purchase_discounts)}
                </Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
                  {t('purchase_returns')}
                </Table.Cell>
                <Table.Cell align="right">
                  {money(report?.purchase_returns)}
                </Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
                <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                  {t('total_purchase_discounts')}
                </Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell align="right" className=" font-semibold ">
                  {money(report?.total_purchase_discounts)}
                </Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
                <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                  {t('net_purchases')}
                </Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell align="right" className=" font-semibold ">
                  {money(report?.net_purchases)}
                </Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
                <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                  {t('goods_available')}
                </Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell align="right" className=" font-semibold ">
                  {money(report?.goods_available)}
                </Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
                <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                  <Link
                    to={`/account/${report?.inventory_account?.id}/report`}
                    className="hover:font-semibold"
                  >
                    {t('ending_inventory')}
                  </Link>
                </Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell align="right" className=" font-semibold ">
                  {money(-(report?.ending_inventory ?? 0))}
                </Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
                <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                  {t('stock_opname')}
                </Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell align="right" className=" font-semibold ">
                  {money(report?.stock_opname)}
                </Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
                <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                  {t('cogs')}
                </Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell align="right" className=" font-semibold ">
                  {money(report?.cogs)}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};
export default CogsReport;
