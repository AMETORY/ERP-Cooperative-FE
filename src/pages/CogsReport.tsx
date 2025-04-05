import { useContext, useEffect, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { DateRangeContext } from "../contexts/LoadingContext";
import { cogsReport } from "../services/api/reportApi";

interface CogsReportProps {}

const CogsReport: FC<CogsReportProps> = ({}) => {
  const { dateRange, setDateRange } = useContext(DateRangeContext);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);

    return () => {};
  }, []);

  useEffect(() => {
    if (mounted && dateRange) {
      cogsReport(dateRange[0], dateRange[1]);
    }
  }, [mounted, dateRange]);
  return (
    <AdminLayout>
      <div className="container">
        <h1 className="text-3xl text-gray-900 font-bold">Cogs Report</h1>
      </div>
    </AdminLayout>
  );
};
export default CogsReport;
