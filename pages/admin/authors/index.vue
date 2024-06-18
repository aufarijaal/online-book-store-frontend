<script setup lang="ts">
import { createColumnHelper } from '@tanstack/vue-table';
import { toast } from 'vue-sonner';

type AuthorData = Omit<Author, 'created_at' | 'updated_at' | 'deleted_at'>

definePageMeta({
  layout: 'admin',
  middleware: ['authenticated', 'admin'],
})

useHead({
  title: 'Admin · Authors',
})

const columnHelper = createColumnHelper<any>()
const columns = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor("name" as any, {
    header: "Name",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor("dob", {
    header: "Date of birth",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor("nationality", {
    header: "Nationality",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor("books_count", {
    header: "Books Count",
    cell: info => info.getValue(),
    enableSorting: false
  }),
]
const data = ref<AuthorData[]>([])
const paginationInfo = ref<PaginationInfo>({
  currentPage: 0,
  count: 0,
  from: 0,
  to: 0,
  total: 0,
  hasNextPage: false,
  hasPrevPage: false,
  pages: [],
  lastPage: 0
})
const getDataLoading = ref(true)
const route = useRoute();
const showModal = ref(false)
const existingDataToEdit = ref(undefined)

async function getData(query?: Filters) {
  getDataLoading.value = true
  await useApiFetch('/csrf-cookie')

  const result = await useApiFetch('/admin/authors?', {
    query,
    headers: {
      Accept: 'application/json',
    },
  })

  if (result?.error.value) {
    toast.error(result.error.value?.data.errors)
    return
  }

  data.value = (result.data.value as any).data.data as AuthorData[]
  paginationInfo.value = {
    currentPage: (result.data.value as any).data.current_page,
    count: (result.data.value as any).data.count,
    from: (result.data.value as any).data.from,
    to: (result.data.value as any).data.to,
    total: (result.data.value as any).data.total,
    hasNextPage: (result.data.value as any).data.next_page_url !== null,
    hasPrevPage: (result.data.value as any).data.next_page_url !== null,
    pages: (result.data.value as any).data.links.slice(1, -1),
    lastPage: (result.data.value as any).data.last_page
  }
  getDataLoading.value = false
}

function edit(data: any) {
  existingDataToEdit.value = data
  showModal.value = true
}

async function remove(ids: number[]) {
  try {
    await useApiFetch('/csrf-cookie')

    const result = await useApiFetch('/admin/authors?ids=' + ids.join(','), {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    })

    if (result?.error.value) {
      toast.error(result.error.value?.data.errors)
      return
    }

    await getData()
  } catch (error: any) {
    toast.error(error)
  } finally {

  }
}

onMounted(() => {
  getData(route.query);
})
</script>

<template>
  <div class="p-4 pt-0">
    <Teleport to="body">
      <ModalsAdminAddEditAuthor v-if="showModal" @cancel="() => {
        showModal = false
        existingDataToEdit = undefined
      }" @refresh="() => {
        showModal = false
        existingDataToEdit = undefined
        getData()
      }" :existing="existingDataToEdit" />
    </Teleport>


    <DataTable title="Authors" :columns="columns" :data="data" :pagination-info="paginationInfo"
      :get-data-loading="getDataLoading" @rerender="getData" @edit="edit" @remove="(ids) => remove(ids)"
      @create="showModal = true">
      <template #toolbar>
      </template>

      <template #actions>
      </template>
    </DataTable>
  </div>
</template>
