import { useContext, useEffect, useRef, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { Link, useParams } from "react-router-dom";
import { LoadingContext } from "../contexts/LoadingContext";
import {
  addTransactionJournal,
  getJournalDetail,
  updateJournal,
} from "../services/api/journalApi";
import { JournalModel } from "../models/journal";
import {
  Button,
  Datepicker,
  Label,
  Modal,
  Table,
  Textarea,
  TextInput,
  Toast,
  ToastToggle,
  ToggleSwitch,
} from "flowbite-react";
import moment from "moment";
import toast from "react-hot-toast";
import { LuFilter } from "react-icons/lu";
import { money } from "../utils/helper";
import { AccountModel } from "../models/account";
import { getAccounts } from "../services/api/accountApi";
import Select, { InputActionMeta } from "react-select";
import Moment from "react-moment";
import { HiFire } from "react-icons/hi";
import { deleteTransaction } from "../services/api/transactionApi";

interface JournalDetailProps {}

const JournalDetail: FC<JournalDetailProps> = ({}) => {
  const { journalId } = useParams();
  const { loading, setLoading } = useContext(LoadingContext);
  const [mounted, setMounted] = useState(false);
  const [journal, setJournal] = useState<JournalModel>();
  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [description, setDescription] = useState("");
  const amountRef = useRef<HTMLInputElement | null>(null);
  const creditRef = useRef<HTMLInputElement | null>(null);
  const debitRef = useRef<HTMLInputElement | null>(null);
  const [amount, setAmount] = useState(0);
  const [debit, setDebit] = useState(0);
  const [credit, setCredit] = useState(0);
  const [sourceAccounts, setSourceAccounts] = useState<AccountModel[]>([]);
  const [destinationAccounts, setDestinationAccounts] = useState<
    AccountModel[]
  >([]);
  const [selectedSource, setSelectedSource] = useState<AccountModel | null>(
    null
  );
  const [selectedDestination, setSelectedDestination] =
    useState<AccountModel | null>(null);
  const [isDouble, setIsDouble] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && journalId) {
      getJournalDetail(journalId!).then((resp: any) => {
        setJournal(resp.data);
      });
      getSourceAccounts("");
      getDestinationAccounts("");
    }
  }, [mounted, journalId]);

  const getSourceAccounts = async (s: string) => {
    try {
      let resp: any = await getAccounts({ page: 1, size: 20, search: s });
      setSourceAccounts(resp.data.items);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const getDestinationAccounts = async (s: string) => {
    try {
      let resp: any = await getAccounts({ page: 1, size: 20, search: s });
      setDestinationAccounts(resp.data.items);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const onAddTrans = () => {};
  return (
    <AdminLayout>
      <div className="flex flex-row w-full h-full flex-1 gap-2">
        <div className="w-[300px] h-full p-4 space-y-4 flex flex-col overflow-y-auto">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold">Journal Detail</h3>
            <div className="flex gap-2 items-center"></div>
          </div>
          <div className="flex flex-col space-y-4">
            <div>
              <Label>Date</Label>
              <Datepicker
                placeholder="Select Date"
                value={moment(journal?.date).toDate()}
                onChange={(date: any) => {
                  setJournal({
                    ...journal!,
                    date: moment(date).toISOString(),
                  });
                }}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                rows={7}
                value={journal?.description}
                onChange={(e) =>
                  setJournal({ ...journal!, description: e.target.value })
                }
              />
            </div>
            <Button
              onClick={() => {
                setLoading(true);
                updateJournal(journal!.id!, journal!)
                  .then((resp: any) => {
                    toast.success("Journal updated successfully");
                    getJournalDetail(journalId!).then((resp: any) => {
                      setJournal(resp.data);
                    });
                  })
                  .catch(toast.error)
                  .finally(() => setLoading(false));
              }}
            >
              Save
            </Button>
            {journal?.unbalanced && (
              <Toast>
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-800 dark:text-orange-200">
                  <HiFire className="h-5 w-5" />
                </div>
                <div className="ml-3 text-sm font-normal">
                  <span className="text-red-500 font-bold">
                    Attention: Journal is not balance
                  </span>
                </div>
                <ToastToggle />
              </Toast>
            )}
          </div>
        </div>
        <div className="w-[calc(100%-300px)] border-l relative bg-gray-50 p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold ">Transactions</h1>
            <div className="flex items-center gap-2">
              <Button
                gradientDuoTone="purpleToBlue"
                pill
                onClick={() => setShowModal(true)}
              >
                + Transaction
              </Button>
              <LuFilter
                className=" cursor-pointer text-gray-400 hover:text-gray-600"
                onClick={() => {}}
              />
            </div>
          </div>
          <Table className=" rounded-lg shadow-md ">
            <Table.Head>
              <Table.HeadCell>Date</Table.HeadCell>
              <Table.HeadCell>Description</Table.HeadCell>
              <Table.HeadCell>Account</Table.HeadCell>
              <Table.HeadCell align="right">Debit</Table.HeadCell>
              <Table.HeadCell align="right">Credit</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {journal?.transactions.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={5} className="text-center">
                    No transactions found.
                  </Table.Cell>
                </Table.Row>
              )}

              {journal?.transactions.map((transaction, i) => (
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
                  <Table.Cell>{transaction.description}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/account/${transaction?.account?.id}/report`}>
                      {transaction?.account?.name}
                    </Link>
                  </Table.Cell>
                  <Table.Cell align="right">
                    {money(transaction.debit)}
                  </Table.Cell>
                  <Table.Cell align="right">
                    {money(transaction.credit)}
                  </Table.Cell>

                  <Table.Cell>
                    <a
                      href="#"
                      className="font-medium text-red-600 hover:underline dark:text-red-500 ms-2"
                      onClick={(e) => {
                        e.preventDefault();
                        if (
                          window.confirm(
                            `Are you sure you want to delete project ${transaction.description}?`
                          )
                        ) {
                          deleteTransaction(transaction?.id!).then(() => {
                            getJournalDetail(journalId!).then((resp: any) => {
                              setJournal(resp.data);
                            });
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
        </div>
      </div>
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Transaction Form</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <Label>Date</Label>
              <Datepicker
                required
                value={date}
                onChange={(e) => setDate(e!)}
                placeholder="Select date"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                rows={7}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
              />
            </div>

            <div>
              <Label>{isDouble ? "Source" : "Account"}</Label>
              <Select
                isClearable
                options={sourceAccounts.map((t) => ({
                  label: t.name!,
                  value: t.id!,
                }))}
                value={
                  selectedSource
                    ? {
                        label: selectedSource!.name!,
                        value: selectedSource!.id!,
                      }
                    : { label: "", value: "" }
                }
                onChange={(e) =>
                  setSelectedSource(
                    e?.value
                      ? sourceAccounts.find((v) => v.id === e!.value)!
                      : null
                  )
                }
                onInputChange={(e) => {
                  getSourceAccounts(e);
                }}
                placeholder="Select source"
              />
            </div>
            <div>
              <ToggleSwitch
                checked={isDouble}
                onChange={(e) => setIsDouble(e!)}
                label="Double Entry"
              />
            </div>
            {isDouble && (
              <div>
                <Label>Destination</Label>
                <Select
                  isClearable
                  options={destinationAccounts.map((t) => ({
                    label: t.name!,
                    value: t.id!,
                  }))}
                  value={
                    selectedDestination
                      ? {
                          label: selectedDestination!.name!,
                          value: selectedDestination!.id!,
                        }
                      : { label: "", value: "" }
                  }
                  onChange={(e) =>
                    setSelectedDestination(
                      e?.value
                        ? destinationAccounts.find((v) => v.id === e!.value)!
                        : null
                    )
                  }
                  onInputChange={(e) => {
                    getDestinationAccounts(e);
                  }}
                  placeholder="Select destination"
                />
              </div>
            )}
            {isDouble && (
              <div>
                <Label>Amount</Label>
                <TextInput
                  type="number"
                  ref={amountRef}
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="Enter amount"
                />
                {
                  <h1
                    className="text-4xl font-semibold text-right cursor-pointer"
                    onClick={() => {
                      amountRef.current?.focus();
                    }}
                  >
                    {money(amount)}
                  </h1>
                }
              </div>
            )}
            {!isDouble && (
              <div>
                <Label>Debit</Label>
                <TextInput
                  type="number"
                  ref={debitRef}
                  required
                  value={debit}
                  onChange={(e) => setDebit(Number(e.target.value))}
                  placeholder="Enter debit"
                />
                {
                  <h1
                    className="text-4xl font-semibold text-right cursor-pointer"
                    onClick={() => {
                      debitRef.current?.focus();
                    }}
                  >
                    {money(debit)}
                  </h1>
                }
              </div>
            )}
            {!isDouble && (
              <div>
                <Label>Credit</Label>
                <TextInput
                  type="number"
                  ref={creditRef}
                  required
                  value={credit}
                  onChange={(e) => setCredit(Number(e.target.value))}
                  placeholder="Enter credit"
                />
                {
                  <h1
                    className="text-4xl font-semibold text-right cursor-pointer"
                    onClick={() => {
                      creditRef.current?.focus();
                    }}
                  >
                    {money(credit)}
                  </h1>
                }
              </div>
            )}

            <div className="h-[200px]"></div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-end w-full">
            <Button
              onClick={async () => {
                try {
                  setLoading(true);

                  let data = {
                    date: date?.toISOString(),
                    description: description,
                    amount: isDouble ? amount : Math.abs(debit - credit),
                    credit: !isDouble ? credit : 0,
                    debit: !isDouble ? debit : 0,
                    source_id: isDouble ? selectedSource?.id : null,
                    account_id: !isDouble ? selectedSource?.id : null,
                    destination_id: isDouble ? selectedDestination?.id : null,
                  };
                  await addTransactionJournal(journalId!, data);
                  toast.success("Transaction created successfully");
                  setShowModal(false);
                  getJournalDetail(journalId!).then((resp: any) => {
                    setJournal(resp.data);
                  });
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
export default JournalDetail;
