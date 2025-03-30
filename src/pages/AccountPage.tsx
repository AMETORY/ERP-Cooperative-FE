import { useContext, useEffect, useRef, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import {
  Button,
  Drawer,
  Label,
  Modal,
  Pagination,
  Table,
  TextInput,
  ToggleSwitch,
} from "flowbite-react";
import { LoadingContext } from "../contexts/LoadingContext";
import { PaginationResponse } from "../objects/pagination";
import { AccountModel } from "../models/account";
import {
  createAccount,
  deleteAccount,
  getAccountCode,
  getAccounts,
  getAccountTypes,
} from "../services/api/accountApi";
import toast from "react-hot-toast";
import { getPagination, money } from "../utils/helper";
import { SearchContext } from "../contexts/SearchContext";
import { BsCheckCircle, BsFilter } from "react-icons/bs";
import { LuFilter } from "react-icons/lu";
import Select, { InputActionMeta } from "react-select";
import moment from "moment";
import { useNavigate } from "react-router-dom";

interface AccountPageProps {}

const AccountPage: FC<AccountPageProps> = ({}) => {
  const { search, setSearch } = useContext(SearchContext);
  const [showModal, setShowModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { loading, setLoading } = useContext(LoadingContext);
  const [accounts, setAccounts] = useState<AccountModel[]>([]);
  const [page, setPage] = useState(1);
  const [size, setsize] = useState(1000);
  const [pagination, setPagination] = useState<PaginationResponse>();
  const [account, setAccount] = useState<AccountModel | null>(null);
  const [accountTypes, setAccountTypes] = useState<any>({});
  const [selectedAccount, setSelectedAccount] = useState<AccountModel>();
  const nav = useNavigate();
  const timeout = useRef<number | null>(null);

  const types = [
    "ASSET",
    "RECEIVABLE",
    "LIABILITY",
    "EQUITY",
    "INCOME",
    "EXPENSE",
    "COST",
  ];
  const [selectedTypes, setSelectedTypes] = useState([
    "ASSET",
    "RECEIVABLE",
    "LIABILITY",
    "EQUITY",
    "INCOME",
    "EXPENSE",
    "COST",
  ]);

  useEffect(() => {
    setMounted(true);
    getAccountTypes().then((res: any) => {
      setAccountTypes(res.data);
    });
  }, []);
  useEffect(() => {
    if (!mounted) return;
    getAllAccounts();
  }, [mounted, page, size, selectedTypes]);

  useEffect(() => {
    if (timeout.current) {
      window.clearTimeout(timeout.current);
    }
    timeout.current = window.setTimeout(() => {
      getAllAccounts();
    }, 300);
  }, [search]);

  const getAllAccounts = async () => {
    try {
      let accounts: AccountModel[] = [];
      setLoading(true);
      for (const type of selectedTypes) {
        let resp: any = await getAccounts({ page, size, search, type });
        accounts = [...accounts, ...resp.data.items];
      }
      setAccounts(accounts);
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setLoading(false);
    }
  };

  const getGroupLabel = (type: string, value: string) => {
    return accountTypes[type].groups.find((g: any) => g.value === value)?.label;
  };
  const getSubGroupLabel = (type: string, group: string, value: string) => {
    return accountTypes[type].groups
      .find((g: any) => g.value === group)
      ?.subgroups.find((g: any) => g.value === value)?.label;
  };
  return (
    <AdminLayout>
      <div className="p-8 ">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold ">Account</h1>
          <div className="flex items-center gap-2">
            <Button
              gradientDuoTone="purpleToBlue"
              pill
              onClick={() => {
                setShowModal(true);
                setSelectedAccount({
                  type: "ASSET",
                  cashflow_subgroup: "",
                });
                getAccountCode(selectedAccount?.type ?? "ASSET").then(
                  (res: any) => {
                    if (res.last_code) {
                      setSelectedAccount((prev) => ({
                        ...prev,
                        code: `${parseInt(res.last_code) + 1}`,
                      }));
                    }
                  }
                );
              }}
            >
              + Create new account
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
              <Table.HeadCell>Account</Table.HeadCell>
              <Table.HeadCell>Type</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell align="right">Balance</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {accounts.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={5} className="text-center">
                    No accounts found.
                  </Table.Cell>
                </Table.Row>
              )}
              {accounts.map((account, i) => (
                <Table.Row
                  key={i}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell
                    className="whitespace-nowrap font-medium text-gray-900 dark:text-white cursor-pointer hover:font-semibold"
                    onClick={() => {
                      nav(`/account/${account.id}/report`);
                    }}
                  >
                    {account.code && `[${account.code}] `}
                    {account.name}
                    {account.is_tax && (
                      <span className="text-xs text-green-400 flex items-center space-x-1">
                        <BsCheckCircle className="text-green-400" /> 
                        <span>Tax Account</span>
                      </span>
                    )}
                  </Table.Cell>
                  <Table.Cell>{account.type}</Table.Cell>
                  <Table.Cell>{account.category}</Table.Cell>
                  <Table.Cell align="right">
                    {money(account.balance)}
                  </Table.Cell>
                  <Table.Cell>
                    {account.is_deletable && (account.balance ?? 0) == 0 && (
                      <a
                        href="#"
                        className="font-medium text-red-600 hover:underline dark:text-red-500 ms-2"
                        onClick={(e) => {
                          e.preventDefault();
                          if (
                            window.confirm(
                              `Are you sure you want to delete project ${account.name}?`
                            )
                          ) {
                            deleteAccount(account?.id!).then(() => {
                              getAllAccounts();
                            });
                          }
                        }}
                      >
                        Delete
                      </a>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
        {/* <Pagination
          className="mt-4"
          currentPage={page}
          totalPages={pagination?.total_pages ?? 0}
          onPageChange={(val) => {
            setPage(val);
          }}
          showIcons
        /> */}
      </div>
      <Drawer
        position="right"
        open={showFilter}
        onClose={() => setShowFilter(false)}
      >
        <div className="mt-16">
          <Drawer.Items>
            <div className="flex flex-col">
              <h3 className="font-semibold text-2xlpro">Filter</h3>
              <div>
                <Label>Account Type</Label>
                <Select
                  isMulti
                  value={selectedTypes.map((t) => ({ label: t, value: t }))}
                  options={types.map((t) => ({ label: t, value: t }))}
                  onChange={(val) => {
                    setSelectedTypes(val.map((v) => v.value));
                  }}
                />
              </div>
            </div>
          </Drawer.Items>
        </div>
      </Drawer>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Create Account</Modal.Header>
        <Modal.Body>
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              try {
                setLoading(true);
                await createAccount(selectedAccount);
                toast.success("Account created successfully");
                setShowModal(false);
                getAllAccounts();
              } catch (error) {
                toast.error(`${error}`);
              } finally {
                setLoading(false);
              }
              //   createAccount({
              //     name: e.currentTarget.name,
              //     type: e.currentTarget.type.value,
              //     category: e.currentTarget.category.value,
              //   }).then(() => {
              //     setShowModal(false);
              //     getAllAccounts();
              //   });
            }}
          >
            <div className="space-y-4">
              <div>
                <Label>Code</Label>
                <TextInput
                  type="text"
                  name="code"
                  required
                  placeholder="Enter account code"
                  value={selectedAccount?.code}
                  onChange={(e) => {
                    setSelectedAccount({
                      ...selectedAccount,
                      code: e.target.value,
                    });
                  }}
                />
              </div>

              <div>
                <Label>Name</Label>
                <TextInput
                  type="text"
                  name="name"
                  required
                  placeholder="Enter account name"
                  value={selectedAccount?.name}
                  onChange={(e) => {
                    setSelectedAccount({
                      ...selectedAccount,
                      name: e.target.value,
                    });
                  }}
                />
              </div>
              <div>
                <Label>Type</Label>
                <Select
                  name="type"
                  options={types.map((t) => ({ label: t, value: t }))}
                  required
                  value={{
                    label: selectedAccount?.type,
                    value: selectedAccount?.type,
                  }}
                  onChange={(e) => {
                    getAccountCode(e?.value!).then((res: any) => {
                      setSelectedAccount((prev) => ({
                        ...prev,
                        type: e?.value,
                        code: res.last_code && `${parseInt(res.last_code) + 1}`,
                      }));
                    });
                  }}
                />
              </div>
              {(selectedAccount?.type == "RECEIVABLE" ||
                selectedAccount?.type == "LIABILITY") && (
                <div>
                  <ToggleSwitch
                    label="Is Tax Account"
                    checked={selectedAccount?.is_tax ?? false}
                    onChange={(e) => {
                      setSelectedAccount({
                        ...selectedAccount!,
                        is_tax: e!,
                      });
                    }}
                  />
                </div>
              )}
              <div>
                <Label>Category</Label>
                <Select
                  name="category"
                  options={
                    selectedAccount?.type
                      ? accountTypes[selectedAccount?.type].categories.map(
                          (t: any) => ({ label: t, value: t })
                        )
                      : []
                  }
                  value={{
                    label: selectedAccount?.category,
                    value: selectedAccount?.category,
                  }}
                  onChange={(e) => {
                    setSelectedAccount({
                      ...selectedAccount,
                      category: e?.value,
                      cashflow_group: "",
                      cashflow_subgroup: "",
                    });
                  }}
                  required
                />
              </div>
              <div>
                <Label>Group</Label>
                <Select
                  name="group"
                  options={
                    selectedAccount?.type
                      ? accountTypes[selectedAccount?.type].groups
                      : []
                  }
                  value={{
                    value: selectedAccount?.cashflow_group,
                    label:
                      selectedAccount?.cashflow_group &&
                      getGroupLabel(
                        selectedAccount?.type ?? "",
                        selectedAccount?.cashflow_group ?? ""
                      ),
                  }}
                  onChange={(e) => {
                    setSelectedAccount({
                      ...selectedAccount,
                      cashflow_group: e?.value,
                      cashflow_subgroup: "",
                    });
                  }}
                  required
                />
              </div>
              <div>
                <Label>Sub Group</Label>
                <Select
                  name="group"
                  options={
                    selectedAccount?.type &&
                    accountTypes[selectedAccount?.type].groups.find(
                      (g: any) => g.value === selectedAccount?.cashflow_group
                    )
                      ? accountTypes[selectedAccount?.type].groups.find(
                          (g: any) =>
                            g.value === selectedAccount?.cashflow_group
                        ).subgroups
                      : []
                  }
                  value={{
                    value: selectedAccount?.cashflow_subgroup,
                    label:
                      selectedAccount?.cashflow_subgroup &&
                      getSubGroupLabel(
                        selectedAccount?.type ?? "",
                        selectedAccount?.cashflow_group ?? "",
                        selectedAccount?.cashflow_subgroup ?? ""
                      ),
                  }}
                  onChange={(e) => {
                    setSelectedAccount({
                      ...selectedAccount,
                      cashflow_subgroup: e?.value,
                    });
                  }}
                  required
                />
              </div>
            </div>
            <div className="h-32"></div>
            <div className="flex justify-end">
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </AdminLayout>
  );
};
export default AccountPage;
