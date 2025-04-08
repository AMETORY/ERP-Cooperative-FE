import { useContext, useEffect, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import {
  Button,
  Datepicker,
  Label,
  Modal,
  Pagination,
  Table,
  Textarea,
  TextInput,
} from "flowbite-react";
import { LuFilter } from "react-icons/lu";
import Select from "react-select";
import { SavingModel } from "../models/saving";
import { ActiveCompanyContext } from "../contexts/CompanyContext";
import CurrencyInput from "react-currency-input-field";
import { getMembers } from "../services/api/commonApi";
import { CooperativeMemberModel } from "../models/cooperative_member";
import { AccountModel } from "../models/account";
import { getAccounts } from "../services/api/accountApi";
import toast from "react-hot-toast";
import {
  createSaving,
  deleteSaving,
  getSavings,
} from "../services/api/cooperativeSavingApi";
import { LoadingContext } from "../contexts/LoadingContext";
import { PaginationResponse } from "../objects/pagination";
import { SearchContext } from "../contexts/SearchContext";
import { getPagination, money } from "../utils/helper";
import Moment from "react-moment";

interface SavingPageProps {}

const SavingPage: FC<SavingPageProps> = ({}) => {
  const { search, setSearch } = useContext(SearchContext);
  const [page, setPage] = useState(1);
  const [size, setsize] = useState(20);
  const [pagination, setPagination] = useState<PaginationResponse>();
  const { setLoading } = useContext(LoadingContext);
  const [mounted, setMounted] = useState(false);
  const { activeCompany } = useContext(ActiveCompanyContext);
  const [showModal, setShowModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [saving, setSaving] = useState<SavingModel>();
  const [members, setMembers] = useState<CooperativeMemberModel[]>([]);
  const [cashAccounts, setCashAccounts] = useState<AccountModel[]>([]);
  const [savings, setSavings] = useState<SavingModel[]>([]);

  const savingType = [
    { value: "PRINCIPAL", label: "Simpanan Pokok" },
    { value: "MANDATORY", label: "Simpanan Wajib" },
    { value: "VOLUNTARY", label: "Simpanan Sukarela" },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      searchMember("");
      getAccountCash("");
    }
  }, [mounted]);

  const searchMember = (s: string) => {
    getMembers({ page: 1, size: 10, search: s }).then((val: any) => {
      setMembers(val.data.items);
    });
  };
  const getAccountCash = (s: string) => {
    getAccounts({
      page: 1,
      size: 10,
      search: s,
      cashflow_sub_group: "cash_bank",
    }).then((val: any) => {
      setCashAccounts(val.data.items);
    });
  };

  const getAllSavings = () => {
    getSavings({ page, size, search }).then((val: any) => {
      setSavings(val.data.items);
      setPagination(getPagination(val.data));
    });
  };

  useEffect(() => {
    if (mounted) {
      getAllSavings();
    }
  }, [mounted, page, size, search]);

  const convertSavingType = (savingType: string) => {
    switch (savingType) {
      case "PRINCIPAL":
        return "Simpanan Pokok";

        break;
      case "MANDATORY":
        return "Simpanan Wajib";

        break;
      case "VOLUNTARY":
        return "Simpanan Sukarela";

        break;

      default:
        break;
    }
  };
  return (
    <AdminLayout isCooperative permission="cooperative:saving:read">
      <div className="p-8 ">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold ">Saving</h1>
          <div className="flex items-center gap-2">
            <Button
              gradientDuoTone="purpleToBlue"
              pill
              onClick={() => {
                setSaving({
                  date: new Date(),
                  saving_type: "MANDATORY",
                  amount:
                    activeCompany?.cooperative_setting
                      ?.mandatory_savings_amount ?? 0,
                });
                setShowModal(true);
              }}
            >
              + Create new saving
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
              <Table.HeadCell>Description</Table.HeadCell>
              <Table.HeadCell>Type</Table.HeadCell>
              <Table.HeadCell>Member</Table.HeadCell>
              <Table.HeadCell>Amount</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Account</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {savings.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={5} className="text-center">
                    No data found.
                  </Table.Cell>
                </Table.Row>
              )}
              {savings.map((saving, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <Moment format="DD MMM YYYY">{saving?.date}</Moment>
                  </Table.Cell>
                  <Table.Cell>{saving?.notes}</Table.Cell>
                  <Table.Cell>
                    {convertSavingType(saving?.saving_type)}
                  </Table.Cell>
                  <Table.Cell>{saving?.cooperative_member?.name}</Table.Cell>
                  <Table.Cell>{money(saving?.amount)}</Table.Cell>
                  <Table.Cell>
                    {saving?.transactions &&
                      saving?.transactions[0]?.account?.name}
                  </Table.Cell>
                  <Table.Cell>
                    {saving?.transactions &&
                      saving?.transactions[1]?.account?.name}
                  </Table.Cell>
                  <Table.Cell>
                    {/* <a
                                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer"
                                      onClick={() => {
                                      }}
                                    >
                                      View
                                    </a> */}
                    <a
                      className="font-medium text-red-600 hover:underline dark:text-red-500 ms-2 cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        if (
                          window.confirm(
                            `Are you sure you want to delete [${saving?.cooperative_member?.name}] ${saving.notes}?`
                          )
                        ) {
                          deleteSaving(saving!.id!).then(() => {
                            getAllSavings();
                          });
                        }
                      }}
                    >
                      Delete
                    </a>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          <Pagination
            className="mt-4"
            currentPage={page}
            totalPages={pagination?.total_pages ?? 0}
            onPageChange={(val) => {
              setPage(val);
            }}
            showIcons
          />
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
              Saving Form
            </h2>
          </Modal.Header>
          <Modal.Body>
            {/* Add form elements here */}
            <div className="flex flex-col gap-4">
              <div>
                <Label>Date</Label>
                <Datepicker
                  onChange={(date) => setSaving({ ...saving!, date: date! })}
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
                    value: saving?.cooperative_member?.id,
                    label: saving?.cooperative_member?.name,
                    number: saving?.cooperative_member?.member_id_number,
                  }}
                  onChange={(val) => {
                    let selected = members.find((e) => e.id == val?.value);
                    setSaving({
                      ...saving!,
                      cooperative_member: selected,
                      cooperative_member_id: selected?.id,
                    });
                  }}
                  onInputChange={searchMember}
                />
              </div>
              <div>
                <Label>Type</Label>
                <Select
                  options={savingType}
                  value={savingType?.find(
                    (e) => e.value == saving?.saving_type
                  )}
                  onChange={(val) => {
                    let amount = 0;
                    switch (val?.value) {
                      case "PRINCIPAL":
                        setSaving({
                          ...saving!,
                          saving_type: val?.value,
                          amount:
                            activeCompany?.cooperative_setting
                              ?.principal_savings_amount ?? 0,
                        });
                        break;
                      case "VOLUNTARY":
                        setSaving({
                          ...saving!,
                          saving_type: val?.value,
                          amount:
                            activeCompany?.cooperative_setting
                              ?.voluntary_savings_amount ?? 0,
                        });
                        break;
                      case "MANDATORY":
                        setSaving({
                          ...saving!,
                          saving_type: val?.value,
                          amount:
                            activeCompany?.cooperative_setting
                              ?.mandatory_savings_amount ?? 0,
                        });
                        break;

                      default:
                        break;
                    }
                  }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Amount</Label>
                <CurrencyInput
                  className="rs-input !p-1.5 "
                  placeholder="Amount"
                  value={saving?.amount}
                  groupSeparator="."
                  decimalSeparator=","
                  onValueChange={(_, __, val) =>
                    setSaving({
                      ...saving!,
                      amount: val?.float ?? 0,
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Account</Label>
                <Select
                  options={cashAccounts?.map((e) => ({
                    value: e.id,
                    label: e.name,
                  }))}
                  value={{
                    value: saving?.account_destination?.id,
                    label: saving?.account_destination?.name,
                  }}
                  onChange={(val) => {
                    let selected = cashAccounts.find((e) => e.id == val?.value);
                    setSaving({
                      ...saving!,
                      account_destination_id: selected?.id,
                      account_destination: selected,
                    });
                  }}
                  onInputChange={searchMember}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label>Description</Label>
                <Textarea
                  rows={7}
                  placeholder="Description"
                  value={saving?.notes}
                  onChange={(e) =>
                    setSaving({
                      ...saving!,
                      notes: e.target.value,
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
                    if (!saving?.cooperative_member?.id) {
                      throw new Error("Please select a member");
                    }
                    if (!saving?.account_destination?.id) {
                      throw new Error("Please select an account");
                    }
                    if (!saving?.amount) {
                      throw new Error("Please input an amount");
                    }
                    setLoading(true);
                    await createSaving(saving);
                    setShowModal(false);
                    getAllSavings();
                    toast.success("Saving created successfully");
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
export default SavingPage;
