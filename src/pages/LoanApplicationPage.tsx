import { useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { Button, Table } from "flowbite-react";
import { LuFilter } from "react-icons/lu";

interface LoanApplicationPageProps {}

const LoanApplicationPage: FC<LoanApplicationPageProps> = ({}) => {
  const [showModal, setShowModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  return (
    <AdminLayout isCooperative>
      <div className="p-8 ">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold ">Loan Application</h1>
          <div className="flex items-center gap-2">
            <Button
              gradientDuoTone="purpleToBlue"
              pill
              onClick={() => {
                setShowModal(true);
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
              <Table.HeadCell>Loan Number</Table.HeadCell>
              <Table.HeadCell>Member</Table.HeadCell>
              <Table.HeadCell>Amount</Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.Head>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};
export default LoanApplicationPage;
