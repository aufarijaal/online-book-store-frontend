<script setup lang="ts">
import countries from "~/static/countries.json";

const model = defineModel();
const props = defineProps<{ default?: string }>();
</script>

<template>
  <select v-bind="$attrs" v-model="model" class="arrow-bottom">
    <option
      v-for="country in countries"
      :key="country.ISO3_CODE"
      :value="country.ISO3_CODE"
      :selected="country.ISO3_CODE === $props.default"
    >
      {{ country.name }}
    </option>
  </select>
</template>
