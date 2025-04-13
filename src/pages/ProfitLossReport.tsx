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
import ProfitLossComponent from "../components/report/ProfitLossComponent";

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
          {report && <ProfitLossComponent profitLoss={report} />}
          </div>
      </div>
    </AdminLayout>
  );
};
export default ProfitLoss;
