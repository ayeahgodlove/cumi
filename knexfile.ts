import { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

// Update with your config settings.

const config: Knex.Config = {
  client: "mysql2",
  // connection: process.env.DATABASE_URL,
  connection: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
  searchPath: ["knex", "public"],
  migrations: {
    extension: "ts",
  },
};
export default config;
