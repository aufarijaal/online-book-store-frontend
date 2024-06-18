<script setup lang="ts">
import { createColumnHelper } from '@tanstack/vue-table';
import dayjs from 'dayjs';
import { toast } from 'vue-sonner';

definePageMeta({
  layout: 'admin',
  middleware: ['authenticated', 'admin'],
})

useHead({
  title: 'Admin · Customers',
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
  columnHelper.accessor("email", {
    header: "Email",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor("email_verified_at", {
    header: "Account verified at",
    cell: info => info.getValue() ? dayjs(info.getValue()).format('YYYY-MM-DD HH:mm:ss') : h('strong', { innerText: "Not verified" }),
  }),
  columnHelper.accessor("created_at", {
    header: "Joined at",
    cell: info => dayjs(info.getValue()).format('YYYY-MM-DD HH:mm:ss'),
  }),
]
const data = ref<Customer[]>([])
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
const showModalAdd = ref(false)
const showModalEdit = ref(false)
const showModalResetPassword = ref(false)
const existingDataToEdit = ref(undefined)
const customerInfoForPasswordReset = ref({
  id: 0,
  name: ""
})

async function getData(query?: Filters) {
  getDataLoading.value = true
  await useApiFetch('/csrf-cookie')

  const result = await useApiFetch('/admin/customers?', {
    query,
    headers: {
      Accept: 'application/json',
    },
  })

  if (result?.error.value) {
    toast.error(result.error.value?.data.errors)
    return
  }

  data.value = (result.data.value as any).data.data as Customer[]
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
  showModalEdit.value = true
}

async function remove(ids: number[]) {
  try {
    await useApiFetch('/csrf-cookie')

    const result = await useApiFetch('/admin/customers?ids=' + ids.join(','), {
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
      <ModalsAdminAddCustomer v-if="showModalAdd" @cancel="() => {
        showModalAdd = false
      }" @refresh="() => {
        showModalAdd = false
        getData()
      }" />
      <ModalsAdminEditCustomer :existing="existingDataToEdit" v-if="showModalEdit" @cancel="() => {
        showModalEdit = false
        existingDataToEdit = undefined
      }" @refresh="() => {
        showModalEdit = false
        existingDataToEdit = undefined
        getData()
      }" />
      <ModalsAdminResetPasswordCustomer :info="customerInfoForPasswordReset" v-if="showModalResetPassword" @cancel="() => {
        showModalResetPassword = false
      }" @refresh="() => {
        showModalResetPassword = false
        getData()
      }" />
    </Teleport>


    <DataTable title="Customers" :columns="columns" :data="data" :pagination-info="paginationInfo"
      :get-data-loading="getDataLoading" @rerender="getData" @edit="edit" @remove="(ids) => remove(ids)"
      @create="showModalAdd = true">
      <template #toolbar>
      </template>

      <template #cell-actions="{ row }">
        <button class="btn-warning btn btn-sm" title="Reset password" @click.stop="() => {
          customerInfoForPasswordReset = {
            id: row.original.id,
            name: row.original.name,
          }
          showModalResetPassword = true
        }">
          <Icon name="mdi:password-reset" size="20" />
        </button>
      </template>
    </DataTable>
  </div>
</template>
