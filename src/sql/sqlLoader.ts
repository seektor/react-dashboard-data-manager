import * as fs from "fs";
import * as path from "path";
import { APP_CONFIG } from "../utils/appConfig";
import {
  createDbClient,
  createPostgresClient,
} from "../utils/dbClientCreators";
import { formatQueries } from "../utils/queryFormatter";

const SCRIPTS_FOLDER = path.join(__dirname, "scripts");

export const createDatabase = async () => {
  const client = createPostgresClient();

  await client.connect();
  console.log(`Connected to Postgres at port ${APP_CONFIG.POSTGRES_PORT}.`);
  const dbInitScript = fs
    .readFileSync(path.join(SCRIPTS_FOLDER, "0_create_db.sql"))
    .toString();
  const queries = formatQueries(dbInitScript);
  console.log("=== SETTING UP THE DATABASE ===");
  for (const command of queries) {
    await client.query(command);
  }
  client.end();
  console.log("=== DATABASE SET UP ===");
};

export const loadSqls = async () => {
  const client = createDbClient();

  await client.connect();
  console.log(`Connected to ${APP_CONFIG.POSTGRES_DB} database.`);

  const scripts = fs.readdirSync(SCRIPTS_FOLDER);
  scripts.shift();
  console.log("=== SETTING UP THE TABLES ===");
  for (const scriptName of scripts) {
    console.log(`=== PROCESSING ${scriptName} ===`);
    const script = fs
      .readFileSync(path.join(SCRIPTS_FOLDER, scriptName))
      .toString();
    const queries = formatQueries(script);
    for (const command of queries) {
      console.log(command);
      await client.query(command);
    }
  }
  client.end();
  console.log("=== TABLES SET UP ===");
};
