import { Client } from "pg";
import { createDatabase, loadSqls } from "./sql/sqlLoader";
import { APP_CONFIG } from "./utils/appConfig";

const client = new Client({
  host: APP_CONFIG.POSTGRES_HOST,
  user: APP_CONFIG.POSTGRES_USER,
  password: APP_CONFIG.POSTGRES_PASSWORD,
  port: parseInt(APP_CONFIG.POSTGRES_PORT),
});

const main = async () => {
  try {
    await createDatabase();
    await loadSqls();
    process.exit();
  } catch (e) {
    console.log(e);
    process.exit();
  }
};

main();
