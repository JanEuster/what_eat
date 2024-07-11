<script lang="ts">
  import type { recipe } from "$lib/db.types";
  import { onMount } from "svelte";
  import type { recipes_response_type } from "../api/db/recipes/+server";

  let recipes: recipe[] = []

  async function get_recipes() {
    const res = await fetch("/api/db/recipes")
    const json: recipes_response_type = await res.json()
    recipes = json.recipes
  }

  onMount(() => {

    get_recipes()
  })
</script>


{#each recipes as r}
   <li>
     {r.name}
   </li>
{/each}