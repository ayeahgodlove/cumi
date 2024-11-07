import { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

// Update with your config settings.

const config: Knex.Config = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  searchPath: ['knex', 'public'],
  migrations: {
    extension: "ts"
  }
};
export default config;
