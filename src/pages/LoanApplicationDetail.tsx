import { useContext, useEffect, useRef, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { useParams } from "react-router-dom";
import { LoadingContext } from "../contexts/LoadingContext";
import {
  InstallmentDetail,
  LoanApplicationModel,
} from "../models/loan_application";
import {
  approvalLoan,
  createLoanPayment,
  disbursementLoan,
  getLoanDetail,
  updateLoan,
} from "../services/api/cooperativeLoanApi";
import {
  Badge,
  Button,
  Datepicker,
  Label,
  Modal,
  RangeSlider,
  Select,
  Textarea,
  TextInput,
  Toast,
  ToastToggle,
} from "flowbite-react";
import { getAccounts } from "../services/api/accountApi";
import { AccountModel } from "../models/account";
import { ActiveCompanyContext } from "../contexts/CompanyContext";
import CurrencyInput from "react-currency-input-field";
import { money } from "../utils/helper";
import moment from "moment";

import ReactSelect from "react-select";
import { GoCheckCircleFill } from "react-icons/go";
import { BsDownload } from "react-icons/bs";
import toast from "react-hot-toast";
import { Editor } from "@tinymce/tinymce-react";
import { HiFire } from "react-icons/hi2";
import { IoRefreshCircle, IoRefreshCircleOutline } from "react-icons/io5";

interface LoanApplicationDetailProps {}

const LoanApplicationDetail: FC<LoanApplicationDetailProps> = ({}) => {
  const { activeCompany } = useContext(ActiveCompanyContext);
  const { loanId } = useParams();
  const { loading, setLoading } = useContext(LoadingContext);
  const [mounted, setMounted] = useState(false);
  const [loan, setLoan] = useState<LoanApplicationModel>();
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [description, setDescription] = useState("");
  const amountRef = useRef<HTMLInputElement | null>(null);
  const creditRef = useRef<HTMLInputElement | null>(null);
  const debitRef = useRef<HTMLInputElement | null>(null);
  const [amount, setAmount] = useState(0);
  const [debit, setDebit] = useState(0);
  const [credit, setCredit] = useState(0);
  const [cashAccounts, setCashAccounts] = useState<AccountModel[]>([]);
  const [isEditable, setIsEditable] = useState(false);
  const [receivableAccounts, setReceivableAccounts] = useState<AccountModel[]>(
    []
  );
  const [showModalPayment, setShowModalPayment] = useState(false);
  const [assetAccounts, setAssetAccounts] = useState<AccountModel[]>([]);
  const [incomeAccounts, setIncomeAccounts] = useState<AccountModel[]>([]);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [approvalStatus, setApprovalStatus] = useState<"APPROVED" | "REJECTED">(
    "APPROVED"
  );
  const [showDisbursementModal, setShowDisbursementModal] = useState(false);
  const [paymentData, setPaymentData] = useState<any>();
  // Example usage of approvalStatus

  // const [sourceAccounts, setSourceAccounts] = useState<AccountModel[]>([]);
  // const [destinationAccounts, setDestinationAccounts] = useState<
  //   AccountModel[]
  // >([]);
  // const [selectedSource, setSelectedSource] = useState<AccountModel | null>(
  //   null
  // );
  // const [selectedDestination, setSelectedDestination] =
  //   useState<AccountModel | null>(null);
  const [isDouble, setIsDouble] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const getDetail = () => {
    getLoanDetail(loanId!).then((resp: any) => {
      setLoan(resp.data);
      setIsEditable(resp.data.status == "DRAFT");
    });
  };
  useEffect(() => {
    if (mounted && loanId) {
      getDetail();
      getAccounts({ page: 1, size: 100, cashflow_sub_group: "cash_bank" }).then(
        (v: any) => setCashAccounts(v.data.items)
      );
      getAccounts({ page: 1, size: 100, type: "RECEIVABLE" }).then((v: any) =>
        setReceivableAccounts(v.data.items)
      );
      getAccounts({ page: 1, size: 100, type: "INCOME,REVENUE" }).then(
        (v: any) => setIncomeAccounts(v.data.items)
      );
      // getSourceAccounts("");
      // getDestinationAccounts("");
    }
  }, [mounted, loanId]);

  const profitType = [
    { label: "Bunga Menurun", value: "DECLINING" },
    { label: "Anuitas", value: "ANUITY" },
    { label: "Bunga Tetap", value: "FIXED" },
  ];
  const loanType = [
    { label: "Mudharabah", value: "MUDHARABAH" },
    { label: "Qardh Hasan", value: "QARDH_HASAN" },
  ];

  const handleEditorChange = (e: any) => {
    setLoan({
      ...loan!,
      term_condition: e.target.getContent(),
    });
  };
  return (
    <AdminLayout isCooperative permission="cooperative:loan_application:read">
      <div className="p-4 h-[calc(100vh-100px)] overflow-y-auto flex flex-col space-y-4">
        <h1 className="text-3xl font-bold text-gray-700">
          {loan?.loan_number}
        </h1>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="border rounded-lg bg-white p-4">
              <div className="flex flex-col space-y-4">
                {/* Llama Cicilan */}

                <div>
                  <Label>Tgl Pengajuan</Label>
                  <Datepicker
                    disabled={!isEditable}
                    value={moment(loan?.submission_date).toDate()}
                    onChange={(e: any) => {
                      setLoan({ ...loan!, submission_date: e! });
                    }}
                    className="input-white"
                  />
                </div>
                <div>
                  <Label>Anggota</Label>
                  <div>{loan?.member?.name}</div>
                </div>
                <div>
                  <Label>Jumlah Pinjaman</Label>

                  <h3 className="text-xl font-bold">
                    {money(loan?.loan_amount)}
                  </h3>
                </div>
                <div>
                  <Label>Tujuan Pinjaman</Label>
                  <div>{loan?.loan_purpose}</div>
                </div>

                <div>
                  <Label>Lama Cicilan</Label>
                  <TextInput
                    type="number"
                    className="input-white"
                    disabled={!isEditable}
                    value={loan?.repayment_term ?? 0}
                    onChange={(val) =>
                      setLoan({
                        ...loan!,
                        repayment_term: Number(val.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label>Metode Cicilan</Label>
                  {activeCompany?.cooperative_setting?.is_islamic && (
                    <Select
                      disabled={!isEditable}
                      className="input-white"
                      style={{ backgroundColor: "white" }}
                      value={loan?.loan_type}
                      onChange={(e) => {
                        setLoan({ ...loan!, loan_type: e.target.value });
                      }}
                    >
                      {loanType?.map((e) => (
                        <option value={e.value}>{e.label}</option>
                      ))}
                    </Select>
                  )}
                  {!activeCompany?.cooperative_setting?.is_islamic && (
                    <Select
                      disabled={!isEditable}
                      className="input-white"
                      value={loan?.profit_type}
                      style={{ backgroundColor: "white" }}
                      onChange={(e) => {
                        setLoan({ ...loan!, profit_type: e.target.value });
                      }}
                    >
                      {profitType?.map((e) => (
                        <option value={e.value}>{e.label}</option>
                      ))}
                    </Select>
                  )}
                </div>

                {/* Bunga Cicilan */}
                {!activeCompany?.cooperative_setting?.is_islamic && (
                  <div>
                    <Label>Bunga Cicilan (%)</Label>
                    <TextInput
                      type="number"
                      className="input-white"
                      value={loan?.interest_rate ?? 0}
                      onChange={(e) =>
                        setLoan({
                          ...loan!,
                          interest_rate: Number(e.target.value!),
                        })
                      }
                    />
                  </div>
                )}
                {loan?.loan_type == "MUDHARABAH" && (
                  <div>
                    <Label>Proyeksi Keuntungan</Label>
                    <CurrencyInput
                      disabled={!isEditable}
                      className="rs-input !p-1.5 "
                      groupSeparator="."
                      decimalSeparator=","
                      value={loan?.projected_profit ?? 0}
                      onValueChange={(_, __, val) =>
                        setLoan({ ...loan!, projected_profit: val?.float ?? 0 })
                      }
                    />
                    <small className="italic">
                      Proyeksi Keuntungan Koperasi:{" "}
                      {money(
                        ((loan?.projected_profit ?? 0) *
                          (loan?.expected_profit_rate ?? 0)) /
                          100
                      )}
                      ({loan?.expected_profit_rate ?? 0}%)
                    </small>
                    {loan?.status == "DRAFT" && (
                      <RangeSlider
                        value={loan?.expected_profit_rate ?? 0}
                        onChange={(val) =>
                          setLoan({
                            ...loan!,
                            expected_profit_rate: Number(val!.target.value),
                          })
                        }
                      />
                    )}
                  </div>
                )}
                <div>
                  <Label>Biaya Admin</Label>
                  <CurrencyInput
                    disabled={!isEditable}
                    className="rs-input !p-1.5 "
                    groupSeparator="."
                    decimalSeparator=","
                    value={loan?.admin_fee ?? 0}
                    onValueChange={(_, __, val) =>
                      setLoan({ ...loan!, admin_fee: val?.float ?? 0 })
                    }
                  />
                </div>

                {/* Status */}
                <div className="mb-4">
                  <Label>Status</Label>
                  <div className="w-fit">
                    <Badge
                      color={
                        loan?.status === "DRAFT"
                          ? "gray"
                          : loan?.status === "APPROVED"
                          ? "success"
                          : loan?.status === "REJECTED"
                          ? "danger"
                          : loan?.status === "DISBURSED"
                          ? "blue"
                          : loan?.status === "SETTLEMENT"
                          ? "indigo"
                          : "gray"
                      }
                    >
                      {loan?.status}
                    </Badge>
                  </div>
                </div>

                {/* Akun Piutang */}

                <div>
                  <Label>Akun Piutang</Label>
                  <ReactSelect
                    isDisabled={!isEditable}
                    options={receivableAccounts.map((e) => ({
                      label: e.name,
                      value: e.id,
                    }))}
                    value={{
                      label: loan?.account_receivable?.name,
                      value: loan?.account_receivable?.id,
                    }}
                    onChange={(val) => {
                      let selected = receivableAccounts.find(
                        (e) => e.id == val?.value
                      );
                      setLoan({
                        ...loan!,
                        account_receivable: selected,
                        account_receivable_id: selected?.id,
                      });
                    }}
                  />
                </div>

                {/* Akun Biaya Admin */}
                <div>
                  <Label>Akun Biaya Admin</Label>
                  <ReactSelect
                    isDisabled={!isEditable}
                    options={incomeAccounts.map((e) => ({
                      label: e.name,
                      value: e.id,
                    }))}
                    value={{
                      label: loan?.account_admin_fee?.name,
                      value: loan?.account_admin_fee?.id,
                    }}
                    onChange={(val) => {
                      let selected = incomeAccounts.find(
                        (e) => e.id == val?.value
                      );
                      setLoan({
                        ...loan!,
                        account_admin_fee: selected,
                        account_admin_fee_id: selected?.id,
                      });
                    }}
                  />
                </div>

                {/* Akun Pendapatan Pinjaman */}

                <div>
                  <Label>Akun Pendapatan Pinjaman</Label>
                  <ReactSelect
                    isDisabled={!isEditable}
                    options={incomeAccounts.map((e) => ({
                      label: e.name,
                      value: e.id,
                    }))}
                    value={{
                      label: loan?.account_income?.name,
                      value: loan?.account_income?.id,
                    }}
                    onChange={(val) => {
                      let selected = incomeAccounts.find(
                        (e) => e.id == val?.value
                      );
                      setLoan({
                        ...loan!,
                        account_income: selected,
                        account_income_id: selected?.id,
                      });
                    }}
                  />
                </div>

                {/* Catatan */}
                <div className="mb-4">
                  <Label>Catatan</Label>
                  <Textarea
                    disabled
                    className="input-white"
                    placeholder="Catatan"
                    rows={4}
                    value={loan?.remarks}
                  />
                </div>

                <div className="flex justify-between">
                  <div className="flex gap-2">
                    {loan?.status == "DRAFT" && (
                      <Button
                        color="failure"
                        onClick={async () => {
                          setApprovalStatus("REJECTED");
                          setShowApprovalModal(true);
                        }}
                      >
                        Reject
                      </Button>
                    )}
                    {loan?.status == "DRAFT" && (
                      <Button
                        color="success"
                        onClick={() => {
                          setApprovalStatus("APPROVED");
                          setShowApprovalModal(true);
                        }}
                      >
                        Approve
                      </Button>
                    )}
                  </div>
                  {isEditable && (
                    <Button
                      onClick={async () => {
                        try {
                          setLoading(true);
                          await updateLoan(loanId!, loan);
                          toast.success("Loan updated");
                          getDetail();
                        } catch (error) {
                          toast.error(`${error}`);
                        } finally {
                          setLoading(false);
                        }
                      }}
                    >
                      Save
                    </Button>
                  )}
                  {loan?.status == "APPROVED" && (
                    <Button
                      onClick={async () => {
                        setShowDisbursementModal(true);
                      }}
                    >
                      Disbursement
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            {isEditable && (
              <Editor
                apiKey={process.env.REACT_APP_TINY_MCE_KEY}
                init={{
                  height: 1000,
                  plugins:
                    "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount ",
                  toolbar:
                    "closeButton saveButton aiButton | undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat ",

                  menubar: "file edit view insert format tools table custom",
                  menu: {
                    custom: {
                      title: "Editor",
                      items: "closeButton saveButton",
                    },
                  },
                }}
                initialValue={loan?.term_condition ?? ""}
                onChange={handleEditorChange}
              />
            )}
            {!isEditable && (
              <div
                dangerouslySetInnerHTML={{ __html: loan?.term_condition ?? "" }}
              />
            )}
          </div>
        </div>
        {loan?.status == "DRAFT" && (
          <div className="border rounded-lg bg-white p-4 ">
            <>
              <h3 className="text-2xl font-semibold">Simulasi Cicilan</h3>
              <div className="mt-4">
                {loan?.preview &&
                  Object.entries(loan!.preview!).map(([key, value]) => (
                    <div className="mb-4 mt-8" key={key}>
                      <div className="flex flex-row items-center justify-between">
                        {loan?.loan_type == "CONVENTIONAL" && (
                          <h4
                            className="font-bold uppercase flex flex-row gap-2 items-center cursor-pointer"
                            onClick={() => {
                              setLoan({
                                ...loan!,
                                profit_type: key,
                              });
                            }}
                          >
                            {loan?.profit_type == key && (
                              <GoCheckCircleFill
                                size={18}
                                className=" text-green-400"
                              />
                            )}
                            {profitType.find((e) => e.value == key)?.label}
                          </h4>
                        )}
                        {loan?.loan_type != "CONVENTIONAL" && (
                          <h4
                            className="font-bold uppercase flex flex-row gap-2 items-center cursor-pointer"
                            onClick={() => {
                              setLoan({
                                ...loan!,
                                loan_type: key,
                              });
                            }}
                          >
                            {loan?.loan_type == key && (
                              <GoCheckCircleFill
                                size={18}
                                className=" text-green-400"
                              />
                            )}
                            {loanType.find((e) => e.value == key)?.label}
                          </h4>
                        )}

                        <BsDownload
                          className="cursor-pointer"
                          onClick={() => {
                            // downloadLoanInstallment(loadId!, key)
                            //   .then((v) => v.blob())
                            //   .then((blob) => {
                            //     const url = window.URL.createObjectURL(blob);
                            //     const link = document.createElement("a");
                            //     link.href = url;
                            //     link.download = `${loan?.loan_number} - ${loan?.member?.name} - ${key}.xlsx`;
                            //     link.click();
                            //   });
                          }}
                        />
                      </div>
                      <table className="mt-2 w-full border text-sm">
                        <thead>
                          <tr className="text-left border-b bg-gray-50">
                            <th className="px-4 py-2 border-r">Cicilan</th>
                            <th className="px-4 py-2 text-right border-r">
                              Pokok
                            </th>
                            <th className="px-4 py-2 text-right border-r">
                              {loan?.loan_type == "CONVENTIONAL"
                                ? "Bunga"
                                : "Profit"}
                            </th>
                            <th className="px-4 py-2 text-right border-r">
                              Admin
                            </th>
                            <th className="px-4 py-2 text-right border-r">
                              Total
                            </th>
                            <th className="px-4 py-2 text-right">Sisa</th>
                          </tr>
                        </thead>
                        <tbody>
                          {value.map(
                            (inst: InstallmentDetail, index: number) => (
                              <tr
                                key={index}
                                className={`${
                                  inst.installment_number % 2 == 0
                                    ? "bg-gray-50"
                                    : "bg-white"
                                } hover:bg-gray-100`}
                              >
                                <td className="px-4 py-2 border-r">
                                  {inst.installment_number}
                                </td>
                                <td className="px-4 py-2 border-r text-right">
                                  {money(inst.principal_amount, 0)}
                                </td>
                                <td className="px-4 py-2 border-r text-right">
                                  {money(inst.interest_amount, 0)}
                                </td>
                                <td className="px-4 py-2 border-r text-right">
                                  {money(inst.admin_fee, 0)}
                                </td>
                                <td className="px-4 py-2 border-r text-right">
                                  {money(inst.total_paid, 0)}
                                </td>
                                <td className="px-4 py-2 text-right">
                                  {money(inst.remaining_loan, 0)}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                        <tfoot>
                          <tr className="text-left border-b bg-gray-50">
                            <th className="px-4 py-2 border-r">Total</th>
                            <th className="px-4 py-2 text-right border-r">
                              {money(
                                value
                                  .map(
                                    (e: InstallmentDetail) => e.principal_amount
                                  )
                                  .reduce((a: number, b: number) => a + b, 0),
                                0
                              )}
                            </th>
                            <th className="px-4 py-2 text-right border-r">
                              {money(
                                value
                                  .map(
                                    (e: InstallmentDetail) => e.interest_amount
                                  )
                                  .reduce((a: number, b: number) => a + b, 0),
                                0
                              )}
                            </th>
                            <th className="px-4 py-2 text-right border-r">
                              {money(
                                value
                                  .map((e: InstallmentDetail) => e.admin_fee)
                                  .reduce((a: number, b: number) => a + b, 0),
                                0
                              )}
                            </th>
                            <th className="px-4 py-2 text-right border-r">
                              {money(
                                value
                                  .map((e: InstallmentDetail) => e.total_paid)
                                  .reduce((a: number, b: number) => a + b, 0),
                                0
                              )}
                            </th>
                            <th className="px-4 py-2 text-right"></th>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  ))}
              </div>
            </>
          </div>
        )}
        {(loan?.status == "DISBURSED" || loan?.status == "SETTLEMENT") && (
          <div className="border rounded-lg bg-white p-4 ">
            <>
              <div className="">
                <h3 className="text-xl font-semibold mb-4">Tabel Cicilan</h3>
                <table className="mt-2 w-full border text-sm">
                  <thead>
                    <tr className="text-left border-b bg-gray-50">
                      <th className="px-4 py-2 border-r w-24">Cicilan</th>
                      <th className="px-4 py-2 text-right border-r">Pokok</th>
                      <th className="px-4 py-2 text-right border-r">
                        {loan?.loan_type == "CONVENTIONAL" ? "Bunga" : "Profit"}
                      </th>
                      <th className="px-4 py-2 text-right border-r">Admin</th>
                      <th className="px-4 py-2 text-right border-r">Total</th>
                      <th className="px-4 py-2 text-right border-r ">Sisa</th>
                      <th className="px-4 py-2 text-right w-24"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(loan?.installments ?? []).map(
                      (inst: InstallmentDetail, index: number) => (
                        <tr
                          key={index}
                          className={`${
                            inst.installment_number % 2 == 0
                              ? "bg-gray-50"
                              : "bg-white"
                          } hover:bg-gray-100`}
                        >
                          <td className="px-4 py-2 border-r">
                            {inst.installment_number}
                          </td>
                          <td className="px-4 py-2 border-r text-right">
                            {money(inst.principal_amount, 0)}
                          </td>
                          <td className="px-4 py-2 border-r text-right">
                            {money(inst.interest_amount, 0)}
                          </td>
                          <td className="px-4 py-2 border-r text-right">
                            {money(inst.admin_fee, 0)}
                          </td>
                          <td className="px-4 py-2 border-r text-right">
                            {money(inst.total_paid, 0)}
                          </td>
                          <td className="px-4 py-2 border-r  text-right">
                            {money(inst.remaining_loan, 0)}
                          </td>
                          <td className="px-4 py-2 text-right">
                            {(loan?.payments ?? [])
                              .map((p) => p.installment_no)
                              .includes(inst.installment_number) && (
                              <Button color="green" size="xs" className="w-24">
                                Lunas
                              </Button>
                            )}
                            {(index == loan?.last_payment?.installment_no ||
                              (!loan?.last_payment && index == 0)) && (
                              <Button
                                size="xs"
                                className="w-24"
                                onClick={() => {
                                  setShowModalPayment(true);
                                  let data = {
                                    installment_no: inst.installment_number,
                                    payment_date: moment().toISOString(),
                                    principal_paid: inst.principal_amount,
                                    profit_paid: inst.interest_amount,
                                    admin_fee_paid: inst.admin_fee,
                                    total_paid: inst.total_paid,
                                    remaining_loan: inst.remaining_loan,
                                    payment_amount: inst.total_paid,
                                    remarks: `Pembayaran Cicilan #${inst.installment_number} - ${loan?.member?.name}`,
                                    account_asset: loan?.account_asset,
                                    account_asset_id: loan?.account_asset_id,
                                  };
                                  setPaymentData(data);
                                }}
                              >
                                Pembayaran
                              </Button>
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="text-left border-b bg-gray-50">
                      <th className="px-4 py-2 border-r">Total</th>
                      <th className="px-4 py-2 text-right border-r">
                        {money(
                          (loan?.installments ?? [])
                            .map((e: InstallmentDetail) => e.principal_amount)
                            .reduce((a: number, b: number) => a + b, 0),
                          0
                        )}
                      </th>
                      <th className="px-4 py-2 text-right border-r">
                        {money(
                          (loan?.installments ?? [])
                            .map((e: InstallmentDetail) => e.interest_amount)
                            .reduce((a: number, b: number) => a + b, 0),
                          0
                        )}
                      </th>
                      <th className="px-4 py-2 text-right border-r">
                        {money(
                          (loan?.installments ?? [])
                            .map((e: InstallmentDetail) => e.admin_fee)
                            .reduce((a: number, b: number) => a + b, 0),
                          0
                        )}
                      </th>
                      <th className="px-4 py-2 text-right border-r">
                        {money(
                          (loan?.installments ?? [])
                            .map((e: InstallmentDetail) => e.total_paid)
                            .reduce((a: number, b: number) => a + b, 0),
                          0
                        )}
                      </th>
                      <th className="px-4 py-2 text-right border-r "></th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </>
          </div>
        )}
      </div>
      <Modal
        show={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
      >
        <Modal.Header>Approval</Modal.Header>
        <Modal.Body>
          <Textarea
            placeholder="Enter your remarks here..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={4}
            className="input-white"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={async () => {
              try {
                setLoading(true);
                await approvalLoan(loanId!, {
                  approval_status: approvalStatus,
                  remarks,
                });
                toast.success("Loan approved");
                setShowApprovalModal(false);
                getDetail();
              } catch (error) {
                toast.error(`${error}`);
              } finally {
                setLoading(false);
              }
            }}
          >
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showDisbursementModal}
        onClose={() => setShowDisbursementModal(false)}
      >
        <Modal.Header>Disbursement</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col space-y-4">
            <div>
              <Label>Total Pinjaman</Label>
              <div className="text-lg font-semibold">
                {money(loan?.loan_amount)}
              </div>
            </div>
            <div>
              <Label>Asset Account</Label>
              <ReactSelect
                options={cashAccounts.map((e) => ({
                  label: e.name,
                  value: e.id,
                }))}
                value={{
                  label: loan?.account_asset?.name,
                  value: loan?.account_asset?.id,
                }}
                onChange={(val) => {
                  let selected = cashAccounts.find((e) => e.id == val?.value);
                  setLoan({
                    ...loan!,
                    account_asset: selected,
                    account_asset_id: selected?.id,
                  });
                }}
              />
            </div>
            <div>
              <Label>Remarks</Label>
              <Textarea
                placeholder="Enter your remarks here..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={4}
                className="input-white"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end w-full">
            <Button
              onClick={async () => {
                try {
                  setLoading(true);
                  await disbursementLoan(loanId!, {
                    account_asset_id: loan?.account_asset_id,
                    remarks: remarks,
                  });
                  toast.success("Loan disbursed");
                  setShowDisbursementModal(false);
                  getDetail();
                } catch (error) {
                  toast.error(`${error}`);
                } finally {
                  setLoading(false);
                }
              }}
            >
              Disburse
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
      <Modal show={showModalPayment} onClose={() => setShowModalPayment(false)}>
        <Modal.Header>Payment #{paymentData?.installment_no}</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div className="flex flex-col gap-1">
              <Label>Payment Date</Label>
              <Datepicker
                defaultValue={moment(paymentData?.payment_date).toDate()}
                onChange={(date) =>
                  setPaymentData({
                    ...paymentData,
                    payment_date: date,
                  })
                }
                className="input-white"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Payment Amount</Label>
              <div className="relative">
                <CurrencyInput
                  className="rs-input !p-1.5 text-xl"
                  value={paymentData?.payment_amount ?? 0}
                  onValueChange={(_, __, val) =>
                    setPaymentData({
                      ...paymentData,
                      payment_amount: val?.float ?? 0,
                    })
                  }
                  style={{
                    fontSize: "1.5rem",
                  }}
                  decimalSeparator=","
                  groupSeparator="."
                  placeholder="Enter payment amount"
                />
                {(paymentData?.payment_amount ?? 0) !==
                  (paymentData?.total_paid ?? 0) && (
                  <div className="absolute top-3 right-2">
                    <IoRefreshCircleOutline
                      size={24}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                      onClick={() => {
                        setPaymentData((prev: any) => ({
                          ...prev,
                          payment_amount: prev.total_paid,
                        }));
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label>Asset Account</Label>
              <ReactSelect
                options={cashAccounts.map((e) => ({
                  label: e.name,
                  value: e.id,
                }))}
                value={{
                  label: paymentData?.account_asset?.name,
                  value: paymentData?.account_asset?.id,
                }}
                onChange={(val) => {
                  let selected = cashAccounts.find((e) => e.id == val?.value);
                  setPaymentData({
                    ...paymentData!,
                    account_asset: selected,
                    account_asset_id: selected?.id,
                  });
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label>Remarks</Label>
              <Textarea
                placeholder="Enter your remarks here..."
                value={paymentData?.remarks}
                onChange={(e) =>
                  setPaymentData({
                    ...paymentData,
                    remarks: e.target.value,
                  })
                }
                rows={4}
                className="input-white"
              />
            </div>
            <div>
              {(paymentData?.payment_amount ?? 0) >
                (paymentData?.total_paid ?? 0) && (
                <Toast
                  style={{
                    width: "100%",
                  }}
                >
                  <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-500 dark:bg-cyan-800 dark:text-cyan-200">
                    <HiFire className="h-5 w-5" />
                  </div>
                  <div className="ml-3 text-sm font-normal">
                    Kelebihan pembayaran{" "}
                    {money(
                      (paymentData?.payment_amount ?? 0) -
                        (paymentData?.total_paid ?? 0)
                    )}{" "}
                    akan otomatis masuk ke transaksi Simpanan Sukarela
                  </div>
                </Toast>
              )}
              {(paymentData?.payment_amount ?? 0) <
                (paymentData?.total_paid ?? 0) && (
                <Toast
                  style={{
                    width: "100%",
                  }}
                >
                  <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                    <HiFire className="h-5 w-5" />
                  </div>
                  <div className="ml-3 text-sm font-normal">
                    Kekurangan pembayaran{" "}
                    {money(
                      (paymentData?.payment_amount ?? 0) -
                        (paymentData?.total_paid ?? 0)
                    )}{" "}
                  </div>
                </Toast>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end w-full">
            <Button
              onClick={async () => {
                try {
                  if (!paymentData?.payment_amount) {
                    toast.error("Payment amount is required");
                    return;
                  }
                  if (paymentData?.payment_amount <= 0) {
                    toast.error("Payment amount must be greater than 0");
                    return;
                  }
                  if (!paymentData?.payment_date) {
                    toast.error("Payment date is required");
                    return;
                  }
                  if (
                    (paymentData?.payment_amount ?? 0) <
                    (paymentData?.total_paid ?? 0)
                  ) {
                    toast.error(
                      "Payment amount must be greater than or equal to total paid"
                    );
                    return;
                  }
                  setLoading(true);
                  await createLoanPayment(loanId!, paymentData);
                  toast.success("Payment added");
                  setShowModalPayment(false);
                  getDetail();
                  setPaymentData(undefined)
                } catch (error) {
                  toast.error(`${error}`);
                } finally {
                  setLoading(false);
                }
              }}
            >
              Add Payment
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};
export default LoanApplicationDetail;
