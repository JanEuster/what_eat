import { Database } from "sqlite3";
import type { ingredient } from "./db.types";

export const schema_user_version = 1;
export const app_db_tables = {
  ingredients:
    "id VARCHAR(255) PRIMARY KEY, name VARCHAR(255), default_size VARCHAR(255)",
  recipes:
    "id VARCHAR(255) PRIMARY KEY, name VARCHAR(255), prepartion TEXT, time_prepping_ingredients INTEGER, time_cutting INTEGER, time_waiting INTEGER, time_cooking INTEGER, time_cleaning INTEGER, portions INT",
  categories: "id VARCHAR(255) PRIMARY KEY, name VARCHAR(255)",
  kitchen_utensils: "id VARCHAR(255) PRIMARY KEY, name VARCHAR(255)",
  foods: "id VARCHAR(255) PRIMARY KEY, name VARCHAR(255), description TEXT",

  ingredient_stores: "id VARCHAR(255) PRIMARY KEY, name VARCHAR(255)",
  ingredient_store_relation:
    "ingredient_id VARCHAR(255), store_id VARCHAR(255), PRIMARY KEY(ingredient_id, store_id), FOREIGN KEY(ingredient_id) REFERENCES ingredients(id), FOREIGN KEY(store_id) REFERENCES ingredient_stores(id)",
  ingredient_pictures:
    "id INTEGER PRIMARY KEY AUTOINCREMENT, data BLOB, ingredient_id VARCHAR(255), FOREIGN KEY(ingredient_id) REFERENCES ingredients(id)",

  ingredient_used:
    "recipe_id VARCHAR(255), ingredient_id VARCHAR(255), amount FLOAT, PRIMARY KEY(recipe_id, ingredient_id), FOREIGN KEY(recipe_id) REFERENCES recipes(id), FOREIGN KEY(ingredient_id) REFERENCES ingredients(id)",
  recipe_ingredients:
    "recipe_id VARCHAR(255), ingredient_id VARCHAR(255), PRIMARY KEY(recipe_id, ingredient_id), FOREIGN KEY(recipe_id) REFERENCES recipes(id), FOREIGN KEY(ingredient_id) REFERENCES ingredients(id)",
  recipe_pictures:
    "id INTEGER PRIMARY KEY AUTOINCREMENT, data BLOB, recipe_id VARCHAR(255), FOREIGN KEY(recipe_id) REFERENCES recipes(id)",
  recipe_utensils:
    "recipe_id VARCHAR(255), utensil_id VARCHAR(255), PRIMARY KEY(recipe_id, utensil_id), FOREIGN KEY(recipe_id) REFERENCES recipes(id), FOREIGN KEY(utensil_id) REFEReNCES kitchen_utensils(id)",
  recipe_categories_relation:
    "recipe_id VARCHAR(255), category_id VARCHAR(255), PRIMARY KEY(recipe_id, category_id), FOREIGN KEY(recipe_id) REFERENCES recipes(id), FOREIGN KEY(category_id) REFERENCES food_category(id)",

  kitchen_utensil_groups:
    "id VARCHAR(255) PRIMARY KEY, name VARCHAR(255), parent_group VARCHAR(255), FOREIGN KEY(parent_group) REFERENCES kitchen_utensils_groups(id)",
  utensil_function_relation:
    "utensil_id VARCHAR(255), group_id VARCHAR(255), PRIMARY KEY(utensil_id, group_id), FOREIGN KEY(utensil_id) REFERENCES kitchen_utensils(id), FOREIGN KEY(group_id) REFERENCES kitchen_utensil_groups(id)",

  food_pictures:
    "id INTEGER PRIMARY KEY AUTOINCREMENT, data BLOB, food_id VARCHAR(255), FOREIGN KEY(food_id) REFERENCES foods(id)",
  food_recipe_relation:
    "recipe_id VARCHAR(255), food_id VARCHAR(255), PRIMARY KEY(recipe_id, food_id), FOREIGN KEY(recipe_id) REFERENCES recipes(id), FOREIGN KEY(food_id) REFERENCES foods(id)",
  food_category_relation:
    "food_id VARCHAR(255), category_id VARCHAR(255), FOREIGN KEY(food_id) REFERENCES foods(id), FOREIGN KEY(category_id) REFERENCES food_category(id)",
};
export const app_db_table_names = Object.keys(app_db_tables);
export const app_db_table_columns = Object.values(app_db_tables);
export const app_db_tables_length = Object.keys(app_db_tables).length;

export function initialize_db(args: { test?: boolean }) {
  const db = new Database(args.test ? ":memory:" : "what_eat.db");
  db.serialize(() => {
    for (let i = 0; i < app_db_tables_length; i++) {
      db.run(
        `CREATE TABLE ${app_db_table_names[i]} (${app_db_table_columns[i]})`,
      );
    }

    // write verison of created schema to db
    db.run(`PRAGMA user_version = ${schema_user_version}`);
  });

  return db;
}

export function generate_string_id(name: string): string {
  const valid_chars = "abcdefghijklmnopqrstuvwxyz0123456789-";
  let id = "";
  const split_name = name.trim().split("");
  for (let i = 0; i < name.length; i++) {
    const char = split_name[i].toLowerCase().replace(" ", "-");
    if (valid_chars.includes(char)) {
      id += split_name[i].toLowerCase();
    } else {
      if (char == "ä") {
        id += "ae";
      } else if (char == "ü") {
        id += "ue";
      } else if (char == "ö") {
        id += "oe";
      } else if (char == "ß") {
        id += "ss";
      }
    }
  }
  return id;
}

export function create_ingredient(
  name: string,
  default_size: string,
): ingredient {
  // generate id
  const id = generate_string_id(name);
  // TODO: check for correctness of default_size unit
  return { id, name, default_size, stores: [], pictures: [] };
}
export async function db_insert_ingredient(
  db: Database,
  ingredient: ingredient,
): Promise<Error | null> {
  return new Promise((resolve, reject) =>
    db.run(
      "INSERT INTO ingredients (id, name, default_size) VALUES(?, ?, ?)",
      [ingredient.id, ingredient.name, ingredient.default_size],
      (err) => {
        resolve(err);
      },
    ),
  );
}

export async function db_get_ingredients(db: Database): Promise<ingredient[]> {
  let ingredients: ingredient[] = [];
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM ingredients", (err, rows: any[]) => {
      if (err) reject();
      rows.forEach((row, i) => {
        ingredients.push({
          id: row.id,
          name: row.name,
          default_size: row.default_size,
          stores: [],
          pictures: [],
        });
      });
      resolve(ingredients);
      });
  });
}
