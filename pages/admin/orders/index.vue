<script setup lang="ts">
import { createColumnHelper } from '@tanstack/vue-table';
import { toast } from 'vue-sonner';
import toRupiah from '@develoka/angka-rupiah-js'

type OrderData = {
  id: number
  customer_id: number
  customer_name: string
  order_date: string
  total_amount: number
  address: string
  paid: boolean
}

definePageMeta({
  layout: 'admin',
  middleware: ['authenticated', 'admin'],
})

useHead({
  title: 'Admin · Orders',
})

const columnHelper = createColumnHelper<OrderData>()
const columns = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor("customer_name", {
    header: "Customer",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor("order_date", {
    header: "Order date",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor("total_amount", {
    header: "Total amount",
    cell: info => toRupiah(info.getValue(), { floatingPoint: 0 }),
  }),
  columnHelper.accessor("address", {
    header: "Address",
    cell: info => info.getValue() ?? '-',
  }),
  columnHelper.accessor("paid", {
    header: "Paid",
    cell: info => !!info.getValue() ? 'Paid' : 'Unpaid',
  }),
]
const data = ref<OrderData[]>([])
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
const orderIdToShow = ref(0)
const showModalOrderDetail = ref(false)

async function getData(query?: Filters) {
  getDataLoading.value = true
  await useApiFetch('/csrf-cookie')

  const result = await useApiFetch('/admin/orders', {
    query,
    headers: {
      Accept: 'application/json',
    },
  })

  if (result?.error.value) {
    toast.error(result.error.value?.data.errors)
    return
  }

  data.value = (result.data.value as any).data.data as OrderData[]
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

    const result = await useApiFetch('/admin/orders?ids=' + ids.join(','), {
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

function showDetail(orderId: number) {
  orderIdToShow.value = orderId
  showModalOrderDetail.value = true
}

onMounted(() => {
  getData(route.query);
})
</script>

<template>
  <div class="p-4 pt-0">
    <Teleport to="body">
      <ModalsOrderDetail @close="() => {
        orderIdToShow = 0
        showModalOrderDetail = false
      }" :order-id="orderIdToShow" v-if="showModalOrderDetail" />
    </Teleport>


    <DataTable title="Orders" :columns="columns" :data="data" :pagination-info="paginationInfo"
      :get-data-loading="getDataLoading" @rerender="getData" @edit="edit" @remove="(ids) => remove(ids)"
      @create="showModal = true" no-create no-edit no-delete no-selection>
      <template #toolbar>
      </template>

      <template #cell-actions="{ row }">
        <button class="btn-info btn btn-sm" title="Open Detail order" @click.stop="() => showDetail(row.original.id)">
          <Icon name="fluent:apps-list-detail-24-filled" size="20" />
        </button>
      </template>
    </DataTable>
  </div>
</template>
