import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(client, {
  schema,
  logger: {
    logQuery(query, params) {
      if (process.env.NODE_ENV !== "production") {
        console.log("Query: ", query, params);
      }
    },
  },
});
