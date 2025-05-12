// components/TableGenerator.tsx
import React, { useState } from "react";
import { Table } from "../models/table";
import { Button } from "flowbite-react";
import { generateUUID } from "../utils/helper";
import { useTranslation } from "react-i18next";

interface TableGeneratorProps {
  onTablesGenerated: (tables: Table[]) => void;
}

export const TableGenerator: React.FC<TableGeneratorProps> = ({
  onTablesGenerated,
}) => {
  const { t } = useTranslation();
  const [startNumber, setStartNumber] = useState<number>(1);
  const [endNumber, setEndNumber] = useState<number>(10);
  const [capacity, setCapacity] = useState<number>(4);
  const [prefix, setPrefix] = useState("#tbl-");
  const [formatNumber, setFormatNumber] = useState(3);

  const generateTables = () => {
    const tables: Table[] = [];

    for (let i = startNumber; i <= endNumber; i++) {
      tables.push({
        id: generateUUID(),
        number: `${prefix}${i.toString().padStart(formatNumber, "0")}`,
        status: "available",
        capacity: capacity,
      });
    }

    onTablesGenerated(tables);
  };

  return (
    <div className="table-generator  h-[calc(100vh-320px)]  overflow-y-auto">
      <h3>{t("generate_table_automatically")}</h3>

      <div className="form-group">
        <label>Prefix</label>
        <input
          className="rs-input"
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>{t("format_number")}</label>
        <input
          className="rs-input"
          type="number"
          value={formatNumber}
          onChange={(e) => setFormatNumber(parseInt(e.target.value) || 3)}
        />
      </div>
      <div className="form-group">
        <label>{t("from")}</label>
        <input
          className="rs-input"
          type="number"
          min="1"
          max="100"
          value={startNumber}
          onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
        />
      </div>

      <div className="form-group">
        <label>{t("from")}</label>
        <input
          className="rs-input"
          type="number"
          min="1"
          max="100"
          value={endNumber}
          onChange={(e) => setEndNumber(parseInt(e.target.value) || 10)}
        />
      </div>

      <div className="form-group">
        <label>{t("capacity")}</label>
        <input
          className="rs-input"
          type="number"
          min="1"
          max="20"
          value={capacity}
          onChange={(e) => setCapacity(parseInt(e.target.value) || 4)}
        />
      </div>

      <Button onClick={generateTables} className="generate-button mt-4">
        {t("generate_table_msg", {
          from: prefix + startNumber.toString().padStart(formatNumber, "0"),
          to: prefix + endNumber.toString().padStart(formatNumber, "0"),
        })}
      </Button>

      {startNumber > endNumber && (
        <p className="error-message">{t("alert_table_number")}</p>
      )}
    </div>
  );
};
