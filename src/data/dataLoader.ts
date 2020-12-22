import csvParser from "csv-parser";
import * as fs from "fs";
import * as path from "path";
import { Client } from "pg";
import { createDbClient } from "../utils/dbClientCreators";

const FILE_PATH = path.join(__dirname, "10000 Sales Records.csv");

const REGIONS_SET = new Set();
const COUNTRIES_SET = new Set();

const REGION_TO_ID_MAP = new Map();
const COUNTRY_TO_ID_MAP = new Map();

interface SalesRow {
  Region: string;
  Country: string;
  "Item Type": string;
  "Sales Channel": string;
  "Order Priority": string;
  "Order Date": string;
  "Order ID": string;
  "Ship Date": string;
  "Units Sold": string;
  "Unit Price": string;
  "Unit Cost": string;
  "Total Revenue": string;
  "Total Cost": string;
  "Total Profit": string;
}

export const loadData = async () => {
  await extractDictionaries();
  await updateDictionaryTables();
  await updateSalesData();
};

const extractDictionaries = async () => {
  const readStream = fs
    .createReadStream(FILE_PATH)
    .pipe(csvParser({ separator: "," }));

  console.log("=== EXTRACTING DICTIONARIES ===");

  for await (const untypedRow of readStream) {
    const row: SalesRow = untypedRow;
    REGIONS_SET.add(row.Region);
    COUNTRIES_SET.add(row.Country);
  }

  console.log("=== DICTIONARIES EXTRACTED ===");
  readStream.end();
};

const updateDictionaryTables = async () => {
  const client = createDbClient();
  await client.connect();

  console.log("=== UPDATING DICTIONARY TABLES ===");
  for (const region of REGIONS_SET.values()) {
    const row = await client.query<{ id: string }>(
      "INSERT INTO regions(region) VALUES($1) RETURNING id",
      [region]
    );
    const id = row.rows[0].id;
    REGION_TO_ID_MAP.set(region, id);
  }

  for (const country of COUNTRIES_SET.values()) {
    const row = await client.query<{ id: string }>(
      "INSERT INTO countries(country) VALUES($1) RETURNING id",
      [country]
    );
    const id = row.rows[0].id;
    COUNTRY_TO_ID_MAP.set(country, id);
  }

  console.log("=== DICTIONARY TABLES UPDATED ===");

  client.end();
};

const createValuesStringQuery = (buffer: string[][], toIndex: number) => {
  return buffer
    .slice(0, toIndex)
    .map((row) => `(${row.map((val) => `'${val}'`).join(",")})`)
    .join(",");
};

const updateSalesFromBuffer = async (
  client: Client,
  buffer: string[][],
  toIndex: number
) => {
  if (toIndex === 0) {
    return;
  }
  const values = createValuesStringQuery(buffer, toIndex);
  await client.query(
    `INSERT INTO sales(id, region_id, country_id, item_type, sales_channel, order_priority, order_date, ship_date, units_sold, unit_price, unit_cost, total_revenue, total_cost, total_profit) VALUES${values}`
  );
};

const updateSalesData = async () => {
  const client = createDbClient();
  await client.connect();

  const readStream = fs
    .createReadStream(FILE_PATH)
    .pipe(csvParser({ separator: "," }));

  console.log("=== UPDATING SALES DATA ===");

  const bufferLimit = 2000;
  let buffer = new Array(bufferLimit);
  let bufferIndex = 0;

  for await (const untypedRow of readStream) {
    const row: SalesRow = untypedRow;
    const data: string[] = [
      row["Order ID"],
      REGION_TO_ID_MAP.get(row.Region),
      COUNTRY_TO_ID_MAP.get(row.Country),
      row["Item Type"],
      row["Sales Channel"],
      row["Order Priority"],
      row["Order Date"],
      row["Ship Date"],
      row["Units Sold"],
      row["Unit Price"],
      row["Unit Cost"],
      row["Total Revenue"],
      row["Total Cost"],
      row["Total Profit"],
    ];

    buffer[bufferIndex] = data;
    bufferIndex++;

    if (bufferIndex === bufferLimit) {
      await updateSalesFromBuffer(client, buffer, bufferIndex);
      buffer = new Array(bufferLimit);
      bufferIndex = 0;
    }
  }
  await updateSalesFromBuffer(client, buffer, bufferIndex);

  console.log("=== SALES DATA UPDATED ===");
  readStream.end();
  client.end();
};
