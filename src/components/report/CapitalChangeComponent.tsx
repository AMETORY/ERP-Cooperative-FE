import type { FC } from "react";
import { CapitalChangeModel } from "../../models/report";
import { Table } from "flowbite-react";
import { money } from "../../utils/helper";
import { Link } from "react-router-dom";

interface CapitalChangeComponentProps {
  capitalChange: CapitalChangeModel;
}

const CapitalChangeComponent: FC<CapitalChangeComponentProps> = ({
  capitalChange,
}) => {
  return (
    <div className="overflow-auto">
      <Table className="">
        <Table.Body className="divide-y">
          <Table.Row className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
              Description
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
            <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
            <Table.Cell
              className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"
              align="right"
            >
              Amount
            </Table.Cell>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
              Modal Awal
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
                Laba Rugi
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
              Prive / Dividen
            </Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell align="right">
              {money(capitalChange?.prived_balance)}
            </Table.Cell>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
              Penambahan Modal
            </Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell align="right">
              {money(capitalChange?.capital_change_balance)}
            </Table.Cell>
          </Table.Row>
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
              Modal Akhir
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
