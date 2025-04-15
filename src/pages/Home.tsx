import { Button } from "flowbite-react";
import { useEffect, useState, type FC } from "react";
import { asyncStorage } from "../utils/async_storage";
import { LOCAL_STORAGE_TOKEN, THIS_WEEK } from "../utils/constants";
import AdminLayout from "../components/layouts/admin";
import {
  getMonthlyPurchase,
  getMonthlySales,
  getMonthlySalesPurchase,
  getPopularProducts,
  getPurchaseTimeRange,
  getSalesTimeRange,
  getWeeklySalesPurchase,
} from "../services/api/analyticApi";
import moment from "moment";
import Chart from "react-google-charts";
import SalesPurchaseChart from "../components/analytic/SalesPurchaseChart";

interface HomeProps {}

const Home: FC<HomeProps> = ({}) => {
  const [mounted, setMounted] = useState(false);
  const [year, setYear] = useState(moment().year());
  const [month, setMonth] = useState(moment().month());
  const [timeRange, setTimeRange] = useState(THIS_WEEK);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      getPopularProducts();

      getSalesTimeRange(timeRange);
      getPurchaseTimeRange(timeRange);
    }
  }, [mounted]);
  return (
    <AdminLayout>
      <div className=" bg-gray-50 h-[calc(100vh-60px)] overflow-y-auto">
        <div className="grid grid-cols-2 gap-8 p-8">
          <SalesPurchaseChart />
          <div className="bg-white rounded-xl p-2 hover:shadow-lg shadow-sm  min-h-[400px]">
            <Chart
              chartType="PieChart"
              data={[
                ["Product", "Quantity"],
                ["Product 1", 1],
                ["Product 2", 2],
                ["Product 3", 3],
                ["Product 4", 4],
                ["Product 5", 5],
              ]}
              options={{
                title: "Popular Products",
                is3D: true,
                // pieSliceText: "value",
                height: 400,
              }}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
export default Home;
