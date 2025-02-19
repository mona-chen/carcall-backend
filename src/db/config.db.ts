import Knex from "knex";

import { Env } from "../types/config";
import { Model } from "objection";
import CustomLogger, { logger } from "../utils/logger";
import { AnsiColor } from "../constants/ansicolor";
import knexConfig from "./knexfile";

// Get environment variables and type-check them
//@ts-ignore
const env: Required<Env> = process.env;
export const dbLogger = new CustomLogger({ color: AnsiColor.CYAN });

export default function database(
  callback: (error: Error | null, result?: any) => void
) {
  return async () => {
    try {
      const knex = Knex(knexConfig[env.APP_ENV] as any);

      // Run a simple query to test the database connection
      await knex.raw("select 1+1 as result");

      dbLogger.log("info", "[database]: DB connection successful");

      Model.knex(knex);

      // Invoke the callback with null error and optional result
      callback(null);
    } catch (error) {
      // Invoke the callback with the error
      callback(error as Error);
    }
  };
}
