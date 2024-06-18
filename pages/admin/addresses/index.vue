<script setup lang="ts">
import { createColumnHelper } from '@tanstack/vue-table';
import { toast } from 'vue-sonner';

definePageMeta({
    layout: 'admin',
    middleware: ['authenticated', 'admin'],
})

useHead({
    title: 'Admin · Addresses',
})

const columnHelper = createColumnHelper<Address>()
const columns = [
    columnHelper.accessor("id", {
        header: "ID",
        cell: info => info.getValue(),
    }),
    columnHelper.accessor("customer_name" as any, {
        header: "Customer Name",
        cell: info => info.getValue(),
    }),
    columnHelper.accessor("name", {
        header: "Name",
        cell: info => info.getValue(),
    }),
    columnHelper.accessor("full_address", {
        header: "Full Address",
        cell: info => info.getValue(),
    }),
    columnHelper.accessor("city", {
        header: "City",
        cell: info => info.getValue(),
    }),
    columnHelper.accessor("state", {
        header: "State",
        cell: info => info.getValue(),
    }),
    columnHelper.accessor("country", {
        header: "Country",
        cell: info => info.getValue(),
    }),
    columnHelper.accessor("postal_code", {
        header: "Postal Code",
        cell: info => info.getValue(),
    }),
    columnHelper.accessor("is_active", {
        header: "Status",
        cell: info => h("div", {
            class: ["badge rounded-pill", info.getValue() ? "text-bg-success" : "text-bg-secondary"],
            innerHTML: info.getValue() ? "Used" : "Unused"
        }),
    }),
]
const data = ref<Address[]>([])
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

async function getAddresses(query?: Filters) {
    getDataLoading.value = true
    await useApiFetch('/csrf-cookie')

    const result = await useApiFetch('/admin/addresses?', {
        query,
        headers: {
            Accept: 'application/json',
        },
    })

    if (result?.error.value) {
        toast.error(result.error.value?.data.errors)
        return
    }

    data.value = (result.data.value as any).data.data as Address[]
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

        const result = await useApiFetch('/admin/addresses?ids=' + ids.join(','), {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
            },
        })

        if (result?.error.value) {
            toast.error(result.error.value?.data.errors)
            return
        }

        await getAddresses()
    } catch (error: any) {
        toast.error(error)
    } finally {

    }
}

onMounted(() => {
    getAddresses(route.query);
})
</script>

<template>
    <div class="p-4 pt-0">
        <Teleport to="body">
            <ModalsAdminAddEditAddress v-if="showModal" @cancel="() => {
                showModal = false
                existingDataToEdit = undefined
            }" @refresh="() => {
                showModal = false
                existingDataToEdit = undefined
                getAddresses()
            }" :existing="existingDataToEdit" />
        </Teleport>


        <DataTable title="Addresses" :columns="columns" :data="data" :pagination-info="paginationInfo"
            :get-data-loading="getDataLoading" @rerender="getAddresses" @edit="edit" @remove="(ids) => remove(ids)"
            @create="showModal = true">
            <template #toolbar>
            </template>

            <template #actions>
            </template>
        </DataTable>
    </div>
</template>
