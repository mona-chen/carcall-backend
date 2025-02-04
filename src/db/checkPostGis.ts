import Knex from "knex";
import knexConfig from "./knexfile";
import { Env } from "../types/config";
import { logger } from "../utils/logger";
import knexPostgis from "knex-postgis";

const env: Env = process.env;

const knex = Knex(knexConfig[env.APP_ENV ?? "development"] as any);

// install postgis functions in knex.postgis;
export const st = knexPostgis(knex);

async function isPostGISInstalled() {
  try {
    // Raw SQL query to check if PostGIS extension is installed and enabled
    const result = await knex.raw(
      "SELECT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis')"
    );

    // Extract the value from the query result
    const postgisInstalled = result.rows[0].exists;

    if (!postgisInstalled) {
      logger.warn(
        "PostGIS is currently not installed, some features might fail to work"
      );
    }
    return postgisInstalled;
  } catch (error) {
    logger.error("Error checking PostGIS:", error);
    return false;
  } finally {
    // Close the connection
    await knex.destroy();
  }
}

export default isPostGISInstalled;
