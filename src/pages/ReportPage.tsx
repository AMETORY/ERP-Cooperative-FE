import type { FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { Card } from "flowbite-react";
import { BsGraphUp, BsTable, BsPieChart } from "react-icons/bs";
import { Link } from "react-router-dom";
interface ReportPageProps {}

const ReportPage: FC<ReportPageProps> = ({}) => {
  const reportCards = [
    {
      icon: <BsGraphUp size={40} />,
      title: "Cashflow Statement",
      description: "View detailed cash inflows and outflows.",
      link: "/cashflow-statement",
    },
    {
      icon: <img src="/icon/cogs.png" width={40} />,
      title: "Cost of Goods Sold (COGS)",
      description: "Analyze your direct costs.",
      link: "/cogs",
    },
    {
      icon: <BsPieChart size={40} />,
      title: "Profit and Loss Statement",
      description: "Check the profit and loss trends over time.",
      link: "/profit-loss-statement",
    },
    {
      icon: <BsTable size={40} />,
      title: "Balance Sheet",
      description: "View detailed assets, liabilities, and equity.",
      link: "/balance-sheet",
    },
  ];
  return (
    <AdminLayout>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {reportCards.map((card, index) => (
          <Link to={card.link} key={index}>
            <Card className=" p-4 hover:bg-gray-100 transition duration-300 justify-center">
                <div className="flex flex-col items-center text-center space-y-4">

              <div className="mb-2">{card.icon}</div>
              <h3 className="text-lg font-semibold">{card.title}</h3>
              <p className="text-sm text-gray-500">{card.description}</p>
                </div>
            </Card>
          </Link>
        ))}
      </div>
    </AdminLayout>
  );
};
export default ReportPage;
