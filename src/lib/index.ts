// place files you want to import through the `$lib` alias in this folder.

import { Database } from "sqlite3"
import type { ingredient } from "./index.types"


const db = new Database(":memory:")
db.serialize(() => {
  db.run("CREATE TABLE ingredients (id VARCHAR(255) PRIMARY KEY, name VARCHAR(255), default_size VARCHAR(255)), FOREIGN KEY(store_id) REFERENCES ingredient_stores(id)")
  db.run("CREATE TABLE ingredient_stores (id VARCHAR(255) PRIMARY KEY, name VARCHAR(255)")
  db.run("CREATE TABLE kitchen_utensils (id VARCHAR(255) PRIMARY KEY, name VARCHAR(255)")
  
  db.run("CREATE TABLE ingredient_used (FOREIGN KEY(recipe_id) REFERENCES recipes(id) PRIMARY KEY, FOREIGN KEY(ingredient_id) REFERENCES ingredients(id), amount: FLOAT")
  db.run("CREATE TABLE kitchen_utensils_groups (id VARCHAR(255) PRIMARY KEY, name VARCHAR(255), FOREIGN KEY(parent_group) REFERENCES kitchen_utensils_groups(id)")
  
  db.run("CREATE TABLE utensil_function_relation (FOREIGN KEY(utensil_id) REFERENCES kitchen_utensils(id) PRIMARY KEY, FOREIGN KEY(group_id) REFERENCES kitchen_utensil_groups(id))")

  db.run("CREATE TABLE recipe_categories (id VARCHAR(255) PRIMARY KEY, name VARCHAR(255))")
  db.run("CREATE TABLE recipes (id VARCHAR(255) PRIMARY KEY, name VARCHAR(255), FOREIGN KEY(category) REFERENCES recipe_category(id), prepartion: TEXT, time_prepping_ingredients: INTEGER, time_cutting: INTEGER, time_waiting: INTEGER, time_cooking: INTEGER, time_cleaning: INTEGER, portions: INT")
  db.run("CREATE TABLE recipe_ingredients (FOREIGN KEY(recipe_id) REFERENCES recipes(id) PRIMARY KEY, FOREIGN KEY(ingredient_id) REFERENCES ingredients(id) PRIMARY KEY)")
  db.run("CREATE TABLE recipe_utensils (FOREIGN KEY(recipe_id) REFERENCES recipes(id) PRIMARY KEY, FOREIGN KEY(utensil_id) REFERNCES kitchen_utensils(id))")

  db.run("CREATE TABLE foods (id VARCHAR(255) PRIMARY KEY, name VARCHAR(255), preparation: TEXT, FOREIGN KEY(parent_food_id) REFERENCES foods(id)")
})



export async function get_ingredients(): Promise<ingredient[]> {
  let ingredients: ingredient[] = []
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM ingredients", (err, rows: any[]) => {
      if (err) reject()
        
      rows.forEach((row, i) => {
        ingredients.push({id: row.id, name: row.name, default_size: row.default_size, store_id: row.store_id})
      })
    })
    resolve(ingredients)
  });
}