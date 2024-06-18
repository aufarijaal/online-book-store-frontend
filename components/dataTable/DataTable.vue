<script setup lang="tsx">
import { FlexRender, getCoreRowModel, useVueTable, type ColumnDef, type Row, type RowSelectionState } from '@tanstack/vue-table';
import IndeterminateCheckbox from '../IndeterminateCheckbox.vue';

interface Props {
    columns: ColumnDef<any, any>[]
    data: any[]
    getDataLoading?: boolean
    paginationInfo: PaginationInfo
    title: string
    searchPlaceholder?: string
    noCreate?: boolean
    noEdit?: boolean
    noDelete?: boolean
    noSelection?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    searchPlaceholder: "Search",
})
const emit = defineEmits<{
    (event: 'create'): void;
    (event: 'rerender', value: Filters): void;
    (event: 'edit', data: any): void;
    (event: 'remove', ids: number[]): void;
}>()
const route = useRoute()
const showActionsColumn = computed(() => {
    return !(props.noEdit && props.noDelete) || !!slots['cell-actions'];
});
const slots = useSlots()

const filters = ref({
    q: route.query.q as string ?? "",
    dataPerPage: route.query.dataPerPage ? parseInt(route.query.dataPerPage as string) : 20,
    page: route.query.page ? parseInt(route.query.page as string) : 1,
    sortBy: route.query.sortBy as string ?? "id",
    sortDirection: route.query.sortDirection as SortDirection ?? "asc"
})

const rowSelection = ref<RowSelectionState>({})
const selectedRowsCount = computed(() => Object.keys(rowSelection.value).length)
const tanstackTable = useVueTable({
    get data() {
        return props.data
    },
    columns: [
        {
            id: "select",
            enableHiding: false,
            header: ({ table }: { table: any }) => {
                return (props.noSelection ? null : <IndeterminateCheckbox
                    checked={table.getIsAllRowsSelected()}
                    indeterminate={table.getIsSomeRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                />)
            },
            cell: ({ row }: { row: any }) => {
                return (props.noSelection ? null :
                    <div class="px-1">
                        <IndeterminateCheckbox
                            indeterminate={false}
                            checked={row.getIsSelected()}
                            disabled={!row.getCanSelect()}
                            onChange={row.getToggleSelectedHandler()}
                        ></IndeterminateCheckbox>
                    </div>
                )
            },
            footer: ({ table }: { table: any }) => {
                return (props.noSelection ? null : <IndeterminateCheckbox
                    checked={table.getIsAllRowsSelected()}
                    indeterminate={table.getIsSomeRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                />)
            },
        },
        ...props.columns
    ],
    state: {
        get rowSelection() {
            return rowSelection.value
        },
    },
    enableRowSelection: !props.noSelection, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    onRowSelectionChange: updateOrValue => {
        rowSelection.value =
            typeof updateOrValue === 'function'
                ? updateOrValue(rowSelection.value)
                : updateOrValue
    },
    getCoreRowModel: getCoreRowModel(),
    getRowId: (original, index, parent) => original.id
})

function toggleRowSelection(row: Row<any>) {
    if (row.getCanSelect()) {
        row.toggleSelected()
    }
}

function removeConfirm(ids: number[]) {
    if (confirm(`You are about to delete ${ids.length} record, proceed?`)) {
        emit('remove', ids)
        rowSelection.value = {}
    }
}
</script>

<template>
    <div class="placeholder-glow" v-if="getDataLoading">
        <div style="height: 31px; width: 100%" class="placeholder"></div>
        <div style="height: 31px; width: 100px" class="placeholder mt-2"></div>
        <div style="height: calc(100vh - 300px); width: 100%" class="placeholder mt-2"></div>
        <div style="height: 31px; width: 100%" class="placeholder mt-2"></div>
    </div>

    <div class="datatable-wrapper w-100 d-flex flex-column" v-else>
        <div class="datatable-toolbar-1 mb-2 w-100">
            <form class="row g-1" @submit.prevent="$emit('rerender', filters)">
                <div class="input-group input-group-sm">
                    <input v-model="filters.q" type="search" class="form-control" :placeholder="searchPlaceholder"
                        :aria-label="searchPlaceholder" aria-describedby="button-search">
                    <button class="btn btn-primary" id="button-search">
                        <Icon name="mdi:magnify" size="16" />
                    </button>
                </div>
            </form>
        </div>

        <div class="datatable-toolbar-2 mb-2 w-100">
            <div class="btn-group">
                <button class="btn btn-primary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown"
                    aria-expanded="false">
                    Columns
                </button>
                <ul class="dropdown-menu">
                    <li v-for="(column, i) in tanstackTable.getAllColumns().filter((col) => col.getCanHide())" :key="i">
                        <button class="dropdown-item" @click="() => column.toggleVisibility(!column.getIsVisible())">
                            <Icon name="mdi:check-bold" class="me-2"
                                :style="{ opacity: column.getIsVisible() ? '1' : '0' }" />
                            {{ column.columnDef.header?.toString() }}
                        </button>
                    </li>
                </ul>
            </div>

            <slot name="toolbar" />
        </div>

        <div class="card">
            <h5 class="card-header d-flex align-items-center justify-content-between">
                <div>
                    <span class="fs-5 fw-bold me-2">{{ title }}</span>
                    <span v-if="selectedRowsCount > 0" style="font-size: 12px">{{
                        `${selectedRowsCount} row(s) selected` }}</span>
                </div>

                <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-primary btn-sm" v-if="!noCreate" @click="$emit('create')">
                        <Icon name="mdi:plus" size="20" />
                    </button>
                    <button class="btn btn-danger btn-sm" :disabled="selectedRowsCount === 0"
                        v-if="!noDelete && selectedRowsCount > 1"
                        @click="removeConfirm(Object.keys(rowSelection).map((id) => typeof id === 'string' ? parseInt(id) : id))">
                        <Icon name="mdi:trash" size="20" /> ({{ selectedRowsCount }})
                    </button>
                    <button class="btn btn-light btn-sm d-flex align-items-center gap-2" @click="rowSelection = {}"
                        v-if="tanstackTable.getIsSomeRowsSelected() && !noSelection">
                        <Icon name="mdi:close" size="20" />
                        Unselect all
                    </button>

                    <slot name="actions" />
                </div>
            </h5>
            <div class="table-responsive text-nowrap" style="max-height: calc(100vh - 300px)">
                <table class="table table-hover table-sm">
                    <thead>
                        <tr v-for="headerGroup in tanstackTable.getHeaderGroups()" :key="headerGroup.id">
                            <th v-for="header in headerGroup.headers" :key="header.id" :colSpan="header.colSpan" :style="{
                                textTransform: 'unset',
                                backgroundColor: header.column.id === filters.sortBy ? 'var(--bs-primary-bg-subtle)' : 'initial',
                                cursor: header.column.getCanSort() ? 'pointer' : 'not-allowed'
                            }" @click="() => {
                                if (!header.column.getCanSort()) return
                                filters = {
                                    ...filters,
                                    sortBy: header.column.id,
                                    sortDirection: filters.sortBy === header.column.id && filters.sortDirection === 'asc' ? 'desc' : 'asc'
                                }
                                $emit('rerender', filters)
                            }">
                                <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                                    :props="header.getContext()" />
                                <span class="ms-1">
                                    <Icon name="mdi:chevron-down"
                                        v-if="filters.sortDirection === 'asc' && filters.sortBy === header.column.id" />
                                    <Icon name="mdi:chevron-up"
                                        v-if="filters.sortDirection === 'desc' && filters.sortBy === header.column.id" />
                                </span>
                            </th>
                            <th v-if="showActionsColumn">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="table-border-bottom-0" style="font-size: 12px">
                        <tr v-for="row in tanstackTable.getRowModel().rows" :key="row.id" @click.stop="() => {
                            if (row.getCanSelect()) {
                                toggleRowSelection(row)
                            }
                        }" style="cursor:pointer" :class="{ 'table-active': row.getIsSelected() }">
                            <td v-for="cell in row.getVisibleCells()" :key="cell.id" class="align-middle">
                                <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                            </td>
                            <td v-if="showActionsColumn">
                                <div class="d-flex gap-1 justify-content-center align-items-center">
                                    <button class="btn-success btn btn-sm" v-if="!noEdit"
                                        @click.stop="$emit('edit', row.original)" title="Edit this row">
                                        <Icon name="mdi:pencil" size="20" />
                                    </button>
                                    <button class="btn-danger btn btn-sm" v-if="!noDelete"
                                        @click.stop="removeConfirm([row.original.id])" title="Delete this row">
                                        <Icon name="mdi:trash" size="20" />
                                    </button>
                                    <slot name="cell-actions" :row="row" />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr v-for="headerGroup in tanstackTable.getHeaderGroups()" :key="headerGroup.id">
                            <td v-for="header in headerGroup.headers" :key="header.id" :colSpan="header.colSpan"
                                style="font-weight: 500">
                                <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                                    :props="header.getContext()" />
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

        </div>

        <!-- Table Loading placeholder-->
        <div class="mt-2 d-flex justify-content-between align-items-center">
            <div style=" font-size: 14px;">Showing {{ paginationInfo.from }}-{{ paginationInfo.to }} of {{
                paginationInfo.total }} items</div>

            <div class="d-flex justify-content-between gap-2 align-items-center">
                <div class="d-flex gap-2 align-items-center">
                    <div style="font-size: 14px;">Data per page</div>
                    <div class="btn-group">
                        <button class="btn btn-primary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown"
                            aria-expanded="false">
                            {{ filters.dataPerPage }}
                        </button>
                        <ul class="dropdown-menu">
                            <li v-for="per in [20, 30, 50, 70, 100]" :key="per">
                                <button :class="{ 'dropdown-item': true, 'active': per === filters.dataPerPage }"
                                    @click="() => {
                                        filters = { ...filters, dataPerPage: per, page: 1 }
                                        $emit('rerender', filters)
                                    }">
                                    {{ per }}
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                <nav>
                    <ul class="pagination pagination-sm m-0">
                        <li class="page-item">
                            <button @click="$emit('rerender', { ...filters, page: 1 })" class="page-link">
                                <Icon name="ic:baseline-skip-previous" size="18" />
                            </button>
                        </li>

                        <li :class="{ 'page-item': true, 'disabled': !paginationInfo.hasPrevPage }">
                            <button @click="$emit('rerender', { ...filters, page: paginationInfo.currentPage - 1 })"
                                class="page-link" :disabled="!paginationInfo.hasPrevPage">
                                <Icon name="ic:round-navigate-before" size="18" />
                            </button>
                        </li>

                        <li v-for="item in paginationInfo.pages" :key="item.label"
                            :class="{ 'page-item': true, 'active': item.active }">
                            <button @click="$emit('rerender', { ...filters, page: parseInt(item.label) })"
                                class="page-link" :disabled="item.label === '...'">{{ item.label }}
                            </button>
                        </li>

                        <li :class="{ 'page-item': true, 'disabled': !paginationInfo.hasNextPage }">
                            <button @click="$emit('rerender', { ...filters, page: paginationInfo.currentPage + 1 })"
                                class="page-link" :disabled="!paginationInfo.hasNextPage">
                                <Icon name="ic:round-navigate-next" size="18" />
                            </button>
                        </li>

                        <li class="page-item">
                            <button @click="$emit('rerender', { ...filters, page: paginationInfo.lastPage })"
                                class="page-link">
                                <Icon name="ic:baseline-skip-next" size="18" />
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </div>
</template>
