import { Table } from "flowbite-react";
import type { FC } from "react";
import { ProfitLossAccount, ProfitLossModel } from "../../models/report";
import { Link } from "react-router-dom";
import { money } from "../../utils/helper";
import { useTranslation } from "react-i18next";

interface ProfitLossComponentProps {
  profitLoss: ProfitLossModel;
}

const ProfitLossComponent: FC<ProfitLossComponentProps> = ({ profitLoss }) => {
        const { t } = useTranslation();
  
  return (
    <div className="overflow-x-auto">
      <Table className="">
        <Table.Body className="divide-y">
          <Table.Row className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
              {t('revenue')}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
            <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
            <Table.Cell
              className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"
              align="right"
            >
              {t('total')}
            </Table.Cell>
          </Table.Row>
          {(profitLoss?.profit ?? [])
            .filter((item) => item.sum !== 0)
            .map((item: ProfitLossAccount, index: number) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                key={index}
              >
                <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
                  <Link
                    to={
                      item.link != ""
                        ? item.link
                        : `/account/${item.id}/report`
                    }
                    className="hover:font-semibold"
                  >
                    {item.name}
                  </Link>
                </Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell align="right">{money(item.sum)}</Table.Cell>
              </Table.Row>
            ))}
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
              {t('gross_profit')}
            </Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell align="right" className="font-semibold">
              {money(profitLoss?.gross_profit)}
            </Table.Cell>
          </Table.Row>

          <Table.Row className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
              {t('expenses')}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
            <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
            <Table.Cell
              className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"
              align="right"
            >
              {t('total')}
            </Table.Cell>
          </Table.Row>
          {(profitLoss?.loss ?? [])
            .filter((item) => item.sum !== 0)
            .map((item: ProfitLossAccount, index: number) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                key={index}
              >
                <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
                  <Link
                    to={
                      item.link != ""
                        ? item.link
                        : `/account/${item.id}/report`
                    }
                    className="hover:font-semibold"
                  >
                    {item.name}
                  </Link>
                </Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell align="right">{money(item.sum)}</Table.Cell>
              </Table.Row>
            ))}
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
              {t('total_expenses')}
            </Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell align="right" className="font-semibold">
              {money(profitLoss?.total_expense)}
            </Table.Cell>
          </Table.Row>

          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
              {t('net_profit')}
            </Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell align="right" className="font-semibold">
              {money(profitLoss?.net_profit)}
            </Table.Cell>
          </Table.Row>
          {(profitLoss?.total_net_surplus ?? 0) != 0 && (
            <Table.Row className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                {t('shared_surplus')}
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
              <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
              <Table.Cell
                className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"
                align="right"
              >
                {t('total')}
              </Table.Cell>
            </Table.Row>
          )}
          {(profitLoss?.net_surplus ?? [])
            .filter((item) => item.sum !== 0)
            .map((item: ProfitLossAccount, index: number) => (
              <Table.Row
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
                key={index}
              >
                <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
                  <Link
                    to={
                      item.link != ""
                        ? item.link
                        : `/account/${item.id}/profitLoss`
                    }
                    className="hover:font-semibold"
                  >
                    {item.name}
                  </Link>
                </Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell align="right">{money(item.sum)}</Table.Cell>
              </Table.Row>
            ))}
          {profitLoss.income_tax > 0 && (
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                {t('total_tax')}
              </Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell align="right" className="font-semibold">
                {money(profitLoss?.income_tax)}
              </Table.Cell>
            </Table.Row>
          )}
          {profitLoss.income_tax > 0 && (
            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                {t('net_profit_after_tax')}
              </Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell align="right" className="font-semibold">
                {money(profitLoss?.net_profit_after_tax)}
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </div>
  );
};
export default ProfitLossComponent;
