<script lang="ts" setup>
const props = defineProps<{
  addressResponse: {
    message: string
    data: DataResponse<Address>
  }
}>()

const emits = defineEmits(['changePageText'])
</script>

<template>
  <div class="d-flex justify-content-between mt-2">
    <div v-if="addressResponse">
      Showing
      {{ addressResponse?.data.per_page! * addressResponse?.data.current_page! }}/{{
        addressResponse?.data.total
      }}
      entries
    </div>
    <div v-else>Loading...</div>

    <!-- Pagination nav -->
    <nav>
      <ul class="pagination pagination-sm">
        <li class="page-item" v-for="page in addressResponse?.data.links">
          <div
            :class="['page-link', page.active ? 'active' : '', page.url ? '' : 'disabled']"
            style="cursor: pointer"
            @click="
              currentPage = page.label.includes('Prev')
                ? addressResponse?.data.current_page! - 1
                : page.label.includes('Next')
                  ? addressResponse?.data.current_page! + 1
                  : parseInt(page.label)
            "
            :title="`page ${page.label.includes('Prev') ? addressResponse?.data.current_page! - 1 : page.label.includes('Next') ? addressResponse?.data.current_page! + 1 : parseInt(page.label)}`"
          >
            {{ page.label.replaceAll('&amp;laquo;', '').replaceAll('&amp;raquo;', '') }}
          </div>
        </li>
      </ul>
    </nav>
  </div>
</template>
<style></style>
