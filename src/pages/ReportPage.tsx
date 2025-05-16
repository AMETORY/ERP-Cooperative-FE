import type { FC } from "react";
import AdminLayout from "../components/layouts/admin";
import { Card } from "flowbite-react";
import { BsGraphUp, BsTable, BsPieChart } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
interface ReportPageProps {}

const ReportPage: FC<ReportPageProps> = ({}) => {
const { t } = useTranslation();

  const reportCards = [
    {
      icon: <img src="/icon/cash-flow.png" width={40} />,
      title: t("cash_flow_statement"),
      description: t("cash_flow_statement_description"),
      link: "/cashflow-statement",
    },
    {
      icon: <img src="/icon/cogs.png" width={40} />,
      title: t("cogs_statement"),
      description: t("cogs_statement_description"),
      link: "/cogs",
    },
    {
      // icon: <BsPieChart size={40} />,
      icon: <img src="/icon/profit-loss.png" width={40} />,
      title: t("profit_loss_statement"),
      description: t("profit_loss_statement_description"),
      link: "/profit-loss-statement",
    },
    {
      icon: <img src="/icon/budget-balance.png" width={40} />,
      title: t("balance_sheet"),
      description: t("balance_sheet_description"),
      link: "/balance-sheet",
    },
    {
      icon: <img src="/icon/investment.png" width={40} />,
      title: t("capital_change_statement"),
      description: t("capital_change_statement_description"),
      link: "/capital-change-statement",
    },
    {
      icon: <img src="/icon/trial.png" width={40} />,
      title: t("trial_balance"),
      description: t("trial_balance_description"),
      link: "/trial-balance",
    },
    {
      icon: <img src="/icon/closed-book.png" width={40} />,
      title: t("closing_the_book"),
      description: t("closing_the_book_description"),
      link: "/closing-the-book",
    },
    {
      icon: <img src="/icon/journal.png" width={40} />,
      title: t("general_journal"),
      description: t("general_journal_description"),
      link: "/general-journal",
    },
    // {
    //   icon: <img src="/icon/ledger.png" width={40} />,
    //   title: t("general_ledger"),
    //   description: t("general_ledger_description"),
    //   link: "/general-ledger",
    // },
    {
      icon: <img src="/icon/product_per_customer.png" width={40} />,
      title: t("product_per_customer"),
      description: t("product_per_customer_desc"),
      link: "/product-per-customer",
    },

  ];
  return (
    <AdminLayout>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 h-[calc(100vh-80px)] overflow-y-auto">
        {reportCards.map((card, index) => (
          <Link to={card.link} key={index}>
            <Card className=" p-4 hover:bg-gray-100 transition duration-300 justify-center min-h-[280px]">
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
