import * as fs from "fs";
import * as path from "path";
import { Client } from "pg";
import { APP_CONFIG } from "../utils/appConfig";
import { formatQueries } from "../utils/queryFormatter";

const scriptsFolder = path.join(__dirname, "scripts");

export const createDatabase = async () => {
  const client = new Client({
    host: APP_CONFIG.POSTGRES_HOST,
    user: APP_CONFIG.POSTGRES_USER,
    password: APP_CONFIG.POSTGRES_PASSWORD,
    port: parseInt(APP_CONFIG.POSTGRES_PORT),
  });

  await client.connect();
  console.log(`Connected to Postgres at port ${APP_CONFIG.POSTGRES_PORT}.`);
  const dbInitScript = fs
    .readFileSync(path.join(scriptsFolder, "0_create_db.sql"))
    .toString();
  const queries = formatQueries(dbInitScript);
  console.log("=== SETTING UP THE DATABASE ===");
  for (const command of queries) {
    await client.query(command);
  }
  client.end();
  console.log("=== SETTING UP THE DATABASE DONE ===");
};

export const loadSqls = async () => {
  const client = new Client({
    host: APP_CONFIG.POSTGRES_HOST,
    database: APP_CONFIG.POSTGRES_DB,
    user: APP_CONFIG.POSTGRES_USER,
    password: APP_CONFIG.POSTGRES_PASSWORD,
    port: parseInt(APP_CONFIG.POSTGRES_PORT),
  });

  await client.connect();
  console.log(`Connected to ${APP_CONFIG.POSTGRES_DB} database.`);

  const scripts = fs.readdirSync(scriptsFolder);
  scripts.shift();
  console.log("=== SETTING UP THE TABLES ===");
  for (const scriptName of scripts) {
    console.log(`=== PROCESSING ${scriptName} ===`);
    const script = fs
      .readFileSync(path.join(scriptsFolder, scriptName))
      .toString();
    const queries = formatQueries(script);
    for (const command of queries) {
      console.log(command);
      await client.query(command);
    }
  }
  client.end();
  console.log("=== SETTING UP THE TABLES DONE ===");
};
