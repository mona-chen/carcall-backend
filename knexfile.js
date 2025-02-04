const dotenv = require("dotenv");
dotenv.config();

const Deno = {
  env: {
    get: (e) => {
      return process.env[e];
    },
  },
};

module.exports = {
  development: {
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
  },

  production: {
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
  },

  testing: {
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
  },
};
