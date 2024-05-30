import type { food, ingredient, ingredient_store, kitchen_utensil, kitchen_utensil_group, recipe } from "$lib/index.types";
import { Database } from "sqlite3";
import { writable, type Writable } from "svelte/store";


export const ingredients: Writable<ingredient[] | never[]> = writable()
export const kitchen_utensils: Writable<kitchen_utensil[]> = writable()
export const kitchen_utensil_groups: Writable<kitchen_utensil_group[]> = writable()
export const ingredient_stores: Writable<ingredient_store[]> = writable()
export const recipes: Writable<recipe[]> = writable()
export const foods: Writable<food[]> = writable()

