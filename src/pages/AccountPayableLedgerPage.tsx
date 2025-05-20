import { useEffect, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { useTranslation } from "react-i18next";
import { Button, Datepicker, Dropdown, Label } from "flowbite-react";
import moment from "moment";
import { ContactModel } from "../models/contact";
import { getContacts } from "../services/api/contactApi";
import Select from "react-select";
import { getAccountPayableLedger } from "../services/api/reportApi";
import toast from "react-hot-toast";
import { LedgerReport } from "../models/report";
import { money } from "../utils/helper";
import { useNavigate } from "react-router-dom";

interface AccountPayableLedgerPageProps {}

const AccountPayableLedgerPage: FC<
  AccountPayableLedgerPageProps
> = ({}) => {
  const { t } = useTranslation();
  const [report, setReport] = useState<LedgerReport>();
  const nav = useNavigate();
  const [startDate, setStartDate] = useState(
    moment().subtract(7, "days").toDate()
  );
  const [endDate, setEndDate] = useState(moment().add(1, "days").toDate());
  const [customers, setCustomers] = useState<ContactModel[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<{
    label: string;
    value: string;
  }>();

  useEffect(() => {
    getContacts({
      page: 1,
      size: 10,
      is_vendor: true,
      is_supplier: true,
    }).then((res: any) => {
      setCustomers(res.data.items);
    });
  }, []);

  const generateReport = (isDownload: boolean) => {
    if (!selectedCustomer) {
      toast.error("Customer is required");
      return;
    }
    const data = {
      start_date: startDate,
      end_date: endDate,
      contact_id: selectedCustomer?.value,
      is_download: isDownload,
    };

    getAccountPayableLedger(data)
      .then((res: any) => {
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
          setReport(res.data);
        }
      })
      .catch((err: any) => {
        toast.error(err.message);
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
            {t("accounts_payable_subsidiary_ledger")}
          </h1>
          <div className="overflow-auto">
            {report && (
              <div>
                <table className="w-full border border-gray-400 text-sm mb-6">
                  <tbody>
                    <tr className="border border-gray-400">
                      <td className="p-2 border border-gray-300 w-1/2">
                        {t("name")}{" "}
                        <span className="font-semibold ml-2">
                          {report.contact?.name}
                        </span>
                      </td>
                      <td className="p-2 border border-gray-300">
                        {t("code")}{" "}
                        <span className="font-semibold ml-2">
                          {report.contact?.code}
                        </span>
                      </td>
                    </tr>
                    <tr className="border border-gray-400">
                      <td className="p-2 border border-gray-300">
                        {t("address")}{" "}
                        <span className="font-semibold ml-2">
                          {report.contact?.address}
                        </span>
                      </td>
                      <td className="p-2 border border-gray-300">
                        Telp. {" "}
                        <span className="font-semibold ml-2">
                          {report?.contact?.phone}
                        </span>
                      </td>
                    </tr>
                    <tr className="border border-gray-400">
                    
                      <td className="p-2 border border-gray-300">
                        Batas Kredit{" "}
                        <span className="font-semibold ml-2">
                          {money(report?.contact?.receivables_limit)}
                        </span>
                      </td>
                      <td className="p-2 border border-gray-300">
                       Sisa Batas Kredit{" "}
                        <span className="font-semibold ml-2">
                          {money(report?.contact?.receivables_limit_remain)}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Tabel Transaksi */}
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-400 text-sm">
                    <thead>
                      <tr className="bg-gray-200 text-center font-semibold">
                        <th rowSpan={2} className="border border-gray-300 p-2">
                          Tgl.
                        </th>
                        <th rowSpan={2} className="border border-gray-300 p-2">
                          Keterangan
                        </th>
                        <th rowSpan={2} className="border border-gray-300 p-2">
                          Ref
                        </th>
                        <th colSpan={2} className="border border-gray-300 p-2">
                          Mutasi
                        </th>
                        <th rowSpan={2} className="border border-gray-300 p-2">
                          Saldo
                        </th>
                      </tr>
                      <tr className="bg-gray-100 text-center">
                        <th className="border border-gray-300 p-2">Debet</th>
                        <th className="border border-gray-300 p-2">Kredit</th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {report.total_balance_before != 0 && (
                        <tr>
                          <td className="border border-gray-300 p-2"></td>
                          <td
                            className="border border-gray-300 p-2 text-left font-semibold"
                            colSpan={2}
                          >
                            Saldo
                          </td>
                         <td className="border border-gray-300 p-2">
                            {report.total_debit_before != 0 && money(report.total_debit_before)}
                          </td>
                           <td className="border border-gray-300 p-2">
                            {report.total_credit_before != 0 && money(report.total_credit_before)}
                          </td>       
                          <td className="border border-gray-300 p-2">
                            {report.total_balance_before != 0 && money(report.total_balance_before)}
                          </td>
                        </tr>
                      )}
                      {report.ledgers.map((ledger) => (
                        <tr key={ledger.id}>
                          <td className="border border-gray-300 p-2">
                            {moment(ledger.date).format("DD-MM-YYYY")}
                          </td>
                          <td className="border border-gray-300 p-2 text-left">
                            {ledger.description}
                          </td>
                          <td className="border border-gray-300 p-2 hover:font-semibold hover:underline cursor-pointer" onClick={() => nav(`/purchase/${ledger.ref_id}`)}>
                            {ledger.ref}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {ledger.debit != 0 && money(ledger.debit)}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {ledger.credit != 0 && money(ledger.credit)}
                          </td>
                          <td className="border border-gray-300 p-2">
                            {ledger.balance != 0 && money(ledger.balance)}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td className="border border-gray-300 p-2"></td>
                        <td
                          className="border border-gray-300 p-2 text-left font-semibold"
                          colSpan={2}
                        >
                          Sub Total
                        </td>
                        <td className="border border-gray-300 p-2">
                          {report.total_debit != 0 && money(report.total_debit)}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {report.total_credit != 0 && money(report.total_credit)}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {report.total_balance != 0 && money(report.total_balance)}
                        </td>
                      </tr>
                      {report.total_balance_after != 0 && (
                        <tr>
                          <td className="border border-gray-300 p-2"></td>
                          <td
                            className="border border-gray-300 p-2 text-left font-semibold"
                            colSpan={2}
                          >
                            Saldo {">"} {moment(endDate).format("DD-MM-YYYY")}
                          </td>
                           <td className="border border-gray-300 p-2">
                            {report.total_debit_after != 0 && money(report.total_debit_after)}
                          </td>
                           <td className="border border-gray-300 p-2">
                            {report.total_credit_after != 0 && money(report.total_credit_after)}
                          </td>                          
                          <td className="border border-gray-300 p-2">
                            {report.total_balance_after != 0 && money(report.total_balance_after)}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td className="border border-gray-300 p-2"></td>
                        <td
                          className="border border-gray-300 p-2 text-left font-semibold"
                          colSpan={2}
                        >
                        Total
                        </td>
                        <td className="border border-gray-300 p-2">
                          {money(report.grand_total_debit)}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {money(report.grand_total_credit)}
                        </td>
                        <td className="border border-gray-300 p-2">
                          {money(report.grand_total_balance)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
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
                value={selectedCustomer}
                onChange={(val) => {
                  setSelectedCustomer(val!);
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

            <Button onClick={() => generateReport(false)}>
              {t("generate_report")}
            </Button>
            {report && (
              <Button onClick={() => generateReport(true)}>
                {t("download_report")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
export default AccountPayableLedgerPage;
