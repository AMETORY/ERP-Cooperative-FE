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
import Moment from "react-moment";
import BalanceSheetComponent from "../components/report/BalanceSheetComponent";
import { useTranslation } from "react-i18next";

interface BalanceSheetProps {}

const BalanceSheet: FC<BalanceSheetProps> = ({}) => {
  const { t } = useTranslation();
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
        <div>
          <h1 className="text-3xl text-gray-900 font-bold">{t("balance_sheet")}</h1>
        </div>
        <div className=" mt-4 h-[calc(100vh-200px)] overflow-y-auto p-4">
          {report && <BalanceSheetComponent balanceSheet={report} />}
        </div>
      </div>
    </AdminLayout>
  );
};

export default BalanceSheet;
