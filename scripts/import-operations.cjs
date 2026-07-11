const fs = require("node:fs");
const path = require("node:path");
const XLSX = require("xlsx");

const source = process.argv[2];
if (!source)
  throw new Error("Usage: node scripts/import-operations.cjs <report.xlsx>");

const workbook = XLSX.readFile(source, { cellDates: true });
const rows = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
  defval: null,
  raw: false,
});
const parseAmount = (value) =>
  Number(String(value).replaceAll(",", "").replace(/\s/g, ""));

const operations = rows
  .filter((row) => row["Статус"] === "OK" && row["Валюта платежа"] === "RUB")
  .map((row, index) => {
    const signedAmount = parseAmount(row["Сумма платежа"]);
    return {
      id: `bank-${String(row["Дата операции"]).replace(/\D/g, "")}-${index}`,
      title: row["Описание"] || row["Категория"] || "Банковская операция",
      amount: Math.abs(signedAmount),
      type: signedAmount >= 0 ? "income" : "expense",
      category: row["Категория"] || "Без категории",
      date: row["Дата платежа"] || row["Дата операции"],
      accountId: "acc-main-card",
      note: [row["Номер карты"], row["MCC"] ? `MCC ${row["MCC"]}` : null]
        .filter(Boolean)
        .join(" · "),
    };
  })
  .filter((row) => Number.isFinite(row.amount) && row.amount > 0);

const output = `import type { Transaction } from "../types/domain";\n\nexport const importedOperations: Transaction[] = ${JSON.stringify(operations, null, 2)};\n`;
const destination = path.resolve(
  __dirname,
  "../src/data/importedOperations.ts",
);
fs.writeFileSync(destination, output, "utf8");
console.log(`Imported ${operations.length} operations into ${destination}`);
