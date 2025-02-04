import dotenv from "dotenv";
dotenv.config();
import PostgisPlugin from "knex-postgis";

const Deno = {
  env: {
    get: (e: string) => {
      return process.env[e];
    },
  },
};
export const production = {
  client: "pg",
  useNullAsDefault: true,
  connection: {
    host: Deno.env.get("DB_HOST"),
    port: parseInt(Deno.env.get("DB_PORT") ?? ""),
    user: Deno.env.get("DB_USER"),
    password: Deno.env.get("DB_PASSWORD"),
    database: Deno.env.get("DB_DATABASE"),
  },
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

export const testing = {
  client: "pg",
  connection: {
    host: Deno.env.get("POSTGRES_TEST_HOST"),
    port: parseInt(Deno.env.get("POSTGRES_TEST_PORT") ?? ""),
    user: Deno.env.get("POSTGRES_TEST_USER"),
    password: Deno.env.get("POSTGRES_TEST_PASSWORD"),
    database: Deno.env.get("POSTGRES_TEST_DATABASE"),
  },
  useNullAsDefault: true,
  migrations: {
    directory: "./database/migrations",
  },
  seeds: {
    directory: "./database/seeds",
  },
  plugins: [PostgisPlugin],
};

export const development = {
  client: "pg",
  useNullAsDefault: true,
  connection: {
    host: Deno.env.get("DB_HOST"),
    port: parseInt(Deno.env.get("DB_PORT") ?? ""),
    user: Deno.env.get("DB_USER"),
    password: Deno.env.get("DB_PASSWORD"),
    database: Deno.env.get("DB_DATABASE"),
  },
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
  plugins: [PostgisPlugin],
  seeds: {
    directory: "./database/seeds",
  },
};

const knexConfig = {
  testing,
  production,
  development,
};

export default knexConfig;
