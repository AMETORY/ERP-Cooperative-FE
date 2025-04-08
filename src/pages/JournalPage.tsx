import { useContext, useEffect, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import {
  Button,
  Datepicker,
  Label,
  Modal,
  Table,
  Textarea,
  TextInput,
} from "flowbite-react";
import { LuFilter } from "react-icons/lu";
import { JournalModel } from "../models/journal";
import { SearchContext } from "../contexts/SearchContext";
import { LoadingContext } from "../contexts/LoadingContext";
import { PaginationResponse } from "../objects/pagination";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  createJournal,
  deleteJournal,
  getJournals,
} from "../services/api/journalApi";
import { getPagination } from "../utils/helper";
import Moment from "react-moment";
import { HiFire } from "react-icons/hi";

interface JournalPageProps {}

const JournalPage: FC<JournalPageProps> = ({}) => {
  const { search, setSearch } = useContext(SearchContext);
  const [showModal, setShowModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { loading, setLoading } = useContext(LoadingContext);
  const [journals, setJournals] = useState<JournalModel[]>([]);
  const [page, setPage] = useState(1);
  const [size, setsize] = useState(1000);
  const [pagination, setPagination] = useState<PaginationResponse>();
  const [selectedAccount, setSelectedAccount] = useState<JournalModel>();
  const nav = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [description, setDescription] = useState("");

  const saveJournal = async () => {
    try {
      setLoading(true);
      let resp: any = await createJournal({
        date: date.toISOString(),
        description,
      });
      toast.success("Journal created successfully");
      nav(`/journal/${resp.id}`);
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      getAllJournals();
    }
  }, [mounted, page, size, search]);

  const getAllJournals = () => {
    setLoading(true);
    getJournals({ page, size, search })
      .then((e: any) => {
        setJournals(e.data.items);
        setPagination(getPagination(e.data));
      })
      .catch((error) => {
        toast.error(`${error}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <AdminLayout permission="finance:journal:read">
      <div className="p-8 ">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold ">Journal</h1>
          <div className="flex items-center gap-2">
            <Button
              gradientDuoTone="purpleToBlue"
              pill
              onClick={() => {
                setShowModal(true);
              }}
            >
              + Create new journal
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
              <Table.HeadCell></Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {journals.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={5} className="text-center">
                    No journals found.
                  </Table.Cell>
                </Table.Row>
              )}
              {journals.map((journal, i) => (
                <Table.Row
                  key={i}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    <Moment format="DD MMM YYYY">{journal.date}</Moment>
                  </Table.Cell>
                  <Table.Cell>{journal.description}</Table.Cell>
                  <Table.Cell>
                    {journal.unbalanced && (
                      <div className="flex gap-1 items-center">
                        <div className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-800 dark:text-orange-200">
                          <HiFire className="h-4 w-4" />
                        </div>
                        <div className="ml-3 text-sm font-normal">
                          <span className="text-red-500 font-semibold">
                            Attention: Journal is not balance
                          </span>
                        </div>
                      </div>
                    )}
                  </Table.Cell>

                  <Table.Cell width={200}>
                    <Link
                      to={`/journal/${journal.id}`}
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer"
                    >
                      View
                    </Link>
                    <a
                      href="#"
                      className="font-medium text-red-600 hover:underline dark:text-red-500 ms-2"
                      onClick={(e) => {
                        e.preventDefault();
                        if (
                          window.confirm(
                            `Are you sure you want to delete project ${journal.description}?`
                          )
                        ) {
                          deleteJournal(journal?.id!).then(() => {
                            getAllJournals();
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
      {showModal && (
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          size="lg"
          aria-labelledby="create-journal-modal"
        >
          <Modal.Header>Create New Journal</Modal.Header>
          <Modal.Body>
            <form>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="journal-title" value="Date" />
                  <Datepicker
                    value={date}
                    onChange={(val) => {
                      setDate(val!);
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="journal-title" value="Description" />
                  <Textarea
                    rows={7}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                    id="journal-description"
                    placeholder="Journal Description"
                    required
                  />
                </div>
              </div>
              <div className="mt-16"></div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <div className="flex justify-end w-full">
              <Button onClick={saveJournal}>Save</Button>
            </div>
          </Modal.Footer>
        </Modal>
      )}
    </AdminLayout>
  );
};
export default JournalPage;
