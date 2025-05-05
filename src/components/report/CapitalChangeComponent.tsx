import type { FC } from "react";
import { CapitalChangeModel } from "../../models/report";
import { Table } from "flowbite-react";
import { money } from "../../utils/helper";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface CapitalChangeComponentProps {
  capitalChange: CapitalChangeModel;
}

const CapitalChangeComponent: FC<CapitalChangeComponentProps> = ({
  capitalChange,
}) => {
    const { t } = useTranslation();
  
  return (
    <div className="overflow-auto">
      <Table className="">
        <Table.Body className="divide-y">
          <Table.Row className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
              {t('description')}
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
            <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
            <Table.Cell
              className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"
              align="right"
            >
              {t('amount')}
            </Table.Cell>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
              {t('initial_capital')}
            </Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell align="right">
              {money(capitalChange?.opening_balance)}
            </Table.Cell>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
              <Link
                to={"/profit-loss-statement"}
                className="hover:font-semibold"
              >
                {t('profit_loss')}
              </Link>
            </Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell align="right">
              {money(capitalChange?.profit_loss)}
            </Table.Cell>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
              {t('prive')}
            </Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell align="right">
              {money(capitalChange?.prived_balance)}
            </Table.Cell>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
              {t('capital_change')}
            </Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell align="right">
              {money(capitalChange?.capital_change_balance)}
            </Table.Cell>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
              {t('ending_capital')}
            </Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell align="right">
              {money(capitalChange?.ending_balance)}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
};
export default CapitalChangeComponent;
