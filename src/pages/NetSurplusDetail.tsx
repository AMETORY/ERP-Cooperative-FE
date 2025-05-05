import { useContext, useEffect, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { ActiveCompanyContext } from "../contexts/CompanyContext";
import { Link, useParams } from "react-router-dom";
import { LoadingContext } from "../contexts/LoadingContext";
import { NetSurplusMember, NetSurplusModel } from "../models/net_surplus";
import {
  disbusementNetSurplus,
  distributeNetSurplus,
  getNetSurplusDetail,
} from "../services/api/netSurplusApi";
import Moment from "react-moment";
import {
  Badge,
  Button,
  Checkbox,
  Datepicker,
  Label,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  Textarea,
} from "flowbite-react";
import { money } from "../utils/helper";
import Chart from "react-google-charts";
import Select from "react-select";
import { AccountModel } from "../models/account";
import { getAccounts } from "../services/api/accountApi";
import toast from "react-hot-toast";
import { ClosingBookReport } from "../models/report";
import { useTranslation } from 'react-i18next';

interface NetSurplusDetailProps {}

const NetSurplusDetail: FC<NetSurplusDetailProps> = ({}) => {
  const { t } = useTranslation();
  const { activeCompany } = useContext(ActiveCompanyContext);
  const { netSurplusId } = useParams();
  const { loading, setLoading } = useContext(LoadingContext);
  const [mounted, setMounted] = useState(false);
  const [netSurplus, setNetSurplus] = useState<NetSurplusModel>();
  const [showModal, setShowModal] = useState(false);
  const [cashAccounts, setCashAccounts] = useState<AccountModel[]>([]);
  const [equityAccounts, setEquityAccounts] = useState<AccountModel[]>([]);
  const [disbursementModal, setDisbursementModal] = useState(false);
  const [netSurplusAccounts, setNetSurplusAccounts] = useState<AccountModel[]>(
    []
  );
  const [sourceAccount, setSourceAccount] = useState<AccountModel>();
  const [selectedMembers, setSelectedMembers] = useState<NetSurplusMember[]>(
    []
  );
  const [selectedCashAccount, setSelectedCashAccount] =
    useState<AccountModel>();
  const [notes, setNotes] = useState("");

  const [destinationAccounts, setDestinationAccounts] = useState<
    AccountModel[]
  >([]);
  const [date, setDate] = useState<Date>();

  useEffect(() => {
    setMounted(true);
  }, []);
  const getDetail = () => {
    getNetSurplusDetail(netSurplusId!).then((resp: any) => {
      setNetSurplus(resp.data);
      if (resp.data.closing_book) {
        let closingBook = resp.data.closing_book as ClosingBookReport;
        console.log(closingBook);
        setSourceAccount(closingBook.closing_summary.earning_retain);
      }
      // setIsEditable(resp.data.status == "DRAFT");
    });
  };
  useEffect(() => {
    if (mounted && netSurplusId) {
      getDetail();
      getAccounts({ page: 1, size: 100, cashflow_sub_group: "cash_bank" }).then(
        (v: any) => setCashAccounts(v.data.items)
      );
      getAccounts({ page: 1, size: 100, type: "EQUITY" }).then((v: any) =>
        setEquityAccounts(v.data.items)
      );
      getAccounts({
        page: 1,
        size: 100,
        type: "EQUITY",
        is_profit_loss_closing_account: true,
      }).then((v: any) => setNetSurplusAccounts(v.data.items));
      // getAccounts({ page: 1, size: 100, cashflow_sub_group: "cash_bank" }).then(
      //   (v: any) => setCashAccounts(v.data.items)
      // );
      // getAccounts({ page: 1, size: 100, type: "RECEIVABLE" }).then((v: any) =>
      //   setReceivableAccounts(v.data.items)
      // );
      // getAccounts({ page: 1, size: 100, type: "INCOME,REVENUE" }).then(
      //   (v: any) => setIncomeAccounts(v.data.items)
      // );
      // getSourceAccounts("");
      // getDestinationAccounts("");
    }
  }, [mounted, netSurplusId]);

  return (
    <AdminLayout isCooperative permission="cooperative:net_surplus:update">
      <div className="p-4 h-[calc(100vh-100px)] overflow-y-auto flex flex-col space-y-4">
        <h1 className="text-3xl font-bold text-gray-700">
          {netSurplus?.net_surplus_number}
        </h1>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-4">
            <div className="border rounded-lg bg-white p-4 flex flex-col space-y-4">
              <h2 className="text-lg font-bold text-gray-700">{t('summary')}</h2>
              <div>
                <Label>{t('period')}</Label>
                <p className="text-gray-600">
                  <Moment format="DD MMM YYYY">{netSurplus?.start_date}</Moment>{" "}
                  s/d{" "}
                  <Moment format="DD MMM YYYY">{netSurplus?.end_date}</Moment>
                </p>
              </div>
              <div>
                <Label>{t('description')}</Label>
                <p className="text-gray-600">{netSurplus?.description}</p>
              </div>
              <div>
                <Label>{t('net_surplus_total')}</Label>
                <p className="text-gray-600">
                  {money(netSurplus?.net_surplus_total)}
                </p>
              </div>
              <div>
                <Label>{t('transaction_total')}</Label>
                <p className="text-gray-600">
                  {money(netSurplus?.transaction_total)}
                </p>
              </div>
              <div>
                <Label>{t('saving_total')}</Label>
                <p className="text-gray-600">
                  {money(netSurplus?.savings_total)}
                </p>
              </div>
              <div>
                <Label>{t('loan_total')}</Label>
                <p className="text-gray-600">{money(netSurplus?.loan_total)}</p>
              </div>
              <div>
                <Label>{t('status')}</Label>
                <div className="w-fit">
                  <Badge
                    color={
                      netSurplus?.status === "DRAFT"
                        ? "gray"
                        : netSurplus?.status === "APPROVED"
                        ? "success"
                        : netSurplus?.status === "REJECTED"
                        ? "danger"
                        : netSurplus?.status === "DISTRIBUTED"
                        ? "blue"
                        : netSurplus?.status === "SETTLEMENT"
                        ? "indigo"
                        : "gray"
                    }
                  >
                    {netSurplus?.status}
                  </Badge>
                </div>
              </div>
            </div>
            {netSurplus?.status !== "DRAFT" && (
              <div className="border rounded-lg bg-white p-4 flex flex-col space-y-4">
                <div className="flex justify-between">
                  <h2 className="text-lg font-bold text-gray-700">{t('members')}</h2>
                  {selectedMembers.length > 0 && (
                    <Button size="xs">{t('disbursement')}</Button>
                  )}
                </div>
                <div className=" overflow-x-auto">
                  <Table hoverable striped>
                    <TableHead>
                      <TableHeadCell className="p-4">
                        <Checkbox
                          checked={
                            selectedMembers.length ==
                            netSurplus?.members?.length
                          }
                          onChange={(v) => {
                            setSelectedMembers(
                              v.target.checked ? netSurplus?.members! : []
                            );
                          }}
                        />
                      </TableHeadCell>
                      <TableHeadCell>{t('name')}</TableHeadCell>
                      <TableHeadCell>{t('net_surplus_business_profit_allocation')}</TableHeadCell>
                      <TableHeadCell>{t('net_surplus_mandatory_savings_allocation')}</TableHeadCell>
                      <TableHeadCell>{t('net_surplus_total')}</TableHeadCell>
                      <TableHeadCell>{t('status')}</TableHeadCell>
                      <TableHeadCell></TableHeadCell>
                    </TableHead>
                    <TableBody>
                      {netSurplus?.members?.map((member, index) => (
                        <TableRow key={index}>
                          <TableCell className="p-4">
                            <Checkbox
                              checked={selectedMembers
                                .map((m) => m.id)
                                .includes(member.id)}
                              onChange={(v) => {
                                if (v.target.checked) {
                                  setSelectedMembers((prev) => [
                                    ...prev,
                                    member,
                                  ]);
                                } else {
                                  setSelectedMembers(
                                    (prev) =>
                                      prev.filter(
                                        (m) => m.id != member.id
                                      ) as any
                                  );
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell>{member.full_name}</TableCell>
                          <TableCell>
                            {money(
                              member.net_surplus_business_profit_allocation
                            )}
                          </TableCell>
                          <TableCell>
                            {money(
                              member.net_surplus_mandatory_savings_allocation
                            )}
                          </TableCell>
                          <TableCell>
                            {money(
                              member.net_surplus_business_profit_allocation +
                                member.net_surplus_mandatory_savings_allocation
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              color={
                                netSurplus?.status === "PENDING"
                                  ? "gray"
                                  : netSurplus?.status === "APPROVED"
                                  ? "success"
                                  : netSurplus?.status === "REJECTED"
                                  ? "danger"
                                  : netSurplus?.status === "DISTRIBUTED"
                                  ? "blue"
                                  : netSurplus?.status === "SETTLEMENT"
                                  ? "indigo"
                                  : "gray"
                              }
                            >
                              {member?.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {member.status == "PENDING" && (
                              <Button
                                size="xs"
                                onClick={() => {
                                  setSelectedMembers([member]);
                                  setDisbursementModal(true);
                                }}
                              >
                                {t('disbursement')}
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
            {netSurplus?.status !== "DRAFT" && (
              <div className="border rounded-lg bg-white p-4 flex flex-col space-y-4">
                <h2 className="text-lg font-bold text-gray-700">
                  {t('transactions')}
                </h2>
                <div className=" overflow-x-auto">
                  <Table hoverable striped>
                    <TableHead>
                      <TableHeadCell>{t("date")}</TableHeadCell>
                      <TableHeadCell>{t("description")}</TableHeadCell>
                      <TableHeadCell>{t("debit")}</TableHeadCell>
                      <TableHeadCell>{t("credit")}</TableHeadCell>
                    </TableHead>
                    <TableBody>
                      {(netSurplus?.transactions ?? []).map(
                        (transaction, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Moment format="DD MMM YYYY">
                                {transaction.date}
                              </Moment>
                            </TableCell>
                            <TableCell>
                              <Link
                                to={`/account/${transaction.account_id}/report`}
                                target="_blank"
                              >
                                {transaction.description}
                              </Link>
                            </TableCell>
                            <TableCell>{money(transaction.debit)}</TableCell>
                            <TableCell>{money(transaction.credit)}</TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
          <div>
            <div className="border rounded-lg bg-white p-4">
              <h2 className="text-lg font-bold text-gray-700">{t('distribution')}</h2>
              <div className="relative">
                <Chart
                  style={{ borderRadius: "8px" }}
                  chartType="PieChart"
                  data={[
                    ["Allocation", "Total"],
                    ...(netSurplus?.distribution ?? []).map((v: any) => [
                      v.name,
                      v.amount,
                    ]),
                  ]}
                  options={{
                    is3D: true,
                    title: "Net Surplus Allocation",
                  }}
                  height={"400px"}
                />
                <div>
                  <Table hoverable striped>
                    <TableHead>
                      <TableHeadCell>{t('allocation')}</TableHeadCell>
                      <TableHeadCell>{t('amount')}</TableHeadCell>
                      <TableHeadCell>{t('percentage')}</TableHeadCell>
                    </TableHead>
                    <TableBody>
                      {(netSurplus?.distribution ?? []).map((v: any) => (
                        <TableRow key={v.id}>
                          <TableCell>{v.name}</TableCell>
                          <TableCell>{money(v.amount)}</TableCell>
                          <TableCell>{money(v.percentage)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {netSurplus?.status == "DRAFT" && (
                  <div className="absolute top-0 left-0 right-0 bottom-0 bg-white bg-opacity-80 flex flex-col items-center justify-center">
                    <div className="text-lg text-center w-1/2 text-yellow-500 mb-4">
                      {t('warning_no_distribution')}
                    </div>
                    <Button
                      gradientDuoTone="purpleToBlue"
                      onClick={() => {
                        setShowModal(true);
                      }}
                    >
                      {t('distribute_net_surplus')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>{t('distribute_net_surplus')}</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div className="flex flex-col ">
              <div className="border-b last:border-b-0 pb-4 pt-2">
                <Label>{t('net_surplus_account')}</Label>
                <Select
                  options={netSurplusAccounts.map((v) => ({
                    label: v.name,
                    value: v.id,
                  }))}
                  value={{
                    label: sourceAccount?.name,
                    value: sourceAccount?.id,
                  }}
                  onChange={(e: any) => {
                    setSourceAccount(
                      netSurplusAccounts.find((v) => v.id == e.value)
                    );
                  }}
                  placeholder="Select Source Account"
                />
              </div>
              {(netSurplus?.distribution ?? []).map((v, i) => (
                <div key={i} className="border-b last:border-b-0 pb-4 pt-2">
                  <Label>
                    {v.name} ({money(v.percentage)}%)
                  </Label>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <p className="font-semibold text-sm">{t('equity_account')}</p>
                      <Select
                        placeholder="Select Equity Account"
                        options={equityAccounts.map((v) => ({
                          label: v.name,
                          value: v.id,
                        }))}
                        value={{
                          label: netSurplus?.distribution.find(
                            (d) => d.key == v.key
                          )?.account?.name,
                          value: netSurplus?.distribution.find(
                            (d) => d.key == v.key
                          )?.account?.id,
                        }}
                        onChange={(e: any) => {
                          let selected = equityAccounts.find(
                            (v) => v.id == e.value
                          );
                          if (selected) {
                            setNetSurplus({
                              ...netSurplus!,
                              distribution: [
                                ...netSurplus!.distribution.map((d) => {
                                  if (d.key == v.key) {
                                    return {
                                      ...d,
                                      account_id: selected!.id!,
                                      account: selected!,
                                    };
                                  }
                                  return d;
                                }),
                              ],
                            });
                          }
                        }}
                      />
                    </div>
                    {/* <div>
                      <p className="font-semibold text-sm">Cash Account</p>
                      <Select
                        placeholder="Select Cash Account"
                        options={cashAccounts.map((v) => ({
                          label: v.name,
                          value: v.id,
                        }))}
                        value={{
                          label: netSurplus?.distribution.find(
                            (d) => d.key == v.key
                          )?.account_cash?.name,
                          value: netSurplus?.distribution.find(
                            (d) => d.key == v.key
                          )?.account_cash?.id,
                        }}
                        onChange={(e: any) => {
                          let selected = cashAccounts.find(
                            (v) => v.id == e.value
                          );
                          if (selected) {
                            setNetSurplus({
                              ...netSurplus!,
                              distribution: [
                                ...netSurplus!.distribution.map((d) => {
                                  if (d.key == v.key) {
                                    return {
                                      ...d,
                                      account_cash_id: selected!.id!,
                                      account_cash: selected!,
                                    };
                                  }
                                  return d;
                                }),
                              ],
                            });
                          }
                        }}
                      />
                    </div> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex flex-row justify-end w-full">
            <Button
              className="w-24"
              onClick={async () => {
                try {
                  if (!sourceAccount?.id) {
                    throw new Error("Please select source account");
                  }
                  for (const dist of netSurplus?.distribution ?? []) {
                    if (!dist.account_id) {
                      throw new Error(
                        `Please select equity account for ${dist.name}`
                      );
                    }
                    // if (!dist.account_cash_id) {
                    //   throw new Error(
                    //     `Please select cash account for ${dist.name}`
                    //   );
                    // }
                  }
                  setLoading(true);
                  const data = {
                    source_id: sourceAccount?.id,
                    allocations: netSurplus?.distribution,
                  };
                  await distributeNetSurplus(netSurplus!.id, data);
                  setShowModal(false);
                  getDetail();
                  toast.success("Net Surplus distributed successfully");
                } catch (error) {
                  toast.error(`${error}`);
                } finally {
                  setLoading(false);
                }
              }}
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
      <Modal
        show={disbursementModal}
        onClose={() => setDisbursementModal(false)}
      >
        <Modal.Header>Disbursement</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col space-y-4">
            <div>
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-2 py-1">Name</th>
                    <th className="text-right px-2 py-1">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedMembers.map((member, index) => (
                    <tr key={index}>
                      <td className="px-2 py-1">{member.full_name}</td>
                      <td className="text-right px-2 py-1">
                        {money(
                          member.net_surplus_business_profit_allocation +
                            member.net_surplus_mandatory_savings_allocation
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="px-2 py-1 font-bold text-lg">Grand Total</td>
                    <td className="text-right px-2 py-1 font-semibold text-lg">
                      {money(
                        selectedMembers?.reduce(
                          (prev, curr) =>
                            prev +
                            (curr.net_surplus_business_profit_allocation +
                              curr.net_surplus_mandatory_savings_allocation),
                          0
                        )
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="">
              <Label>Date</Label>
              <Datepicker
                minDate={new Date()}
                value={date}
                onChange={(val) => setDate(val!)}
              />
            </div>
            <div className="">
              <Label>Cash/Bank Account</Label>
              <Select
                options={cashAccounts.map((v) => ({
                  label: v.name,
                  value: v.id,
                  balance: v.balance,
                }))}
                value={{
                  label: selectedCashAccount?.name,
                  value: selectedCashAccount?.id,
                  balance: selectedCashAccount?.balance,
                }}
                onChange={(e: any) => {
                  setSelectedCashAccount(
                    cashAccounts.find((v) => v.id == e.value)
                  );
                }}
                placeholder="Select Cash/Bank Account"
                formatOptionLabel={(option: any) => (
                  <div className="flex items-center justify-between">
                    <span className="mr-2">{option.label}</span>
                    <small className="mr-2">{money(option.balance, 0)}</small>
                  </div>
                )}
              />
            </div>
            <div className="border-b last:border-b-0 pb-4 pt-2">
              <Label>Cash/Bank Account</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter notes"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
        <div className="flex w-full justify-end">
            <Button
              onClick={async () => {
                try {
                  let total = selectedMembers?.reduce(
                    (prev, curr) =>
                      prev +
                      (curr.net_surplus_business_profit_allocation +
                        curr.net_surplus_mandatory_savings_allocation),
                    0
                  ) as number;
                  if (selectedCashAccount!.balance! < total) {
                    throw new Error("Insufficient balance");
                  }
                  setLoading(true);
                  let data = {
                    date,
                    destination_id: selectedCashAccount?.id,
                    members: selectedMembers,
                    notes,
                  };
                  console.log(data);
                  await disbusementNetSurplus(netSurplusId!, data);
                  toast.success("Net Surplus disbursed successfully");
                  setDisbursementModal(false);
                  getDetail();
                  setDate(new Date());
                  setNotes("");
                  setSelectedCashAccount(undefined);
                } catch (error) {
                  toast.error(`${error}`);
                } finally {
                  setLoading(false);
                }
              }}
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};
export default NetSurplusDetail;
