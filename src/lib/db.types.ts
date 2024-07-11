export type identifier = string
export type food_name = string

export type ingredient = {
  id: identifier
  name: food_name
  default_size: string
  stores: identifier[]
  pictures: Buffer[]
}
export type ingredient_used = {
  ingredient: ingredient
  amount: number
  // recipe_id: identifier
  // ingredient_id: identifier
}
export type ingredient_store = {
  id: identifier
  name: food_name
}
export type kitchen_utensil = {
  id: identifier
  name: food_name
  // functions: identifier[]
  is_required: boolean
}
export type kitchen_utensil_group = {
  id: identifier
  name: food_name
  parent_group: identifier
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
  categories: recipe_category[]
  ingredients: ingredient_used[]
  preparation: string
  time_prepping_ingredients: number
  time_cutting: number
  time_waiting: number
  time_cooking: number
  time_cleaning: number
  ingredient_stores: ingredient_store[]
  utensils: kitchen_utensil[]
  portions: number
  pictures: Buffer[]
}

export type recipe_tree = {[recipe_id: identifier]: recipe_tree}

export type food = {
  id: identifier
  name: food_name
  // subfood: identifier[]
  // variations: food[]
  description: string
  pictures: Buffer[]
}