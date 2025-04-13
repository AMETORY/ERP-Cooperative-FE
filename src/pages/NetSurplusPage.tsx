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
import { getPagination } from "../utils/helper";
import toast from "react-hot-toast";
import { SearchContext } from "../contexts/SearchContext";
import { LoadingContext } from "../contexts/LoadingContext";
import { PaginationResponse } from "../objects/pagination";
import { Link, useNavigate } from "react-router-dom";
import { NetSurplusModel } from "../models/net_surplus";
import {
  createNetSurplus,
  deleteNetSurplus,
  getNetSurplus,
} from "../services/api/netSurplusApi";
import Moment from "react-moment";
import moment from "moment";
import { getClosingBooks } from "../services/api/reportApi";
import { ClosingBookReport } from "../models/report";
import Select from "react-select";
interface NetSurplusPageProps {}

const NetSurplusPage: FC<NetSurplusPageProps> = ({}) => {
  const { search, setSearch } = useContext(SearchContext);
  const [showModal, setShowModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { loading, setLoading } = useContext(LoadingContext);
  const [netSurplus, setNetSurplus] = useState<NetSurplusModel[]>([]);
  const [page, setPage] = useState(1);
  const [size, setsize] = useState(1000);
  const [pagination, setPagination] = useState<PaginationResponse>();
  const [selectedAccount, setSelectedAccount] = useState<NetSurplusModel>();
  const nav = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(
    moment().add(1, "days").toDate()
  );
  const [description, setDescription] = useState("");
  const [closingBooks, setClosingBooks] = useState<ClosingBookReport[]>([]);
  const [selectedClosingBook, setSelectedClosingBook] =
    useState<ClosingBookReport>();

  const saveNetSurplus = async () => {
    try {
      if (!selectedClosingBook) {
        toast.error("Please select a closing book");
        return;
      }
      setLoading(true);
      let resp: any = await createNetSurplus({
        date: moment(date).toISOString(),
        start_date: date.toISOString(),
        end_date: endDate.toISOString(),
        description,
        closing_book_id: selectedClosingBook?.id,
      });
      toast.success("NetSurplus created successfully");
      nav(`/cooperative/net-surplus/${resp.data.id}`);
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
      getAllNetSurplus();
      getAllClosingBooks();
    }
  }, [mounted, page, size, search]);

  const getAllNetSurplus = () => {
    setLoading(true);
    getNetSurplus({ page, size, search })
      .then((e: any) => {
        setNetSurplus(e.data.items);
        setPagination(getPagination(e.data));
      })
      .catch((error) => {
        toast.error(`${error}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getAllClosingBooks = () => {
    setLoading(true);
    getClosingBooks({ page: 1, size: 1000 })
      .then((e: any) => {
        setClosingBooks(e.data.items);
      })
      .catch((error) => {
        toast.error(`${error}`);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <AdminLayout isCooperative permission="cooperative:net_surplus:read">
      <div className="p-8 ">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold ">Net Surplus</h1>
          <div className="flex items-center gap-2">
            <Button
              gradientDuoTone="purpleToBlue"
              pill
              onClick={() => {
                setShowModal(true);
              }}
            >
              + Create new Net Surplus
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
              {netSurplus.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={5} className="text-center">
                    No net surplus found.
                  </Table.Cell>
                </Table.Row>
              )}
              {netSurplus.map((item, i) => (
                <Table.Row
                  key={i}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    <Moment format="DD MMM YYYY">{item.start_date}</Moment>
                    {" s/d "}
                    <Moment format="DD MMM YYYY">{item.end_date}</Moment>
                  </Table.Cell>
                  <Table.Cell>{item.description}</Table.Cell>

                  <Table.Cell width={200}>
                    <Link
                      to={`/cooperative/net-surplus/${item.id}`}
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
                            `Are you sure you want to delete project ${item.description}?`
                          )
                        ) {
                          deleteNetSurplus(item?.id!).then(() => {
                            getAllNetSurplus();
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
          aria-labelledby="create-net-surplus-modal"
        >
          <Modal.Header>Create New Net Surplus</Modal.Header>
          <Modal.Body>
            <form>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="net-surplus-title" value="Date" />
                  <Datepicker
                    value={date}
                    onChange={(val) => {
                      setDate(val!);
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="net-surplus-title" value="End Date" />
                  <Datepicker
                    value={endDate}
                    onChange={(val) => {
                      setEndDate(val!);
                    }}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="net-surplus-title"
                    value="Closing Book Report"
                  />
                  <Select
                    value={{
                      label: selectedClosingBook?.notes,
                      value: selectedClosingBook?.id,
                      start_date: selectedClosingBook?.start_date,
                      end_date: selectedClosingBook?.end_date,
                    }}
                    onChange={(val) => {
                      let selected = closingBooks.find(
                        (closingBook) => closingBook.id === val?.value
                      );
                      if (!selected) return;
                      setDate(moment(selected?.start_date!).toDate());
                      setEndDate(moment(selected?.end_date!).toDate());
                      setSelectedClosingBook(selected);
                    }}
                    formatOptionLabel={(option) => (
                      <div className="flex justify-between">
                        <span>{option.label}</span>
                        {option.start_date && option.end_date && (
                          <div>
                            <Moment format="DD/MM/YYYY" className="text-xs">
                              {option.start_date}
                            </Moment>
                            <span className="text-[7pt]"> {" s/d "}</span>
                            <Moment format="DD/MM/YYYY" className="text-xs">
                              {option.end_date}
                            </Moment>
                          </div>
                        )}
                      </div>
                    )}
                    options={closingBooks.map((closingBook) => ({
                      label: closingBook.notes,
                      value: closingBook.id,
                      start_date: closingBook.start_date,
                      end_date: closingBook.end_date,
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="net-surplus-title" value="Description" />
                  <Textarea
                    rows={7}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                    id="net-surplus-description"
                    placeholder="Net Surplus Description"
                    required
                  />
                </div>
              </div>
              <div className="mt-16"></div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <div className="flex justify-end w-full">
              <Button onClick={saveNetSurplus}>Save</Button>
            </div>
          </Modal.Footer>
        </Modal>
      )}
    </AdminLayout>
  );
};
export default NetSurplusPage;
