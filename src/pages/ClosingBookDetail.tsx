import { useContext, useEffect, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LoadingContext } from "../contexts/LoadingContext";
import {
  generateClosingBook,
  getClosingBookDetail,
} from "../services/api/reportApi";
import {
  Badge,
  Button,
  Label,
  Modal,
  Table,
  Tabs,
  Textarea,
  TextInput,
} from "flowbite-react";
import { ClosingBookReport } from "../models/report";
import { MdOutlineBalance } from "react-icons/md";
import Moment from "react-moment";
import TrialBalanceComponent from "../components/report/TrialBalanceComponent";
import ProfitLossComponent from "../components/report/ProfitLossComponent";
import BalanceSheetComponent from "../components/report/BalanceSheetComponent";
import CashFlowComponent from "../components/report/CashFlowComponent";
import CapitalChangeComponent from "../components/report/CapitalChangeComponent";
import { AccountModel } from "../models/account";
import { getAccounts } from "../services/api/accountApi";
import Select from "react-select";
import { BsCartCheck, BsJournal, BsPercent } from "react-icons/bs";
import toast from "react-hot-toast";
import { TbFileInvoice } from "react-icons/tb";
import { HiOutlineChartPie } from "react-icons/hi2";
import { money } from "../utils/helper";
import { useTranslation } from "react-i18next";

interface ClosingBookDetailProps {}

const ClosingBookDetail: FC<ClosingBookDetailProps> = ({}) => {
  const { t } = useTranslation();

  const { closingBookId } = useParams();
  const { loading, setLoading } = useContext(LoadingContext);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [closingBook, setClosingBook] = useState<ClosingBookReport>();
  const [modalOpen, setModalOpen] = useState(false);
  const [notes, setNotes] = useState("");
  //   const [retainEarning, setRetainEarning] = useState<{
  //     value: string;
  //     label: string;
  //   }>();
  const [taxPercentage, setTaxPercentage] = useState<number>(0);

  const [selectedSumAccount, setSelectedSumAccount] =
    useState<AccountModel | null>(null);
  const [sumAccounts, setSumAccounts] = useState<AccountModel[]>([]);
  const [taxPayableAccounts, setTaxPayableAccounts] = useState<AccountModel[]>(
    []
  );
  const [selectedTaxPayable, setSelectedTaxPayable] = useState<AccountModel>();
  const [taxExpenseAccounts, setTaxExpenseAccounts] = useState<AccountModel[]>(
    []
  );
  const [selectedTaxExpense, setSelectedTaxExpense] = useState<AccountModel>();

  const [selectedProfitLossAccount, setSelectedProfitLossAccount] =
    useState<AccountModel | null>(null);
  const [profitLossAccounts, setProfitLossAccounts] = useState<AccountModel[]>(
    []
  );
  useEffect(() => {
    setMounted(true);
  }, []);
  const getDetail = () => {
    getClosingBookDetail(closingBookId!)
      .then((res: any) => {
        setClosingBook(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    if (mounted && closingBookId) {
      getDetail();
      getAccounts({
        page: 1,
        size: 10,
        search: "",
        type: "EQUITY",
        is_profit_loss_account: true,
      }).then((e: any) => {
        setSumAccounts(e.data.items);
        if (e.data.items.length == 1) {
          setSelectedSumAccount(e.data.items[0]); // default selected
        }
      });
      getAccounts({
        page: 1,
        size: 10,
        search: "",
        type: "EQUITY",
        is_profit_loss_closing_account: true,
      }).then((e: any) => {
        setProfitLossAccounts(e.data.items);
        if (e.data.items.length == 1) {
          setSelectedProfitLossAccount(e.data.items[0]); // default selected
        }
      });
      getAccounts({
        page: 1,
        size: 10,
        search: "",
        type: "LIABILITY",
        is_tax: true,
      }).then((e: any) => {
        setTaxPayableAccounts(e.data.items);
        if (e.data.items.length == 1) {
          setSelectedTaxPayable(e.data.items[0]);
        }
      });
      getAccounts({
        page: 1,
        size: 10,
        search: "",
        type: "EXPENSE",
        is_cogs_closing_account: true,
      }).then((e: any) => {
        setTaxExpenseAccounts(e.data.items);
        if (e.data.items.length == 1) {
          setSelectedTaxExpense(e.data.items[0]); // default selected
        }
      });
    }
  }, [mounted, closingBookId]);

  const renderSummary = () => {
    return (
      <div className=" h-[calc(100vh-260px)] overflow-y-auto ">
        <div className="  px-2">
          <table>
            <tr className="">
              <th className="px-2 py-2 w-64 text-left">{t("period")}</th>
              <td className="px-2 py-2">
                <Moment format="DD MMM YYYY">{closingBook?.start_date}</Moment>{" "}
                - <Moment format="DD MMM YYYY">{closingBook?.end_date}</Moment>
              </td>
            </tr>
            <tr className="">
              <th className="px-2 py-2 w-64 text-left">{t("status")}</th>
              <td className="px-2 py-2">
                <div className="w-fit">
                  <Badge
                    color={
                      closingBook?.status === "DRAFT"
                        ? "gray"
                        : closingBook?.status === "APPROVED"
                        ? "success"
                        : closingBook?.status === "REJECTED"
                        ? "danger"
                        : closingBook?.status === "RELEASED"
                        ? "blue"
                        : closingBook?.status === "SETTLEMENT"
                        ? "indigo"
                        : "gray"
                    }
                  >
                    {closingBook?.status}
                  </Badge>
                </div>
              </td>
            </tr>

            <tr className="">
              <th className="px-2 py-2 w-64 text-left">{t("total_income")}</th>
              <td className="px-2 py-2">
                {money(closingBook?.closing_summary?.total_income)}
              </td>
            </tr>
            <tr className="">
              <th className="px-2 py-2 w-64 text-left">{t("total_expense")}</th>
              <td className="px-2 py-2">
                {money(closingBook?.closing_summary?.total_expense)}
              </td>
            </tr>
            <tr className="">
              <th className="px-2 py-2 w-64 text-left">
                {t("net_profit_before_tax")}
              </th>
              <td className="px-2 py-2">
                {money(closingBook?.closing_summary?.net_income)}
              </td>
            </tr>
            <tr className="">
              <th className="px-2 py-2 w-64 text-left">{t("tax_total")}</th>
              <td className="px-2 py-2">
                {money(closingBook?.closing_summary?.income_tax)}
              </td>
            </tr>
            <tr className="">
              <th className="px-2 py-2 w-64 text-left">{t("tax")}</th>
              <td className="px-2 py-2">
                {money(closingBook?.closing_summary?.tax_percentage)}%
              </td>
            </tr>
            <tr className="">
              <th className="px-2 py-2 w-64 text-left">{t("notes")}</th>
              <td className="px-2 py-2">{closingBook?.notes}</td>
            </tr>
            <tr className="">
              <td className="px-2 py-2 w-64 text-left">
                {closingBook?.status === "DRAFT" && (
                  <Button
                    onClick={() => {
                      setModalOpen(true);
                    }}
                    className="w-full"
                  >
                    {t("release")}
                  </Button>
                )}
              </td>
            </tr>
          </table>
        </div>
        {closingBook?.status === "RELEASED" && (
          <div className="px-2">
            <h2 className="text-lg font-bold">{t("closing_book_journal")}</h2>
            <div className="overflow-x-auto">
              <Table>
                <Table.Head>
                  <Table.HeadCell className="w-64">{t("date")}</Table.HeadCell>
                  <Table.HeadCell>{t("description")}</Table.HeadCell>
                  <Table.HeadCell align="right">{t("debit")}</Table.HeadCell>
                  <Table.HeadCell align="right">{t("credit")}</Table.HeadCell>
                  <Table.HeadCell></Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {(closingBook?.transactions ?? []).length === 0 && (
                    <Table.Row>
                      <Table.Cell colSpan={5} className="text-center">
                        {t("no_transactions_found")}
                      </Table.Cell>
                    </Table.Row>
                  )}

                  {(closingBook?.transactions ?? []).map((transaction, i) => (
                    <Table.Row
                      key={i}
                      className="bg-white dark:border-gray-700 dark:bg-gray-800"
                    >
                      <Table.Cell
                        className="whitespace-nowrap font-medium text-gray-900 dark:text-white cursor-pointer hover:font-semibold"
                        onClick={() => {}}
                      >
                        <Moment format="DD/MM/YYYY">{transaction.date}</Moment>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="flex flex-col">
                          <span className="font-semibold">
                            {transaction.description}
                          </span>
                          {transaction.notes && (
                            <span className="text-xs text-gray-500">
                              {transaction.notes}
                            </span>
                          )}
                        </div>
                      </Table.Cell>

                      <Table.Cell align="right">
                        {money(transaction.debit)}
                      </Table.Cell>
                      <Table.Cell align="right">
                        {money(transaction.credit)}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </div>
        )}
      </div>
    );
  };
  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-2">
          <h1 className="text-3xl font-bold">Tutup Buku</h1>
        </div>
        <Tabs
          aria-label="Default tabs"
          variant="default"
          onActiveTabChange={(tab) => {
            setActiveTab(tab);
          }}
          //   className="mt-4"
        >
          <Tabs.Item
            title={
              <div className="flex items-center gap-2">
                <img src="/icon/analysis.png" width={24} />
                <span>{t("summary")}</span>
              </div>
            }
            active={activeTab == 0}
          >
            {renderSummary()}
          </Tabs.Item>
          <Tabs.Item
            title={
              <div className="flex items-center gap-2">
                <img src="/icon/trial.png" width={24} />
                <span>{t("trial_balance")}</span>
              </div>
            }
            active={activeTab == 1}
          >
            <div className=" h-[calc(100vh-260px)] overflow-y-auto ">
              <div className="  px-2">
                {closingBook?.trial_balance && (
                  <TrialBalanceComponent
                    trialBalance={closingBook?.trial_balance}
                  />
                )}
              </div>
            </div>
          </Tabs.Item>
          <Tabs.Item
            title={
              <div className="flex items-center gap-2">
                <img src="/icon/profit-loss.png" width={24} />
                <span>{t("profit_loss")}</span>
              </div>
            }
            active={activeTab == 2}
          >
            <div className=" h-[calc(100vh-260px)] overflow-y-auto ">
              <div className="  px-2">
                {closingBook?.profit_loss && (
                  <ProfitLossComponent profitLoss={closingBook?.profit_loss} />
                )}
              </div>
            </div>
          </Tabs.Item>
          <Tabs.Item
            title={
              <div className="flex items-center gap-2">
                <img src="/icon/budget-balance.png" width={24} />
                <span>{t("balance_sheet")}</span>
              </div>
            }
            active={activeTab == 3}
          >
            <div className=" h-[calc(100vh-260px)] overflow-y-auto ">
              <div className="  px-2">
                {closingBook?.balance_sheet && (
                  <BalanceSheetComponent
                    balanceSheet={closingBook?.balance_sheet}
                  />
                )}
              </div>
            </div>
          </Tabs.Item>
          <Tabs.Item
            title={
              <div className="flex items-center gap-2">
                <img src="/icon/cash-flow.png" width={24} />
                <span>{t("cash_flow")}</span>
              </div>
            }
            active={activeTab == 4}
          >
            <div className=" h-[calc(100vh-260px)] overflow-y-auto ">
              <div className="  px-2">
                {closingBook?.cash_flow && (
                  <CashFlowComponent cashFlow={closingBook?.cash_flow} />
                )}
              </div>
            </div>
          </Tabs.Item>
          <Tabs.Item
            title={
              <div className="flex items-center gap-2">
                <img src="/icon/investment.png" width={24} />
                <span>{t("capital_change")}</span>
              </div>
            }
            active={activeTab == 5}
          >
            <div className=" h-[calc(100vh-260px)] overflow-y-auto ">
              <div className="  px-2">
                {closingBook?.capital_change && (
                  <CapitalChangeComponent
                    capitalChange={closingBook?.capital_change}
                  />
                )}
              </div>
            </div>
          </Tabs.Item>
        </Tabs>
      </div>
      <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Header>{t("release_closing_book")}</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col space-y-4">
            <div>
              <p className="">{t("are_you_sure_release_closing_book")}</p>
              <p className="">
                {t("make_sure_stock_opname_and_bank_reconcile_done")}
              </p>
            </div>
            <div>
              <Label>{t("summary_account")}</Label>
              <Select
                options={sumAccounts.map((a) => {
                  return {
                    value: a.id,
                    label: a.name,
                    type: a.type,
                  };
                })}
                value={{
                  value: selectedSumAccount?.id,
                  label: selectedSumAccount?.name,
                  type: selectedSumAccount?.type,
                }}
                onChange={(e) => {
                  let selected = sumAccounts.find((a) => a.id === e?.value);
                  setSelectedSumAccount(selected!);
                }}
              />
            </div>
            <div>
              <Label>{t("earning_retain_account")}</Label>
              <Select
                options={profitLossAccounts.map((a) => {
                  return {
                    value: a.id,
                    label: a.name,
                    type: a.type,
                  };
                })}
                value={{
                  value: selectedProfitLossAccount?.id,
                  label: selectedProfitLossAccount?.name,
                  type: selectedProfitLossAccount?.type,
                }}
                onChange={(e) => {
                  let selected = profitLossAccounts.find(
                    (a) => a.id === e?.value
                  );
                  setSelectedProfitLossAccount(selected!);
                }}
              />
            </div>
            <div>
              <Label>{t("tax_account")}</Label>

              <Select
                options={taxPayableAccounts.map((a) => {
                  return {
                    value: a.id,
                    label: a.name,
                    type: a.type,
                  };
                })}
                value={{
                  value: selectedTaxPayable?.id,
                  label: selectedTaxPayable?.name,
                  type: selectedTaxPayable?.type,
                }}
                onChange={(e) => {
                  let selected = taxPayableAccounts.find(
                    (a) => a.id === e?.value
                  );
                  setSelectedTaxPayable(selected!);
                }}
              />
            </div>
            <div>
              <Label>{t("tax_expense_account")}</Label>

              <Select
                options={taxExpenseAccounts.map((a) => {
                  return {
                    value: a.id,
                    label: a.name,
                    type: a.type,
                  };
                })}
                value={{
                  value: selectedTaxExpense?.id,
                  label: selectedTaxExpense?.name,
                  type: selectedTaxExpense?.type,
                }}
                onChange={(e) => {
                  let selected = taxExpenseAccounts.find(
                    (a) => a.id === e?.value
                  );
                  setSelectedTaxExpense(selected!);
                }}
              />
            </div>
            <div>
              <Label>{t("tax_amount")}</Label>
              <div className="w-[100px]">
                <TextInput
                  type="number"
                  max={100}
                  value={taxPercentage}
                  onChange={(e) => {
                    if (Number(e.target.value) <= 100)
                      setTaxPercentage(Number(e.target.value));
                  }}
                  rightIcon={BsPercent}
                />
              </div>
            </div>
            {/* <div>
              <Label>{t("notes")}</Label>
              <Textarea
                rows={7}
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                }}
              />
            </div> */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="w-full flex justify-end">
          <Button
          className="w-32"
            onClick={async () => {
              setLoading(true);
              if (!selectedSumAccount) {
                toast.error(t("please_select_earning_return"));
                return;
              }
              if (!selectedProfitLossAccount) {
                toast.error(t("please_select_retain_earning_account"));
                return;
              }
              // if (!notes) {
              //   toast.error(t("please_add_notes"));
              //   return;
              // }

              try {
                await generateClosingBook(closingBook?.id!, {
                  notes,
                  profit_summary_id: selectedSumAccount?.id,
                  retain_earning_id: selectedProfitLossAccount?.id,
                  tax_percentage: taxPercentage,
                  tax_payable_id: selectedTaxPayable?.id,
                  tax_expense_id: selectedTaxExpense?.id,
                });
                getDetail();
              } catch (error) {
                toast.error(
                  `${t("failed_to_generate_closing_book")} ${error}`
                );
              } finally {
                setModalOpen(false);
                setLoading(false);
              }
            }}
          >
            {t("release")}
          </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};
export default ClosingBookDetail;
