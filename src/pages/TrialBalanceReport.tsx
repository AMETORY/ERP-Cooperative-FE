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
import TrialBalanceComponent from "../components/report/TrialBalanceComponent";
import { useTranslation } from "react-i18next";

interface TrialBalanceReportProps {}

const TrialBalanceReport: FC<TrialBalanceReportProps> = ({}) => {
      const { t } = useTranslation();
  
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
          {t("trial_balance")}
        </h1>
        <small>
          <Moment format="DD MMM YYYY">{report?.start_date}</Moment> -{" "}
          <Moment format="DD MMM YYYY">{report?.end_date}</Moment>
        </small>
        <div className=" mt-8 h-[calc(100vh-200px)] overflow-y-auto">
          {report && (
            <TrialBalanceComponent trialBalance={report} />
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
export default TrialBalanceReport;
