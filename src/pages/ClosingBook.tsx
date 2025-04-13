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
import { LoadingContext } from "../contexts/LoadingContext";
import toast from "react-hot-toast";
import {
  createClosingBook,
  deleteClosingBook,
  getClosingBooks,
} from "../services/api/reportApi";
import { useNavigate } from "react-router-dom";
import { ClosingBookReport } from "../models/report";
import { PaginationResponse } from "../objects/pagination";
import { SearchContext } from "../contexts/SearchContext";
import Moment from "react-moment";

interface ClosingBookProps {}

const ClosingBook: FC<ClosingBookProps> = ({}) => {
  const { setLoading } = useContext(LoadingContext);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [show, setShow] = useState<boolean>(false);
  const [notes, setNotes] = useState("");
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(1);
  const [size, setsize] = useState(1000);
  const [pagination, setPagination] = useState<PaginationResponse>();
  const [closingBooks, setClosingBooks] = useState<ClosingBookReport[]>([]);
  const { search, setSearch } = useContext(SearchContext);
  const nav = useNavigate();

  useEffect(() => {
    setMounted(true);

    return () => {};
  }, []);

  useEffect(() => {
    if (mounted) {
      getDetail();
    }
  }, [mounted, page, size, search]);

  const getDetail = async () => {
    try {
      const resp: any = await getClosingBooks({ page, size, search });
      setClosingBooks(resp.data.items);
    } catch (error) {
      console.log(error);
    }
  };

  function getAllAccounts() {
    throw new Error("Function not implemented.");
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold ">Closing The Book</h1>
          <div className="flex items-center gap-2">
            <Button
              gradientDuoTone="purpleToBlue"
              pill
              onClick={() => {
                setShow(true);
              }}
            >
              + Closing
            </Button>
            {/* <LuFilter
              className=" cursor-pointer text-gray-400 hover:text-gray-600"
              onClick={() => {}}
            /> */}
          </div>
        </div>
        <div className="h-[calc(100vh-300px)] overflow-y-auto">
          <Table hoverable className=" ">
            <Table.Head>
              <Table.HeadCell>Periode</Table.HeadCell>
              <Table.HeadCell>Notes</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {closingBooks.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={5} className="text-center">
                    No data found.
                  </Table.Cell>
                </Table.Row>
              )}
              {closingBooks.map((item, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <Moment format="DD MMM YYYY">{item.start_date}</Moment>{" "}
                    {" s/d "}
                    <Moment format="DD MMM YYYY">{item.end_date}</Moment>
                  </Table.Cell>
                  <Table.Cell>{item.notes}</Table.Cell>
                  <Table.Cell>{item.status}</Table.Cell>
                  <Table.Cell>
                    <a
                      className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer"
                      onClick={() => {
                        nav(`/closing-the-book/${item.id}`);
                      }}
                    >
                      View
                    </a>
                    <a
                      href="#"
                      className="font-medium text-red-600 hover:underline dark:text-red-500 ms-2"
                      onClick={(e) => {
                        e.preventDefault();
                        if (
                          window.confirm(
                            `Are you sure you want to delete ${item.notes}?`
                          )
                        ) {
                          deleteClosingBook(item?.id!).then(() => {
getDetail();
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
      <Modal
        show={show}
        onClose={() => {
          setShow(false);
        }}
      >
        <Modal.Header>Create Closing</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <div>
              <Label value="Start Date" />
              <Datepicker
                type="datepicker"
                placeholder="2022-01-01"
                required={true}
                value={startDate}
                onChange={(date) => setStartDate(date!)}
              />
            </div>
            <div>
              <Label value="End Date" />
              <Datepicker
                type="datepicker"
                placeholder="2022-01-01"
                required={true}
                value={endDate}
                onChange={(date) => setEndDate(date!)}
              />
            </div>
            <div>
              <Label value="Notes" />
              <Textarea
                placeholder="Write your notes here"
                required={true}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <div className="h-32"></div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="w-full flex justify-end">
            <Button
              color="success"
              onClick={async () => {
                try {
                  setLoading(true);
                  if (!notes) {
                    throw new Error("Notes is required");
                  }
                  let resp: any = await createClosingBook({
                    start_date: startDate!,
                    end_date: endDate!,
                    notes,
                  });
                  nav(`/closing-the-book/${resp.data.id}`);
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
export default ClosingBook;
