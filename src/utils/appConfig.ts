import dotenv, { DotenvConfigOutput } from "dotenv";

interface AppConfig {
  POSTGRES_HOST: string;
  POSTGRES_DB: string;
  POSTGRES_PORT: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
}

const processedConfig: DotenvConfigOutput = dotenv.config();

if (processedConfig.error && !processedConfig.parsed) {
  throw new Error("There was an error during environmental variables parsing!");
}

export const APP_CONFIG = (dotenv.config().parsed as unknown) as AppConfig;
