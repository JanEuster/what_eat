import Database from "better-sqlite3";
import type {
  food,
  identifier,
  ingredient,
  ingredient_store,
  ingredient_used,
  kitchen_utensil,
  kitchen_utensil_group,
  recipe,
  recipe_category,
} from "./db.types";

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
  // recipe_ingredients:
  //   "recipe_id VARCHAR(255), ingredient_id VARCHAR(255), PRIMARY KEY(recipe_id, ingredient_id), FOREIGN KEY(recipe_id) REFERENCES recipes(id), FOREIGN KEY(ingredient_id) REFERENCES ingredients(id)",
  recipe_tree_relation:
    "child_id VARCHAR(255), parent_id VARCHAR(255), PRIMARY KEY(child_id, parent_id), FOREIGN KEY(child_id) REFERENCES recipes(id), FOREIGN KEY(parent_id) REFERENCES recipes(id)",
  recipe_pictures:
    "id INTEGER PRIMARY KEY AUTOINCREMENT, data BLOB, recipe_id VARCHAR(255), FOREIGN KEY(recipe_id) REFERENCES recipes(id)",
  recipe_utensils_relation:
    "recipe_id VARCHAR(255), utensil_id VARCHAR(255), required BOOL, PRIMARY KEY(recipe_id, utensil_id), FOREIGN KEY(recipe_id) REFERENCES recipes(id), FOREIGN KEY(utensil_id) REFEReNCES kitchen_utensils(id)",
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
    "food_id VARCHAR(255), category_id VARCHAR(255), PRIMARY KEY(category_id, food_id), FOREIGN KEY(food_id) REFERENCES foods(id), FOREIGN KEY(category_id) REFERENCES food_category(id)",
};
export const app_db_table_names = Object.keys(app_db_tables);
export const app_db_table_columns = Object.values(app_db_tables);
export const app_db_tables_length = Object.keys(app_db_tables).length;

export function initialize_db(args: { test?: boolean }): Database.Database {
  const db = new Database(args.test ? ":memory:" : "what_eat.db");
  db.transaction(() => {
    for (let i = 0; i < app_db_tables_length; i++) {
      db.prepare(
        `CREATE TABLE ${app_db_table_names[i]} (${app_db_table_columns[i]})`,
      ).run();
    }

    // write verison of created schema to db
    db.prepare(`PRAGMA user_version = ${schema_user_version}`).run();
  });

  return db;
}

export function connect_db(): Database.Database {
  return new Database("what_eat.db");
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

// export function create_recipe(
//   name: string,
//   categories: identifier[],
//   ingredients_used: ingredient_used[],
//   preparation: string,
//   time_prepping_ingredients: number,
//   time_cutting: number,
//   time_waiting: number,
//   time_cooking: number,
//   time_cleaning: number,
//   portions: number,
//   ingredient_stores: identifier[],
//   required_utensils: identifier[],
//   optional_utensils: identifier[],
//   pictures: Blob[]

// ): recipe {
//   const id = generate_string_id(name)
//   return {id, categories, name, ingredients: ingredients_used, preparation, time_prepping_ingredients, time_cutting, time_waiting, time_cooking, time_cleaning, portions, ingredient_stores, required_utensils, optional_utensils, pictures}
// }

// export function create_kitchen_utensil(name: string,functions: identifier[]): kitchen_utensil {
//   const id = generate_string_id(name)
//   return {id, name, functions: functions}
// }
// export function create_food(name: string, description: string, subfood: identifier[]): food {
//   const id = generate_string_id(name)
//   return {id, name, description, subfood}
// }
// export function create_ingredient_store(name: string): ingredient_store {
//   const id = generate_string_id(name)
//   return {id, name}
// }
// export function create_picture_blob(data: ArrayBuffer): Blob {
//   return new Blob([data]);
// }
// export function create_ingredient_used(
//   ingredient: ingredient,
//   amount: number,
// ): ingredient_used {
//   return {ingredient, amount}
// }

export function db_insert_ingredient(
  db: Database.Database,
  ingredient: ingredient,
): Error | null {
  db.prepare(
    "INSERT INTO ingredients (id, name, default_size) VALUES(?, ?, ?)",
  ).run(ingredient.id, ingredient.name, ingredient.default_size);
  return null;
}

export function db_insert_recipe(
  db: Database.Database,
  recipe: recipe,
): Error | null {
  db.prepare(
    `
    INSERT INTO recipes 
    (id, name, preparation, time_prepping_ingredients, time_cutting, time_waiting, time_cooking, time_cleaning, portions) 
    VALUES(?,?,?,?,?,?,?,?,?)`,
  ).run(
    recipe.id,
    recipe.name,
    recipe.preparation,
    recipe.time_prepping_ingredients,
    recipe.time_cutting,
    recipe.time_waiting,
    recipe.time_cooking,
    recipe.time_cleaning,
    recipe.portions,
  );
  return null;
}

export function db_insert_food(
  db: Database.Database,
  food: food,
): Error | null {
  db.prepare("INSERT INTO foods (id, name, description) VALUES(?, ?, ?)").run(
    food.id,
    food.name,
    food.description,
  );
  return null;
}

export function db_insert_category(
  db: Database.Database,
  category: recipe_category,
): Error | null {
  db.prepare("INSERT INTO categories (id, name) VALUES(?, ?)").run(
    category.id,
    category.name,
  );
  return null;
}

export function db_insert_utensil(
  db: Database.Database,
  utensil: kitchen_utensil,
): Error | null {
  db.prepare("INSERT INTO kitchen_utensils (id, name) VALUES(?, ?)").run(
    utensil.id,
    utensil.name,
  );
  return null;
}
export function db_insert_utensil_group(
  db: Database.Database,
  utensil_group: kitchen_utensil_group,
): Error | null {
  db.prepare(
    "INSERT INTO kitchen_utensil_groups (id, name, parent_group) VALUES(?, ?, ?)",
  ).run(utensil_group.id, utensil_group.name, utensil_group.parent_group);
  return null;
}

export function db_insert_ingredient_store(
  db: Database.Database,
  ingredient_store: ingredient_store,
): Error | null {
  db.prepare("INSERT INTO ingredient_stores (id, name) VALUES(?, ?)").run(
    ingredient_store.id,
    ingredient_store.name,
  );
  return null;
}

export function db_insert_ingredient_picture(
  db: Database.Database,
  picture: Buffer,
  ingredient: ingredient,
): Error | null {
  db.prepare(
    "INSERT INTO ingredient_pictures (data, ingredient_id) VALUES(?, ?)",
  ).run(picture, ingredient.id);
  return null;
}

export function db_insert_food_picture(
  db: Database.Database,
  picture: Blob,
  food: food,
): Error | null {
  db.prepare("INSERT INTO food_pictures (data, food_id) VALUES(?, ?)").run(
    picture,
    food.id,
  );
  return null;
}

export function db_insert_recipe_picture(
  db: Database.Database,
  picture: Blob,
  recipe: recipe,
): Error | null {
  db.prepare(
    "INSERT INTO recipe_pictures (data, ingredient_id) VALUES(?, ?)",
  ).run(picture, recipe.id);
  return null;
}

export function db_insert_ingredient_store_relation(
  db: Database.Database,
  ingredient_id: identifier,
  store_id: identifier,
): Error | null {
  db.prepare(
    "INSERT INTO ingredient_store_relation (ingredient_id, store_id) VALUES(?, ?)",
  ).run(ingredient_id, store_id);
  return null;
}

export function db_insert_ingredient_used(
  db: Database.Database,
  ingredient_id: identifier,
  store_id: identifier,
  amount: number,
): Error | null {
  db.prepare(
    "INSERT INTO ingredient_used (recipe_id, ingredient_id, amount) VALUES(?, ?, ?)",
  ).run(ingredient_id, store_id, amount);
  // TODO: try catch conditional for all these db statements with better-sqlite3
  return null;
}

export function db_insert_recipe_categories_relation(
  db: Database.Database,
  recipe_id: identifier,
  category_ids: identifier[],
): Error | null {
  const insert_rel = db.prepare(
    "INSERT INTO recipe_categories_relation (recipe_id, category_id) VALUES(?, ?)",
  );

  const insert_many = db.transaction((rels: [string, string][]) => {
    for (const rel of rels) insert_rel.run(...rel);
  });
  insert_many(category_ids.map((cat_id) => [recipe_id, cat_id]));

  setTimeout(() => {}, 50);
  return null;
}
export function db_insert_utensil_function_relation(
  db: Database.Database,
  recipe_id: identifier,
  group_ids: identifier[],
): Error | null {
  const insert_rel = db.prepare(
    "INSERT INTO utensil_function_relation (recipe_id, group_id) VALUES(?, ?)",
  );

  const insert_many = db.transaction((rels: [string, string][]) => {
    for (const rel of rels) insert_rel.run(...rel);
  });
  insert_many(group_ids.map((group_id) => [recipe_id, group_id]));

  setTimeout(() => {}, 50);
  return null;
}

export function db_insert_food_recipe_relation(
  db: Database.Database,
  food_id: identifier,
  recipe_id: identifier,
): Error | null {
  db.prepare(
    "INSERT INTO food_recipe_relation (food_id, recipe_id) VALUES(?, ?)",
  ).run(food_id, recipe_id);
  return null;
}

/**
 *
 * @param db
 * @param food_id
 * @param category_id
 * @returns
 */
export function db_insert_food_category_relation(
  db: Database.Database,
  food_id: identifier,
  category_id: identifier,
): Error | null {
  db.prepare(
    "INSERT INTO food_category_relation (food_id, category_id) VALUES(?, ?)",
  ).run(food_id, category_id);
  return null;
}

/**
 *
 * @param db
 * @returns
 */
export function db_get_ingredients(db: Database.Database): ingredient[] {
  const ingredients: ingredient[] = [];

  const stmnt = db.prepare("SELECT * FROM ingredients");

  stmnt.all().forEach((row) => {
    ingredients.push({
      id: row.id,
      name: row.name,
      default_size: row.default_size,
      stores: [],
      pictures: [],
    });
  });
  return ingredients;
}

/**
 * aquire additional recipe data via unions of categories, ingredients_used, ingredient_stores, kitchen_utensils, recipe_pictures
 * @param db
 * @param recipe
 * @returns
 */
export function db_get_recipe_relations(
  db: Database.Database,
  recipe: recipe,
): recipe {
  recipe.categories = db
    .prepare(
      `
    SELECT categories.*
    FROM recipes, recipe_categories_relation, categories
    WHERE recipes.id = ? AND recipes.id = recipe_categories_relation.recipe_id AND recipe_categories_relation.category_id = categories.id
    `,
    )
    .all(recipe.id) as recipe_category[];

  recipe.ingredients = db
    .prepare(
      `
    SELECT ingredient_used.* 
    FROM recipes, ingredient_used
    WHERE recipes.id = ? AND recipes.id = ingredient_used.recipe_id
    `,
    )
    .all(recipe.id) as ingredient_used[];

  recipe.ingredient_stores = db
    .prepare(
      `
    SELECT ingredient_stores.*
    FROM recipes, ingredient_used, ingredients, ingredient_store_relation
    WHERE recipes.id = ? AND recipes.id = ingredient_used.recipe_id AND ingredient_used.ingredient_id = ingredient_store_relation.ingredient_id AND ingredient_store_relation.store_id = ingredient_stores.id
    `,
    )
    .all(recipe.id) as ingredient_store[];

  recipe.utensils = db
    .prepare(
      `
    SELECT kitchen_utensils.*, recipe_utensils_relation.required
    FROM recipes, recipe_utensils_relation, kitchen_utensils
    WHERE recipes.id = ? AND recipes.id = recipe_utensils_relation.recipe_id AND recipe_utensils_relation.utensil_id = kitchen_utensils.id
    `,
    )
    .all(recipe.id) as kitchen_utensil[];

  recipe.pictures = db
    .prepare(
      `
    SELECT recipe_pictures.data
    FROM recipes, recipe_pictures
    WHERE recipes.id = ? AND recipes.id = recipe_pictures.recipe_id
    `,
    )
    .all(recipe.id) as Buffer[];

  return recipe;
}

/**
 * aquire either top level or sublevel
 * @param db
 * @param parent top level `null` or specify a parent recipe in the tree
 * @returns
 */
export function db_get_recipes_by_parent(
  db: Database.Database,
  parent: identifier | null,
): recipe[] {
  const rows = db
    .prepare("SELECT * FROM recipes WHERE parent = ?")
    .all(parent ?? "''") as recipe[];

  return rows.map((row) =>
    db_get_recipe_relations(db, {
      id: row.id,
      name: row.name,
      preparation: row.preparation,
      time_prepping_ingredients: row.time_prepping_ingredients,
      time_cutting: row.time_cutting,
      time_waiting: row.time_waiting,
      time_cooking: row.time_cooking,
      time_cleaning: row.time_cleaning,
      portions: row.portions,
      categories: [],
      ingredients: [],
      ingredient_stores: [],
      utensils: [],
      pictures: [],
    }),
  );
}

/**
 * get all recipes, optionally set a limit
 * @param db
 * @param parent
 * @param limit
 * @returns
 */
export function db_get_all_recipes(
  db: Database.Database,
  parent: identifier | null,
  limit?: number,
): recipe[] {
  const rows = db
    .prepare(`SELECT * FROM recipes LIMIT ?`)
    .all(limit) as recipe[];

  return rows.map((row) =>
    db_get_recipe_relations(db, {
      id: row.id,
      name: row.name,
      preparation: row.preparation,
      time_prepping_ingredients: row.time_prepping_ingredients,
      time_cutting: row.time_cutting,
      time_waiting: row.time_waiting,
      time_cooking: row.time_cooking,
      time_cleaning: row.time_cleaning,
      portions: row.portions,
      categories: [],
      ingredients: [],
      ingredient_stores: [],
      utensils: [],
      pictures: [],
    }),
  );
}

/**
 *
 * @param db
 * @param parent
 * @returns
 */
export function db_get_food_by_parent(
  db: Database.Database,
  parent: identifier | null,
): food[] {
  let foods: food[] = [];
  const rows = db
    .prepare("SELECT * FROM foods WHERE parent = ")
    .all(parent ?? "''") as food[];

  return rows.map((row) => {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      pictures: db
        .prepare(
          `
          SELECT food_pictures.data
          FROM foods, food_pictures
          WHERE foods.id = ? AND foods.id = food_pictures.food_id
          `,
        )
        .all(row.id) as Buffer[],
    };
  });
}

/**
 *
 * @param db
 * @param table_name
 * @param item_id
 * @returns
 */
export function db_get_any_table_by_id(
  db: Database.Database,
  table_name: string,
  item_id: string,
): Object {
  return db.prepare("SELECT * FROM ? WHERE id = ?").run(table_name, item_id);
}

/**
 *
 * @param db
 * @param table_name
 * @param item_id
 * @returns
 */
export function db_delete_any_item_by_id(
  db: Database.Database,
  table_name: string,
  item_id: string,
): Promise<null> {
  return new Promise((resolve, reject) => {
    db.prepare("SELECT * FROM ? WHERE id = ?").run(table_name, item_id);
    resolve(null);
  });
}
