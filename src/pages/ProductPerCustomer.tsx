import { useEffect, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { useTranslation } from "react-i18next";
import { Button, Datepicker, Dropdown, Label, Tooltip } from "flowbite-react";
import moment from "moment";
import { ContactModel } from "../models/contact";
import { getContacts } from "../services/api/contactApi";
import Select from "react-select";
import { ProductModel } from "../models/product";
import { getProduct, getProducts } from "../services/api/productApi";
import { getProductSalesCustomers } from "../services/api/reportApi";
import { ProductSalesCustomerReport } from "../models/report";
import { money } from "../utils/helper";

interface ProductPerCustomerProps {}

const ProductPerCustomer: FC<ProductPerCustomerProps> = ({}) => {
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState(
    moment().subtract(7, "days").toDate()
  );
  const [endDate, setEndDate] = useState(moment().add(1, "days").toDate());
  const [customers, setCustomers] = useState<ContactModel[]>([]);
  const [products, setProducts] = useState<ProductModel[]>([]);
  const [report, setReport] = useState<ProductSalesCustomerReport>();
  const [view, setView] = useState("quantity");
  const [selectedCustomers, setSelectedCustomers] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedProducts, setSelectedProducts] = useState<
    { label: string; value: string }[]
  >([]);

  const viewOptions = [
    { value: "quantity", label: t(`quantity`) },
    { value: "amount", label: t(`amount`) },
  ];

  useEffect(() => {
    getContacts({
      page: 1,
      size: 10,
      is_customer: true,
    }).then((res: any) => {
      setCustomers(res.data.items);
    });
    getProducts({
      page: 1,
      size: 10,
      is_customer: true,
    }).then((res: any) => {
      setProducts(res.data.items);
    });
  }, []);

  const generateReport = async (isDownload: boolean) => {
    const data = {
      start_date: startDate,
      end_date: endDate,
      product_ids: selectedProducts.map((p) => p.value),
      customer_ids: selectedCustomers.map((c) => c.value),
      view,
      is_download: isDownload,
    };
    getProductSalesCustomers(data).then((res: any) => {
      
      if (isDownload) {
        const blob = new Blob([res], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "report.xlsx";
        link.click();
      } else {
        setReport(res);
      }
    });
  };

  const timeRange = () => (
    <div className="mt-4 w-full">
      <Dropdown
        label={<strong className="font-semibold">Time Range</strong>}
        inline
      >
        <Dropdown.Item>
          <button
            onClick={() => {
              const start = new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                1
              );
              const end = new Date(
                new Date().getFullYear(),
                new Date().getMonth() + 1,
                0
              );
              setStartDate(start);
              setEndDate(end);
            }}
          >
            This Month
          </button>
        </Dropdown.Item>
        <Dropdown.Item>
          <button
            onClick={() => {
              const start = new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate() - new Date().getDay() + 1
              );
              const end = new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate() - new Date().getDay() + 7
              );
              setStartDate(start);
              setEndDate(end);
            }}
          >
            This Week
          </button>
        </Dropdown.Item>
        {[...Array(4)].map((_, i) => {
          const quarter = i + 1;
          const start = new Date(
            new Date().getFullYear(),
            (quarter - 1) * 3,
            1
          );
          const end = new Date(new Date().getFullYear(), quarter * 3, 0);
          return (
            <Dropdown.Item
              key={i}
              onClick={() => {
                setStartDate(start);
                setEndDate(end);
              }}
            >
              Q{quarter}
            </Dropdown.Item>
          );
        })}
        <Dropdown.Item>
          <button
            onClick={() => {
              const start = new Date(new Date().getFullYear(), 0, 1);
              const end = new Date(new Date().getFullYear(), 11, 31);
              setStartDate(start);
              setEndDate(end);
            }}
          >
            This Year
          </button>
        </Dropdown.Item>
        <Dropdown.Item>
          <button
            onClick={() => {
              const start = new Date(new Date().getFullYear() - 1, 0, 1);
              const end = new Date(new Date().getFullYear() - 1, 11, 31);
              setStartDate(start);
              setEndDate(end);
            }}
          >
            Last Year
          </button>
        </Dropdown.Item>
        <Dropdown.Item>
          <button
            onClick={() => {
              const start = new Date(
                new Date().getFullYear() - 1,
                new Date().getMonth(),
                1
              );
              const end = new Date(
                new Date().getFullYear() - 1,
                new Date().getMonth() + 1,
                0
              );
              setStartDate(start);
              setEndDate(end);
            }}
          >
            Last Month
          </button>
        </Dropdown.Item>
      </Dropdown>
    </div>
  );
  return (
    <AdminLayout>
      <div className="p-6 h-[calc(100vh-65px)] flex flex-row">
        <div className="flex flex-grow flex-col px-4 ">
          <h1 className="text-3xl text-gray-900 font-bold">
            {t("product_per_customer")}
          </h1>
          <div className="overflow-auto">
            {report && (
              <table className=" border border-gray-300 mt-4">
                <thead>
                  <tr>
                    <th
                      className="px-4 py-2 text-sm border text-center align-middle border-gray-300"
                      rowSpan={2}
                    >
                      {t("code")}
                    </th>
                    {Object.keys(report?.products ?? {}).map((key) => (
                      <th
                        className="px-4 py-2 text-sm border border-gray-300"
                        key={key}
                      >
                        {report?.products[key].product_name}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    {Object.keys(report?.products ?? {}).map((key) => (
                      <th
                        className="px-4 py-2 text-sm border border-gray-300"
                        key={key}
                      >
                        {report?.products[key].product_code}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(report?.contacts ?? {}).map((key) => (
                    <tr key={key}>
                      <td className="px-4 py-2 text-sm border border-gray-300">
                        <Tooltip
                          content={report?.contacts[key].contact_name}
                          placement="right"
                        >
                          <span className="ml-2">
                            {report?.contacts[key].contact_code ??
                              report?.contacts[key].contact_name}
                          </span>
                        </Tooltip>
                      </td>
                      {Object.keys(report?.products ?? {}).map((keyProduct) => (
                        <td
                          className="px-4 py-2 text-sm border border-gray-300 text-center"
                          key={keyProduct}
                        >
                          {view == "quantity" &&
                          (report?.data[keyProduct][key] ?? []).length > 0
                            ? `${money(
                                report?.data[keyProduct][key][0].total_quantity
                              )} ${report?.data[keyProduct][key][0].unit_code}`
                            : ""}
                          {view == "amount" &&
                          (report?.data[keyProduct][key] ?? []).length > 0
                            ? money(
                                report?.data[keyProduct][key][0].total_price
                              )
                            : ""}

                          {(report?.data[keyProduct][key] ?? []).length == 0 &&
                            "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <th className="px-4 py-2 text-sm border text-center align-middle border-gray-300">
                    {t("total")}
                  </th>
                  {Object.keys(report?.products ?? {}).map((key) => (
                    <th
                      className="px-4 py-2 text-sm border border-gray-300"
                      key={key}
                    >
                      {view == "quantity" &&
                        `${money(report?.grand_total_quantity[key])} ${
                          report?.products[key].unit_code
                        }`}
                      {view == "amount" &&
                        money(report?.grand_total_amount[key])}
                    </th>
                  ))}
                </tfoot>
              </table>
            )}
            {!report && <div>{t("no_data")}</div>}
          </div>
        </div>
        <div className="w-[300px] p-4 h-full border-l">
          <div className="flex flex-col space-y-4">
            <h3 className="font-semibold text-2xl">Filter</h3>
            <div>
              <Label>Start Date</Label>
              <Datepicker
                className="mt-2" // Add this class
                value={startDate}
                onChange={(val) => {
                  setStartDate(val!);
                }}
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Datepicker
                className="mt-2" // Add this class
                value={endDate}
                onChange={(val) => {
                  setEndDate(val!);
                }}
              />
            </div>
            {timeRange()}
            <div>
              <Label>{t("customer")}</Label>
              <Select
                options={customers.map((customer) => ({
                  label: customer.name!,
                  value: customer.id!,
                }))}
                isMulti
                value={selectedCustomers}
                onChange={(val) => {
                  setSelectedCustomers(val.map((customer) => customer));
                }}
                onInputChange={(val) => {
                  getContacts({
                    page: 1,
                    size: 10,
                    is_customer: true,
                    search: val,
                  }).then((res: any) => {
                    setCustomers(res.data.items);
                  });
                }}
              />
            </div>

            <div>
              <Label>{t("products")}</Label>
              <Select
                options={products.map((customer) => ({
                  label: customer.name!,
                  value: customer.id!,
                }))}
                isMulti
                value={selectedProducts}
                onChange={(val) => {
                  setSelectedProducts(val.map((customer) => customer));
                }}
                onInputChange={(val) => {
                  getProducts({
                    page: 1,
                    size: 10,
                    is_customer: true,
                    search: val,
                  }).then((res: any) => {
                    setProducts(res.data.items);
                  });
                }}
              />
            </div>
            <div>
              <Label>{t("mode")}</Label>
              <Select
                options={viewOptions}
                value={viewOptions.find((v) => v.value == view)}
                onChange={(val) => {
                  setView(val!.value);
                }}
              />
            </div>
            <Button onClick={() => generateReport(false)}>{t("generate_report")}</Button>
            {report && (
                <Button onClick={() => generateReport(true)}>{t("download_report")}</Button>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
export default ProductPerCustomer;
