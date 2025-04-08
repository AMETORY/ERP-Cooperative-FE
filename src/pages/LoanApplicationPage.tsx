import { useContext, useEffect, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import {
  Button,
  Datepicker,
  Label,
  Modal,
  Table,
  Textarea,
} from "flowbite-react";
import { LuFilter } from "react-icons/lu";
import { SearchContext } from "../contexts/SearchContext";
import { PaginationResponse } from "../objects/pagination";
import { ActiveCompanyContext } from "../contexts/CompanyContext";
import { LoadingContext } from "../contexts/LoadingContext";
import { LoanApplicationModel } from "../models/loan_application";
import { CooperativeMemberModel } from "../models/cooperative_member";
import { AccountModel } from "../models/account";
import { getPagination } from "../utils/helper";
import { createLoan, getLoans } from "../services/api/cooperativeLoanApi";
import { getMembers } from "../services/api/commonApi";
import Select from "react-select";
import CurrencyInput from "react-currency-input-field";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface LoanApplicationPageProps {}

const LoanApplicationPage: FC<LoanApplicationPageProps> = ({}) => {
  const [showModal, setShowModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const { search, setSearch } = useContext(SearchContext);
  const [page, setPage] = useState(1);
  const [size, setsize] = useState(20);
  const [pagination, setPagination] = useState<PaginationResponse>();
  const { setLoading } = useContext(LoadingContext);
  const [mounted, setMounted] = useState(false);
  const { activeCompany } = useContext(ActiveCompanyContext);
  const [loan, setLoan] = useState<LoanApplicationModel>();
  const [members, setMembers] = useState<CooperativeMemberModel[]>([]);
  const [cashAccounts, setCashAccounts] = useState<AccountModel[]>([]);
  const [loans, setLoans] = useState<LoanApplicationModel[]>([]);
  const nav = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      searchMember("");
      //   getAccountCash("");
    }
  }, [mounted]);

  const searchMember = (s: string) => {
    getMembers({ page: 1, size: 10, search: s }).then((val: any) => {
      setMembers(val.data.items);
    });
  };

  const getAllLoans = () => {
    getLoans({ page, size, search }).then((val: any) => {
      setLoans(val.data.items);
      setPagination(getPagination(val.data));
    });
  };

  useEffect(() => {
    if (mounted) {
      getAllLoans();
    }
  }, [mounted, page, size, search]);
  return (
    <AdminLayout isCooperative permission="cooperative:loan_application:read">
      <div className="p-8 ">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold ">Loan Application</h1>
          <div className="flex items-center gap-2">
            <Button
              gradientDuoTone="purpleToBlue"
              pill
              onClick={() => {
                setShowModal(true);
                setLoan({
                  submission_date: new Date(),
                  loan_amount: 0,
                  loan_purpose: "",
                  loan_number: "",
                  admin_fee: 0,
                  status: "PENDING",
                });
              }}
            >
              + Create new Loan
            </Button>
            <LuFilter
              className=" cursor-pointer text-gray-400 hover:text-gray-600"
              onClick={() => {
                setShowFilter(true);
              }}
            />
          </div>
        </div>
        <div className="h-[calc(100vh-200px)] overflow-y-auto">
          <Table>
            <Table.Head>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Member</Table.HeadCell>
              <Table.HeadCell>Amount</Table.HeadCell>
              <Table.HeadCell>Balance</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {loans.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={7} className="text-center">
                    No data found.
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>
      </div>
      {showModal && (
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          aria-labelledby="submit-saving"
        >
          <Modal.Header>
            <h2 id="submit-saving" className="text-xl font-bold">
              {" "}
              Loan Form
            </h2>
          </Modal.Header>
          <Modal.Body>
            {/* Add form elements here */}
            <div className="flex flex-col gap-4">
              <div>
                <Label>Date</Label>
                <Datepicker
                  onChange={(date) =>
                    setLoan({ ...loan!, submission_date: date! })
                  }
                  className="w-full input-white"
                />
              </div>
              <div>
                <Label>Member</Label>
                <Select
                  options={members?.map((e) => ({
                    value: e.id,
                    label: e.name,
                    number: e.member_id_number,
                  }))}
                  value={{
                    value: loan?.member?.id,
                    label: loan?.member?.name,
                    number: loan?.member?.member_id_number,
                  }}
                  onChange={(val) => {
                    let selected = members.find((e) => e.id == val?.value);
                    setLoan({
                      ...loan!,
                      member: selected,
                      member_id: selected?.id,
                    });
                  }}
                  onInputChange={searchMember}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Amount</Label>
                <CurrencyInput
                  className="rs-input !p-1.5 "
                  placeholder="Amount"
                  value={loan?.loan_amount}
                  groupSeparator="."
                  decimalSeparator=","
                  onValueChange={(_, __, val) =>
                    setLoan({
                      ...loan!,
                      loan_amount: val?.float ?? 0,
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Loan Purpose</Label>
                <Textarea
                  className="input-white"
                  rows={7}
                  placeholder="Loan Purpose"
                  value={loan?.loan_purpose}
                  onChange={(e) =>
                    setLoan({
                      ...loan!,
                      loan_purpose: e.target.value,
                    })
                  }
                  style={{
                    backgroundColor: "white",
                  }}
                />
              </div>
              <div className="h-16"></div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="w-full flex justify-end">
              <Button
                onClick={async () => {
                  try {
                    if (!loan?.submission_date) {
                      toast.error("Date is required");
                      return;
                    }
                    if (!loan?.member?.id) {
                      toast.error("Member is required");
                      return;
                    }
                    if (!loan?.loan_amount) {
                      toast.error("Amount is required");
                      return;
                    }
                    if (!loan?.loan_purpose) {
                      toast.error("Loan Purpose is required");
                      return;
                    }
                    setLoading(true);

                    let resp: any = await createLoan({
                        ...loan!,
                        data:"[]"
                    });
                    setShowModal(false);
                    getAllLoans();
                    
                    toast.success("Loan created successfully");
                    nav(`/cooperative/loan/${resp.data.id}`);
                  } catch (error: any) {
                    toast.error(`${error}`);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Submit
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      )}
    </AdminLayout>
  );
};
export default LoanApplicationPage;
