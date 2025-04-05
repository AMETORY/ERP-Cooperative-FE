import { useContext, useEffect, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { DateRangeContext, LoadingContext } from "../contexts/LoadingContext";
import {
  capitalChangeReport,
  cogsReport,
  profitLossReport,
} from "../services/api/reportApi";
import { Table } from "flowbite-react";
import { CapitalChangeModel } from "../models/report";
import toast from "react-hot-toast";
import { money } from "../utils/helper";
import { Link } from "react-router-dom";
import { LuLink } from "react-icons/lu";

interface CapitalChangeProps {}

const CapitalChange: FC<CapitalChangeProps> = ({}) => {
  const { setLoading } = useContext(LoadingContext);
  const { dateRange, setDateRange } = useContext(DateRangeContext);
  const [report, setReport] = useState<CapitalChangeModel>();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);

    return () => {};
  }, []);

  useEffect(() => {
    if (mounted && dateRange) {
      setLoading(true);
      capitalChangeReport(dateRange[0], dateRange[1])
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
          Capital Change Report
        </h1>
        <div className=" mt-8">
          <Table className="">
            <Table.Body className="divide-y">
              <Table.Row className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                  Description
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                <Table.Cell
                  className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"
                  align="right"
                >
                  Amount
                </Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
                  Modal Awal
                </Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell align="right">
                  {money(report?.opening_balance)}
                </Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
                  <Link
                    to={"/profit-loss-statement"}
                    className="hover:font-semibold"
                  >
                    Laba Rugi
                  </Link>
                </Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell align="right">
                  {money(report?.profit_loss)}
                </Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
                 
                    Prive / Dividen
                </Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell align="right">
                  {money(report?.prived_balance)}
                </Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
                 
                    Penambahan Modal
                </Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell align="right">
                  {money(report?.capital_change_balance)}
                </Table.Cell>
              </Table.Row>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
                 
                    Modal Akhir
                </Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell align="right">
                  {money(report?.ending_balance)}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CapitalChange;
