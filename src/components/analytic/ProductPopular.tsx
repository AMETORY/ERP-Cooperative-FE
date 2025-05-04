import { useEffect, useState, type FC } from "react";
import Chart from "react-google-charts";
import { getPopularProducts } from "../../services/api/analyticApi";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

interface ProductPopularChartProps {}

const ProductPopularChart: FC<ProductPopularChartProps> = ({}) => {
    const { t, i18n } = useTranslation();
  
  const [mounted, setMounted] = useState(false);
  const [productCharts, setProductCharts] = useState<any[][]>([]);

  useEffect(() => {
    setMounted(true);

    return () => {};
  }, []);

  useEffect(() => {
    if (mounted) {
      getPopularProducts().then((resp: any) => {
        setProductCharts([
          [t("product"), t("quantity")],
          ...(resp.data??[]).map((item: any) => [item.display_name, item.total_sale]),
        ]);
      }).catch((err) => toast.error(`${err}`));;
    }
  }, [mounted, t]);

  return (
    <div className="bg-white rounded-xl p-2 hover:shadow-lg shadow-sm  min-h-[400px] ">
      <h3 className="font-bold text-lg px-2">{t("popular_products")}</h3>

      <Chart
        chartType="PieChart"
        data={productCharts}
        options={{
          is3D: true,
          // pieSliceText: "value",
          height: 400,
          
        }}
      />
    </div>
  );
};
export default ProductPopularChart;
