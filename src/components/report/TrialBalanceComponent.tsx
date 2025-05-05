import type { FC } from "react";
import { TrialBalanceReportModel } from "../../models/trial_balance";
import { Table } from "flowbite-react";
import { money } from "../../utils/helper";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface TrialBalanceComponentProps {
  trialBalance: TrialBalanceReportModel;
}

const TrialBalanceComponent: FC<TrialBalanceComponentProps> = ({
  trialBalance,
}) => {
  const { t } = useTranslation();
  return (
    <div className="overflow-x-auto">
    <Table className=""  >
      <Table.Body className="divide-y">
        <Table.Row className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
          <Table.Cell></Table.Cell>
          <Table.Cell colSpan={2} className="font-semibold text-center border-l border-r" rowSpan={2} width={200}>
            {t('opening_balance')}
          </Table.Cell>
          <Table.Cell colSpan={2} className="font-semibold text-center">
            {t('movement')}
          </Table.Cell>
          <Table.Cell colSpan={2} className="font-semibold text-center border-l" rowSpan={2} width={200}>
            {t('closing_balance')}
          </Table.Cell>
        </Table.Row>
        <Table.Row className="bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
          <Table.Cell className="font-semibold text-center"></Table.Cell>
          <Table.Cell className="font-semibold text-center">{t('debit')}</Table.Cell>
          <Table.Cell className="font-semibold text-center">{t('credit')}</Table.Cell>
        </Table.Row>
        {trialBalance?.trial_balance.map((item, index) => (
          <Table.Row key={index}>
            <Table.Cell className="font-semibold">
              <Link to={`/account/${item.id}/report`}>
              {item.code && `(${item.code})`} - {item.name}
              </Link>
            </Table.Cell>
            <Table.Cell className="text-right" colSpan={2}>
              {item.balance > 0 ? money(item.balance) : "-"}
            </Table.Cell>
            <Table.Cell className="text-right">
              {trialBalance?.adjustment[index].debit > 0
                ? money(trialBalance?.adjustment[index].debit, 0)
                : "-"}
            </Table.Cell>
            <Table.Cell className="text-right">
              {trialBalance?.adjustment[index].credit > 0
                ? money(trialBalance?.adjustment[index].credit, 0)
                : "-"}
            </Table.Cell>
            <Table.Cell className="text-right" colSpan={2} >
              {trialBalance?.balance_sheet[index].balance > 0
                ? money(trialBalance?.balance_sheet[index].balance, 0)
                : "-"}
            </Table.Cell>
          </Table.Row>
        ))}
        <Table.Row>
          <Table.Cell className="font-semibold text-right">{t('total')}</Table.Cell>
          <Table.Cell className="text-right font-semibold" colSpan={2}>
            {money(
              trialBalance?.trial_balance.reduce(
                (acc, item) => acc + item.balance,
                0
              )
            )}
          </Table.Cell>
         
          <Table.Cell className="text-right font-semibold">
            {money(
              trialBalance?.adjustment.reduce(
                (acc, item) => acc + item.debit,
                0
              )
            )}
          </Table.Cell>
          <Table.Cell className="text-right font-semibold">
            {money(
              trialBalance?.adjustment.reduce(
                (acc, item) => acc + item.credit,
                0
              )
            )}
          </Table.Cell>
          <Table.Cell className="text-right font-semibold" colSpan={2}>
            {money(
              trialBalance?.balance_sheet.reduce(
                (acc, item) => acc + item.balance,
                0
              )
            )}
          </Table.Cell>
        
        </Table.Row>
      </Table.Body>
    </Table>
    </div>
  );
};
export default TrialBalanceComponent;
