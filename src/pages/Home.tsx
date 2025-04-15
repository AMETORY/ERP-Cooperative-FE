import { Button, Dropdown } from "flowbite-react";
import { useEffect, useState, type FC } from "react";
import { asyncStorage } from "../utils/async_storage";
import {
  LOCAL_STORAGE_TOKEN,
  THIS_MONTH,
  THIS_WEEK,
  TIMERANGE_OPTIONS,
} from "../utils/constants";
import AdminLayout from "../components/layouts/admin";
import {
  getCashBankSum,
  getMonthlyPurchase,
  getMonthlySales,
  getMonthlySalesPurchase,
  getNetWorth,
  getPopularProducts,
  getPurchaseTimeRange,
  getSalesTimeRange,
  getWeeklySalesPurchase,
} from "../services/api/analyticApi";
import moment from "moment";
import Chart from "react-google-charts";
import SalesPurchaseChart from "../components/analytic/SalesPurchaseChart";
import ProductPopular from "../components/analytic/ProductPopular";
import ProductPopularChart from "../components/analytic/ProductPopular";
import { money } from "../utils/helper";
import { ProfitLossModel } from "../models/report";

interface HomeProps {}

const Home: FC<HomeProps> = ({}) => {
  const [mounted, setMounted] = useState(false);
  const [year, setYear] = useState(moment().year());
  const [month, setMonth] = useState(moment().month());
  const [timeRange, setTimeRange] = useState(THIS_MONTH);
  const [salesAmount, setSalesAmount] = useState(0);
  const [purchaseAmount, setPurchaseAmount] = useState(0);
  const [netWorth, setNetWorth] = useState<ProfitLossModel>();
  const [cashBank, setCashBank] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      getSalesTimeRange(timeRange).then((resp: any) => {
        setSalesAmount(resp.data);
      });
      getPurchaseTimeRange(timeRange).then((resp: any) => {
        setPurchaseAmount(resp.data);
      });
      getNetWorth().then((resp: any) => {
        setNetWorth(resp.data);
      });
      getCashBankSum().then((resp: any) => {
        setCashBank(resp.data);
      });
    }
  }, [mounted, timeRange]);
  return (
    <AdminLayout>
      <div className=" bg-gray-50 h-[calc(100vh-60px)] overflow-y-auto">
        <div className="flex justify-end px-8 pt-8 pb-4">
          <Dropdown
            color="gray"
            size="sm"
            label={
              TIMERANGE_OPTIONS.find((item) => item.value === timeRange)?.label
            }
          >
            {TIMERANGE_OPTIONS.map((item) => (
              <Dropdown.Item
                key={item.value}
                onClick={() => setTimeRange(item.value)}
              >
                {item.label}
              </Dropdown.Item>
            ))}
          </Dropdown>
        </div>
        <div className="grid grid-cols-4 gap-8 px-8">
          <div className="bg-white rounded-xl px-4 py-2 hover:shadow-lg shadow-sm  min-h-[60px] ">
            <h3 className="font-bold text-lg">Sales</h3>
            <h1 className="text-right text-2xl mt-8 text-blue-500 font-bold">
              {money(salesAmount)}
            </h1>
          </div>
          <div className="bg-white rounded-xl px-4 py-2 hover:shadow-lg shadow-sm  min-h-[60px] ">
            <h3 className="font-bold text-lg">Purchase</h3>
            <h1 className="text-right text-2xl mt-8 text-red-500 font-bold">
              {money(purchaseAmount)}
            </h1>
          </div>
          <div className="bg-white rounded-xl px-4 py-2 hover:shadow-lg shadow-sm  min-h-[60px] ">
            <h3 className="font-bold text-lg">Net Worth</h3>
            <h1 className="text-right text-2xl mt-8 text-purple-500 font-bold">
              {money(netWorth?.net_profit)}
            </h1>
          </div>
          <div className="bg-white rounded-xl px-4 py-2 hover:shadow-lg shadow-sm  min-h-[60px] ">
            <h3 className="font-bold text-lg">Cash & Bank Summary</h3>
            <h1 className="text-right text-2xl mt-8 text-orange-500 font-bold">
              {money(cashBank, 0)}
            </h1>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 p-8">
          <SalesPurchaseChart />
          <ProductPopularChart />
        </div>
      </div>
    </AdminLayout>
  );
};
export default Home;
