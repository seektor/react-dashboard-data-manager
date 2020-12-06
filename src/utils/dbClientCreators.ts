import { Client } from "pg";
import { APP_CONFIG } from "./appConfig";

export const createPostgresClient = () =>
  new Client({
    host: APP_CONFIG.POSTGRES_HOST,
    user: APP_CONFIG.POSTGRES_USER,
    password: APP_CONFIG.POSTGRES_PASSWORD,
    port: parseInt(APP_CONFIG.POSTGRES_PORT),
  });

export const createDbClient = () =>
  new Client({
    host: APP_CONFIG.POSTGRES_HOST,
    database: APP_CONFIG.POSTGRES_DB,
    user: APP_CONFIG.POSTGRES_USER,
    password: APP_CONFIG.POSTGRES_PASSWORD,
    port: parseInt(APP_CONFIG.POSTGRES_PORT),
  });
