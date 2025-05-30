import { useEffect, useState, type FC } from "react";
import Chart from "react-google-charts";
import {
  getMonthlySalesPurchase,
  getWeeklySalesPurchase,
} from "../../services/api/analyticApi";
import moment from "moment";
import { MONTHLY, WEEKLY } from "../../utils/constants";
import { Dropdown } from "flowbite-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

interface SalesPurchaseChartProps {}

const SalesPurchaseChart: FC<SalesPurchaseChartProps> = ({}) => {
    const { t, i18n } = useTranslation();
  
  const [salesPurchaseChart, setSalesPurchaseChart] = useState<any[][]>([]);
  const [salesPurchaseTitle, setSalesPurchaseTitle] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const [year, setYear] = useState(moment().year());
  const [month, setMonth] = useState(moment().month());
  const [mode, setMode] = useState(MONTHLY);

  useEffect(() => {
    setMounted(true);

    return () => {};
  }, []);

  useEffect(() => {
    if (mounted) {
      if (mode === MONTHLY) {
        getMonthlySalesPurchase(year).then((resp: any) => {
          setSalesPurchaseTitle(resp.data.title);
          setSalesPurchaseChart([
            [t("month"), t("sales"), t("purchase")],
            ...resp.data.data.map((item: any) => [
              item.month,
              item.sales,
              item.purchase,
            ]),
          ]);
        }).catch((err) => toast.error(`${err}`));;
      }
      if (mode === WEEKLY) {
        getWeeklySalesPurchase(month + 1, year).then((resp: any) => {
          setSalesPurchaseTitle(resp.data.title);
          setSalesPurchaseChart([
            [t("week"), t("sales"), t("purchase")],
            ...resp.data.data.map((item: any) => [
              item.week,
              item.sales,
              item.purchase,
            ]),
          ]);
        }).catch((err) => toast.error(`${err}`));;
      }
    }
  }, [mounted, mode, t]);
  return (
    <div className="bg-white rounded-xl p-2 hover:shadow-lg shadow-sm  min-h-[400px] col-span-2">
      <div className="flex justify-between pt-2 px-2">
        <h3 className="font-bold text-lg">{t("sales_purchase")}</h3>
        <Dropdown inline label={mode == MONTHLY ? t("monthly") : t("weekly")}>
          <Dropdown.Item onClick={() => setMode(MONTHLY)}>
            {t("monthly")}
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setMode(WEEKLY)}>
            {t("weekly")}
          </Dropdown.Item>
        </Dropdown>
      </div>
      <Chart
        chartType="ColumnChart"
        data={salesPurchaseChart}
        options={{
          title: salesPurchaseTitle,
          legend: "none",
          hAxis: {
            title: mode == MONTHLY ? t("monthly") : t("weekly"),
          },
          vAxis: {
            title: t("Total"),
          },
          series: {
            0: { color: "#007bff" },
            1: { color: "#dc3545" },
          },
          height: 400,
        }}
      />
    </div>
  );
};
export default SalesPurchaseChart;
