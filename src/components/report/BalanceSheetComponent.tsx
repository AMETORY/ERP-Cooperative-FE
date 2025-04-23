import type { FC } from "react";
import { BalanceSheetAccount, BalanceSheetModel } from "../../models/report";
import { Table } from "flowbite-react";
import { money } from "../../utils/helper";
import { Link } from "react-router-dom";

interface BalanceSheetComponentProps {
  balanceSheet: BalanceSheetModel;
}

const BalanceSheetComponent: FC<BalanceSheetComponentProps> = ({
  balanceSheet,
}) => {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="bg-white border rounded-lg h-fit overflow-auto">
        <Table className="" hoverable>
          <Table.Body className="divide-y">
            <Table.Row className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                AKTIVA
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
              <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
              <Table.Cell
                className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"
                align="right"
              >
                {money(balanceSheet?.total_assets)}
              </Table.Cell>
            </Table.Row>
            <Table.Row className="">
              <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                AKTIVA TETAP
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
            {(balanceSheet?.fixed_assets ?? [])
              .filter((item) => item.sum !== 0)
              .map((item: BalanceSheetAccount, index: number) => (
                <Table.Row className="" key={index}>
                  <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white pl-[40px]">
                    <Link
                      to={
                        item.link != ""
                          ? item.link
                          : `/account/${item.id}/report`
                      }
                      className="hover:font-semibold"
                    >
                      {item.code && `${item.code} - `}
                      {item.name}
                    </Link>
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>

                  <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                  <Table.Cell
                    className="whitespace-nowrap  text-gray-900 dark:text-white"
                    align="right"
                  >
                    {money(item.sum)}
                  </Table.Cell>
                </Table.Row>
              ))}
            <Table.Row className="">
              <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
              <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
              <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
              <Table.Cell
                className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"
                align="right"
              >
                {money(balanceSheet?.total_fixed)}
              </Table.Cell>
            </Table.Row>
            <Table.Row className="">
              <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                AKTIVA LANCAR
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
            {(balanceSheet?.current_assets ?? [])
              .filter((item) => item.sum !== 0)
              .map((item: BalanceSheetAccount, index: number) => (
                <Table.Row className="" key={index}>
                  <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white pl-[40px]">
                    <Link
                      to={
                        item.link != ""
                          ? item.link
                          : `/account/${item.id}/report`
                      }
                      className="hover:font-semibold"
                    >
                      {item.code && `${item.code} - `}
                      {item.name}
                    </Link>
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>

                  <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                  <Table.Cell
                    className="whitespace-nowrap  text-gray-900 dark:text-white"
                    align="right"
                  >
                    {money(item.sum)}
                  </Table.Cell>
                </Table.Row>
              ))}
            <Table.Row className="">
              <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
              <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
              <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
              <Table.Cell
                className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"
                align="right"
              >
                {money(balanceSheet?.total_current)}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
      <div className="bg-white border rounded-lg h-fit overflow-auto">
        <Table className="" hoverable>
          <Table.Body className="divide-y">
            <Table.Row className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                PASIVA
              </Table.Cell>
              <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
              <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
              <Table.Cell
                className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"
                align="right"
              >
                {money(balanceSheet?.total_liabilities_and_equity)}
              </Table.Cell>
            </Table.Row>
            <Table.Row className="">
              <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                HUTANG
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
            {(balanceSheet?.liable_assets ?? [])
              .filter((item) => item.sum !== 0)
              .map((item: BalanceSheetAccount, index: number) => (
                <Table.Row className="" key={index}>
                  <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white pl-[40px]">
                    <Link
                      to={
                        item.link != ""
                          ? item.link
                          : `/account/${item.id}/report`
                      }
                      className="hover:font-semibold"
                    >
                      {item.code && `${item.code} - `}
                      {item.name}
                    </Link>
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>

                  <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                  <Table.Cell
                    className="whitespace-nowrap  text-gray-900 dark:text-white"
                    align="right"
                  >
                    {money(item.sum)}
                  </Table.Cell>
                </Table.Row>
              ))}
            <Table.Row className="">
              <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
              <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
              <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
              <Table.Cell
                className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"
                align="right"
              >
                {money(balanceSheet?.total_liability)}
              </Table.Cell>
            </Table.Row>
            <Table.Row className="">
              <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
                MODAL
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
            {(balanceSheet?.equity ?? [])
              .filter((item) => item.sum !== 0)
              .map((item: BalanceSheetAccount, index: number) => (
                <Table.Row className="" key={index}>
                  <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white pl-[40px]">
                    <Link
                      to={
                        item.link != ""
                          ? item.link
                          : `/account/${item.id}/report`
                      }
                      className="hover:font-semibold"
                    >
                      {item.code && `${item.code} - `}
                      {item.name}
                    </Link>
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>

                  <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
                  <Table.Cell
                    className="whitespace-nowrap  text-gray-900 dark:text-white"
                    align="right"
                  >
                    {money(item.sum)}
                  </Table.Cell>
                </Table.Row>
              ))}
            <Table.Row className="">
              <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
              <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
              <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"></Table.Cell>
              <Table.Cell
                className="whitespace-nowrap font-semibold text-gray-900 dark:text-white"
                align="right"
              >
                {money(balanceSheet?.total_equity)}
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};
export default BalanceSheetComponent;
