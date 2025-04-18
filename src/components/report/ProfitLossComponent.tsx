import { Table } from "flowbite-react";
import type { FC } from "react";
import { ProfitLossAccount, ProfitLossModel } from "../../models/report";
import { Link } from "react-router-dom";
import { money } from "../../utils/helper";

interface ProfitLossComponentProps {
  profitLoss: ProfitLossModel;
}

const ProfitLossComponent: FC<ProfitLossComponentProps> = ({ profitLoss }) => {
  return (
    <div className="overflow-x-auto">
      <Table className="">
        <Table.Body className="divide-y">
          <Table.Row className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
              PENDAPATAN
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
              Laba Kotor
            </Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell align="right" className="font-semibold">
              {money(profitLoss?.gross_profit)}
            </Table.Cell>
          </Table.Row>

          <Table.Row className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
              PENGELUARAN
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
              Total Pengeluaran
            </Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell></Table.Cell>
            <Table.Cell align="right" className="font-semibold">
              {money(profitLoss?.total_expense)}
            </Table.Cell>
          </Table.Row>

          <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
            <Table.Cell className="whitespace-nowrap font-semibold text-gray-900 dark:text-white">
              LABA RUGI
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
                Sisa Hasil Usaha Sudah Dibagi
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
                Total Pajak
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
                Laba Bersih
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
