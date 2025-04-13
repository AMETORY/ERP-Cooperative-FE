import type { FC } from "react";
import { CashFlowReport, CashflowSubGroup } from "../../models/report";
import { Table } from "flowbite-react";
import { money } from "../../utils/helper";

interface CashFlowComponentProps {
  cashFlow: CashFlowReport;
}

const CashFlowComponent: FC<CashFlowComponentProps> = ({ cashFlow }) => {
  return (
    <div className="overflow-auto">
      <Table className="" hoverable>
        <Table.Body className="divide-y">
          <Table.Row className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
              OPERASIONAL
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
            <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
            <Table.Cell
              className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"
              align="right"
            >
              Jumlah
            </Table.Cell>
          </Table.Row>
          {cashFlow?.operating.map((item: CashflowSubGroup, index: number) => (
            <Table.Row
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
              key={index}
            >
              <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
                {item.description}
              </Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell align="right">{money(item.amount)}</Table.Cell>
            </Table.Row>
          ))}
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white"></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell align="right" className="font-semibold">
              {money(cashFlow?.total_operating)}
            </Table.Cell>
          </Table.Row>
          <Table.Row className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
              INVESTASI
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
            <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
            <Table.Cell
              className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"
              align="right"
            >
              Jumlah
            </Table.Cell>
          </Table.Row>

          {cashFlow?.investing.map((item: CashflowSubGroup, index: number) => (
            <Table.Row
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
              key={index}
            >
              <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
                {item.description}
              </Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell align="right">{money(item.amount)}</Table.Cell>
            </Table.Row>
          ))}
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white"></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell align="right" className="font-semibold">
              {money(cashFlow?.total_investing)}
            </Table.Cell>
          </Table.Row>
          <Table.Row className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
              PENDANAAN
            </Table.Cell>
            <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
            <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
            <Table.Cell
              className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"
              align="right"
            >
              Jumlah
            </Table.Cell>
          </Table.Row>
          {cashFlow?.financing.map((item: CashflowSubGroup, index: number) => (
            <Table.Row
              className="bg-white dark:border-gray-700 dark:bg-gray-800"
              key={index}
            >
              <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
                {item.description}
              </Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell align="right">{money(item.amount)}</Table.Cell>
            </Table.Row>
          ))}
          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white"></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell align="right" className="font-semibold">
              {money(cashFlow?.total_financing)}
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </div>
  );
};
export default CashFlowComponent;
