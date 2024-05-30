export type identifier = string
export type food_name = string

export type ingredient = {
  id: identifier
  name: food_name
  default_size: string
  store_id: identifier
}
export type ingredient_used = {
  ingredient: ingredient
  amount: number
}
export type ingredient_store = {
  id: identifier
  name: food_name
}
export type kitchen_utensil = {
  id: identifier
  name: food_name
  function: identifier[]
}
export type kitchen_utensil_group = {
  id: identifier
  name: food_name
  utensils: kitchen_utensil[]
  subgroup: kitchen_utensil_group
}

export type recipe_category = {
  id: identifier
  name: food_name
}
export type recipe = {
  id: identifier
  name: food_name
  category: recipe_category
  ingredients: ingredient_used[]
  preparation: string
  time_prepping_ingredients: number
  time_cutting: number
  time_waiting: number
  time_cooking: number
  time_cleaning: number
  ingredient_stores: ingredient_store[]
  required_utensils: kitchen_utensil[]
  optional_utensils: kitchen_utensil[]
  portions: number
}


export type food = {
  id: identifier
  name: food_name
  subfood: food[]
  // variations: food[]
  prepartion: string
}