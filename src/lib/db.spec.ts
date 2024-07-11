import { expect, test } from "vitest";
import { db_insert_ingredient, app_db_table_names, app_db_tables_length, create_ingredient, initialize_db, schema_user_version, db_get_ingredients } from "./db";
// import { expect, test } from "vitest"



test("initialize db - created all tables", async ({onTestFinished}) => {
  const db = initialize_db({ test: true });
  onTestFinished(() => db.close())

  setTimeout(async () => {
  }, 5000)

  await new Promise(r => setTimeout(r, 100))
  
  db.all(
    `
    SELECT name FROM sqlite_schema
    WHERE type IN ("table", "view") AND name NOT LIKE 'sqlite_%'
    ORDER BY 1
  `,
    (err, rows: [{name: string}]) => {
      // console.log(rows)
      // [
      //   { name: 'categories' },
      //   { name: 'food_category_relation' },
      //   { name: 'food_recipe_relation' },
      //   { name: 'foods' },
      //   { name: 'ingredient_stores' },
      //   { name: 'ingredient_used' },
      //   { name: 'ingredients' },
      //   { name: 'kitchen_utensil_groups' },
      //   { name: 'kitchen_utensils' },
      //   { name: 'recipe_categories_relation' },
      //   { name: 'recipe_ingredients' },
      //   { name: 'recipe_utensils' },
      //   { name: 'recipes' },
      //   { name: 'utensil_function_relation' }
      // ]
      // expect(rows, "number of tables created").toHaveLength(
      //   app_db_tables_length,
      // );
      // const row_names = rows.forEach(v => {console.log(v, v.name); return v.name})
      const row_names = []
      for (let i = 0; i < rows.length; i++) {
        row_names.push(rows[i].name)
      }
      expect(row_names, "all necessary table names in schema").toEqual(expect.arrayContaining(app_db_table_names))
      
    },
  );
});


test("initialize db - correct user_version", async ({onTestFinished}) => {
  const db = initialize_db({ test: true });
  onTestFinished(() => db.close())

  setTimeout(async () => {
  }, 5000)

  await new Promise(r => setTimeout(r, 100))
  db.get("PRAGMA user_version", (err, row: {user_version: number}) => {
    expect(row.user_version).toEqual(schema_user_version)
  })
})

test("insert into ingredients", async ({onTestFinished}) => {
  const db = initialize_db({ test: true });
  onTestFinished(() => db.close())
  setTimeout(async () => {
  }, 5000)


  // ingredients
  const ingredient1 = create_ingredient("Würstchen mit Speck umwickelt", "200g")
  const ingredient2 = create_ingredient("Kartoffeln", "1,5kg")
  await db_insert_ingredient(db, ingredient1)
  await db_insert_ingredient(db, ingredient2)
  setTimeout(async () => {
  }, 5000)

  const ingredients = await db_get_ingredients(db)
  
  expect(ingredients.length).toEqual(1)

})