<script setup lang="ts">
// import countries from '~/static/countries.json'

defineProps<{
  error?: string
  default?: string
}>()

const model = defineModel()
</script>

<template>
  <div>
    <div class="input-group">
      <span class="input-group-text fw-bold">Country</span>
      <select v-bind="$attrs" v-model="model"
        :class="{ 'form-control arrow-bottom': true, 'border border-danger': error }" aria-describedby="countryHelp">
        <option value="IDN">Indonesia</option>
      </select>
      <!-- <datalist id="countries" style="max-height: 200px;">
        <option v-for="country in countries" :key="country.ISO3_CODE" :value="country.ISO3_CODE"
          :selected="country.ISO3_CODE === $props.default">
          {{ country.name }}
        </option>
      </datalist> -->
    </div>
    <div id="countryHelp" class="form-text text-xs text-danger" v-if="error">
      {{ error }}
    </div>
  </div>
</template>
