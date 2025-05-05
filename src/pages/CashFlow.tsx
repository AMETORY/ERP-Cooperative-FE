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
import CashFlowComponent from "../components/report/CashFlowComponent";
import { useTranslation } from "react-i18next";

interface CashFlowProps {}

const CashFlow: FC<CashFlowProps> = ({}) => {
  const { t } = useTranslation();
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
        <h1 className="text-3xl text-gray-900 font-bold">{t("cash_flow_statement")}</h1>
        <div className=" mt-8 h-[calc(100vh-180px)] overflow-y-auto">
          {report && <CashFlowComponent cashFlow={report} />}
        </div>
      </div>
    </AdminLayout>
  );
};
export default CashFlow;
