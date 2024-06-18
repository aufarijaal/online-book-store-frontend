<script setup lang="ts">
import { createColumnHelper } from '@tanstack/vue-table';
import dayjs from 'dayjs';
import { toast } from 'vue-sonner';
import toRupiah from "@develoka/angka-rupiah-js"

type BookData = {
  id: number,
  author_id: number,
  author_name: string,
  genre_id: number,
  genre_name: string,
  title: string,
  published_date: string,
  price: number
  stock_qty: number,
  created_at: string,
  cover_image?: string
}

definePageMeta({
  layout: 'admin',
  middleware: ['authenticated', 'admin'],
})

useHead({
  title: 'Admin · Books',
})

const columnHelper = createColumnHelper<BookData>()
const columns = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor("author_name" as any, {
    header: "Author",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor("genre_name", {
    header: "Genre",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor("title", {
    header: "Title",
    cell: info => h('strong', {
      innerText: info.getValue()
    }),
  }),
  columnHelper.accessor("published_date", {
    header: "Published Date",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor("price", {
    header: "Price",
    cell: info => toRupiah(info.getValue(), { floatingPoint: 0 }),
  }),
  columnHelper.accessor("stock_qty", {
    header: "Stock",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor("created_at", {
    header: "Created At",
    cell: info => dayjs(info.getValue()).format("YYYY-MM-DD HH:mm:ss"),
  }),
  columnHelper.accessor("cover_image", {
    header: "Cover",
    cell: info => h("img", {
      src: !info.getValue() ? `/fallback_image.jpg` : `http://localhost:8000/storage/covers/${info.getValue()}`,
      height: '100px',
      width: '50px',
      style: {
        objectFit: 'contain'
      }
    }),
    enableSorting: false,
  }),
]
const data = ref<BookData[]>([])
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
const router = useRouter();
const inputChangeCover = ref<HTMLInputElement>()

async function getData(query?: Filters) {
  getDataLoading.value = true
  await useApiFetch('/csrf-cookie')

  const result = await useApiFetch('/admin/books', {
    query,
    headers: {
      Accept: 'application/json',
    },
  })

  if (result?.error.value) {
    toast.error(result.error.value?.data.errors)
    return
  }

  data.value = (result.data.value as any).data.data as BookData[]
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
  router.push(`/admin/books/${data.id}/edit`)
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

async function removeCover(bookId: number) {
  if (confirm(`Are you sure want to remove cover?`)) {
    await useApiFetch('/csrf-cookie')

    const result = await useApiFetch(`/admin/books/${bookId}/cover`, {
      method: 'DELETE',
    })

    if (result?.error.value) {
      toast.error(result.error.value.data.message)
      return
    }

    getData();
  }
}

async function handleUpdateCover(event: any, params: { id: number, title: string, author_id: number }) {
  await useApiFetch('/csrf-cookie')

  const formData = new FormData();
  for (const [key, value] of Object.entries(params)) {
    formData.append(key, value as any);
  }

  formData.append(
    "cover_image",
    event.target.files[0]
  );

  formData.append(
    "_method",
    "PUT"
  );

  const result = await useApiFetch(`/admin/books/${params.id}/cover`, {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
    },
  })

  if (result?.error.value) {
    toast.error(result.error.value.data.message)
    return
  }

  getData();
}

onMounted(() => {
  getData(route.query);
})
</script>

<template>
  <div class="p-4 pt-0">
    <DataTable title="Books" :columns="columns" :data="data" :pagination-info="paginationInfo"
      :get-data-loading="getDataLoading" @rerender="getData" @edit="edit" @remove="(ids) => remove(ids)"
      @create="() => $router.push('/admin/books/create')">
      <template #toolbar>
      </template>

      <template #cell-actions="{ row }">
        <label :for="`input-change-cover-id-${row.original.id}`"
          :class="['btn btn-sm', row.original.cover_image ? 'btn-success' : 'btn-info']"
          :title="row.original.cover_image ? 'Change cover' : 'Upload a cover'">
          <input type="file" hidden ref="inputChangeCover" :id="`input-change-cover-id-${row.original.id}`"
            accept="image/png, image/jpeg, image/jpg" @change="(e) => handleUpdateCover(e, {
              id: row.original.id,
              title: row.original.title,
              author_id: row.original.author_id
            })">
          <Icon name="mdi:image-edit-outline" size="20" v-if="row.original.cover_image" />
          <Icon name="mdi:image-plus-outline" size="20" v-else />
        </label>
        <button class="btn-danger btn btn-sm" title="Remove cover" :disabled="!row.original.cover_image"
          @click.stop="removeCover(row.original.id)">
          <Icon name="mdi:image-remove-outline" size="20" />
        </button>
      </template>
    </DataTable>
  </div>
</template>
