import dotenv from "dotenv";
dotenv.config();
import PostgisPlugin from "knex-postgis";

const Deno = {
  env: {
    get: (e: string) => process.env[e],
  },
};

// Common database configuration options
const commonConfig = {
  client: "pg",
  useNullAsDefault: true,
  pool: {
    max: 50,
    min: 2,
    reapIntervalMillis: 1000,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 600000,
  },
  migrations: {
    directory: "./database/migrations",
  },
  seeds: {
    directory: "./database/seeds",
  },
  plugins: [PostgisPlugin],
};

// Function to return either a DATABASE_URL-based connection or a config object
const getConnectionConfig = (envPrefix: string) => {
  return process.env.DATABASE_URL
    ? process.env.DATABASE_URL
    : {
        host: Deno.env.get(`${envPrefix}_HOST`),
        port: parseInt(Deno.env.get(`${envPrefix}_PORT`) ?? "5432"),
        user: Deno.env.get(`${envPrefix}_USER`),
        password: Deno.env.get(`${envPrefix}_PASSWORD`),
        database: Deno.env.get(`${envPrefix}_DATABASE`),
      };
};

export const production = {
  ...commonConfig,
  connection: getConnectionConfig("DB"),
};

export const testing = {
  ...commonConfig,
  connection: getConnectionConfig("POSTGRES_TEST"),
};

export const development = {
  ...commonConfig,
  connection: getConnectionConfig("DB"),
};

const knexConfig = {
  testing,
  production,
  development,
};

export default knexConfig;
