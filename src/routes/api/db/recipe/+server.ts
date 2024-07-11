import type { server } from "./$types";
import { connect_db, db_delete_any_item_by_id, db_get_any_table_by_id, db_insert_recipe } from "$lib/db";
import type { recipe } from "$lib/db.types";
import { json } from "@sveltejs/kit";
import { res_empty_ok } from "$lib/api_shorthands";

export type recipe_response_type = { recipe: recipe };

export async function GET({ url }) {
  const id: string = url.searchParams.get("id") ?? "";
  if (id.length > 0) {
    const db = connect_db();
    const res: recipe_response_type = {
      recipe: (await db_get_any_table_by_id(db, "recipe", id)) as recipe,
    };
    return new Response(JSON.stringify(res), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  return json({ error: "missing id searchparam" }, { status: 400 });
}

export type recipe_request_type = { recipe: recipe };
export async function POST({ request }) {
  const data = (await request.json()) as recipe_request_type;

  const db = connect_db();
  const successful = db_insert_recipe(db, data.recipe) == null;

  if (successful) {
    return res_empty_ok;
  }

  return new Response(null, { status: 409 });
}

export async function DELETE({ url }) {
  const id = url.searchParams.get("id") ?? ""
  if (id.length > 0) {
    const db = connect_db()
    db_delete_any_item_by_id(db, "recipes", id)
    return new Response(null, {status: 200})
  }
  return json({ error: "missing id searchparam" }, { status: 400 })
}
