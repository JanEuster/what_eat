import { connect_db, db_get_all_recipes } from "$lib/db";

import type { recipe } from "$lib/db.types";
import { json } from "@sveltejs/kit";

export type recipes_response_type = { recipes: recipe[] };
export async function GET() {
  const db = connect_db();
  const res: recipes_response_type = {
    recipes: await db_get_all_recipes(db, null, 50),
  };
  return json(res, {
    headers: {
      "Content-Type": "application/json",
    },
  });
}
