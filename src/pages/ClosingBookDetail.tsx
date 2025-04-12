import { useContext, useEffect, useState, type FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { useNavigate, useParams } from "react-router-dom";
import { LoadingContext } from "../contexts/LoadingContext";
import { getClosingBookDetail } from "../services/api/reportApi";
import { Tabs } from "flowbite-react";
import { ClosingBookReport } from "../models/report";

interface ClosingBookDetailProps {}

const ClosingBookDetail: FC<ClosingBookDetailProps> = ({}) => {
  const { closingBookId } = useParams();
  const { loading, setLoading } = useContext(LoadingContext);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [closingBook, setClosingBook] = useState<ClosingBookReport>();

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (mounted && closingBookId) {
      setLoading(true);
      getClosingBookDetail(closingBookId)
        .then((res: any) => {
          setClosingBook(res.data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [mounted, closingBookId]);

  return (
    <AdminLayout>
      <div className="p-8 h-[calc(100vh-80px)] bg-red-50 overflow-y-auto">
        <h1 className="text-3xl font-bold">{closingBook?.notes}</h1>
        <Tabs
          aria-label="Default tabs"
          variant="default"
          onActiveTabChange={(tab) => {
            setActiveTab(tab);
            // console.log(tab);
          }}
          className="mt-4"
        >
          <Tabs.Item title="Tab 1">Tab 1 content</Tabs.Item>
          <Tabs.Item title="Tab 1">Tab 1 content</Tabs.Item>
          <Tabs.Item title="Tab 1">Tab 1 content</Tabs.Item>
          <Tabs.Item title="Tab 1">Tab 1 content</Tabs.Item>
        </Tabs>
      </div>
    </AdminLayout>
  );
};
export default ClosingBookDetail;
