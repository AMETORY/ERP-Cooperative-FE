import { useContext, useEffect, useRef, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { useParams } from "react-router-dom";
import { LoadingContext } from "../contexts/LoadingContext";
import { LoanApplicationModel } from "../models/loan_application";
import { getLoanDetail } from "../services/api/cooperativeLoanApi";

interface LoanApplicationDetailProps {}

const LoanApplicationDetail: FC<LoanApplicationDetailProps> = ({}) => {
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

  useEffect(() => {
    if (mounted && loanId) {
      getLoanDetail(loanId!).then((resp: any) => {
        setLoan(resp.data);
      });
      // getSourceAccounts("");
      // getDestinationAccounts("");
    }
  }, [mounted, loanId]);
  return (
    <AdminLayout isCooperative permission="cooperative:loan_application:read">
      <h1>Loan Application Detail</h1>
    </AdminLayout>
  );
};
export default LoanApplicationDetail;
