<script lang="ts" setup>
definePageMeta({
  layout: "admin",
  middleware: ["is-admin"],
});

useHead({
  title: "Admin · Books",
});

const route = useRoute();
const router = useRouter();
const bookResponse = ref<BookResponse>();
const sizePerPage = ref(20);
const currentPage = ref(0);
const selectedIds = ref<number[]>([]);
const showAddBookModal = ref(false);
const searchInput = ref("");

async function getBooks() {
  await useApiFetch("/sanctum/csrf-cookie");

  const params = new URLSearchParams({
    page: currentPage.value.toString(),
    sizePerPage: sizePerPage.value.toString(),
    q: searchInput.value,
  });

  const result = await useApiFetch("/api/v1/admin/books?" + params, {
    headers: {
      Accept: "application/json",
    },
  });

  if (result?.error.value) {
    alert(result.error.value?.data.errors);
    return;
  }
  bookResponse.value = result.data.value as BookResponse;
}

async function deleteBooks() {
  let message = "";
  if (selectedIds.value.length === 1) {
    message = `Are you sure you want to delete a book with id ${selectedIds.value[0]}?`;
  } else if (selectedIds.value.length === 2) {
    message = `Are you sure want to delete a books with id ${selectedIds.value[0]} and ${selectedIds.value[1]}?`;
  } else {
    const lastId = selectedIds.value[selectedIds.value.length - 1];
    const idsString = selectedIds.value
      .slice(0, selectedIds.value.length - 1)
      .join(", ");
    message = `Are you sure you want to delete books with id ${idsString}, and ${lastId}?`;
  }

  if (confirm(message)) {
    await useApiFetch("/sanctum/csrf-cookie");

    const result = await useApiFetch(
      "/api/v1/admin/books?ids=" + selectedIds.value.join(","),
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (result?.error.value) {
      alert(result.error.value?.data.errors);
      return;
    }

    selectedIds.value = [];
    await getBooks();
  } else {
    selectedIds.value = [];
  }
}

watch([sizePerPage, currentPage], async () => {
  await getBooks();
});

onMounted(async () => {
  if (route.query.redirectToPage) {
    currentPage.value = parseInt(route.query.redirectToPage.toString());
  } else {
    currentPage.value = 1;
  }

  await getBooks();
});
</script>

<template>
  <div
    :style="{
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
      overflow: 'auto',
    }"
    class="p-4 pt-0"
  >
    <Teleport to="body">
      <ModalsAddBookModal
        v-if="showAddBookModal"
        @close="showAddBookModal = false"
      />
    </Teleport>

    <div class="w-100">
      <div class="datatable-toolbar d-flex align-items-center mb-3 p-2 gap-2">
        <!-- Search bar -->
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            placeholder="Search"
            aria-label="Search"
            aria-describedby="button-search"
            v-model="searchInput"
            @keyup.enter="getBooks"
          />
          <button
            class="btn btn-primary"
            type="button"
            id="button-search"
            @click="getBooks"
          >
            <SearchIcon width="20" height="20" />
          </button>
        </div>

        <!-- Size Per Page -->
        <div class="dropdown">
          <button
            class="btn btn-primary dropdown-toggle"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Size per page
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
            <li>
              <button
                class="dropdown-item"
                @click="
                  () => {
                    currentPage = 1;
                    sizePerPage = 20;
                  }
                "
              >
                20
              </button>
            </li>
            <li>
              <button
                class="dropdown-item"
                @click="
                  () => {
                    currentPage = 1;
                    sizePerPage = 50;
                  }
                "
              >
                50
              </button>
            </li>
            <li>
              <button
                class="dropdown-item"
                @click="
                  () => {
                    currentPage = 1;
                    sizePerPage = 100;
                  }
                "
              >
                100
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div class="card">
        <h5
          class="card-header d-flex align-items-center justify-content-between"
        >
          <div class="fs-5">Books</div>
          <div class="d-flex align-items-center gap-2">
            <button
              class="btn btn-primary btn-sm"
              @click="showAddBookModal = true"
            >
              <PlusIcon />
            </button>
            <button
              class="btn btn-success btn-sm"
              :disabled="!selectedIds.length"
              @click="
                $router.push(
                  `/admin/books/${selectedIds[0]}/edit?redirectPage=${currentPage}`
                )
              "
            >
              <PencilIcon />
            </button>
            <button
              class="btn btn-danger btn-sm"
              :disabled="!selectedIds.length"
              @click="deleteBooks"
            >
              <TrashIcon />
              ({{ selectedIds.length }})
            </button>
            <button
              class="btn btn-light btn-sm d-flex align-items-center gap-2"
              @click="selectedIds = []"
              :disabled="!selectedIds.length"
            >
              <XIcon />
              Unselect all
            </button>
          </div>
        </h5>
        <div
          class="table-responsive text-nowrap"
          style="max-height: calc(100vh - 300px)"
        >
          <table class="table table-striped" v-if="bookResponse">
            <thead>
              <tr>
                <th>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      @change="(e) => {
                        if((e.target as HTMLInputElement).checked && bookResponse) {
                          selectedIds = bookResponse?.data.data.map(item => item.id);
                        } else selectedIds = [];
                      }"
                      :checked="
                        selectedIds.length === bookResponse.data.data.length
                      "
                      style="transform: scale(1.4)"
                    />
                  </div>
                </th>
                <th>ID</th>
                <th>Author ID</th>
                <th>Genre ID</th>
                <th>Title</th>
                <th>Cover</th>
                <th>Published Date</th>
                <th>Price</th>
                <th>Stock Qty</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Deleted At</th>
              </tr>
            </thead>
            <tbody class="table-border-bottom-0">
              <tr v-for="book in bookResponse?.data.data">
                <td>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      @change="(e) => {
                        if((e.target as HTMLInputElement).checked) {
                          selectedIds.push(book.id);
                        } else selectedIds = selectedIds.filter(item => item !== book.id);
                      }"
                      :checked="selectedIds.includes(book.id)"
                      :id="`mark-${book.id}`"
                      style="transform: scale(1.4)"
                    />
                  </div>
                </td>
                <td>{{ book.id }}</td>
                <td>{{ book.author_id }}</td>
                <td>{{ book.genre_id }}</td>
                <td>{{ book.title }}</td>
                <td>
                  <img
                    style="max-height: calc(60px - 16px)"
                    :src="book.cover_image"
                    :alt="`${book.title}'s cover image`"
                    v-if="book.cover_image"
                  />
                </td>
                <td>{{ book.published_date }}</td>
                <td>{{ book.price }}</td>
                <td>{{ book.stock_qty }}</td>
                <td>{{ book.created_at }}</td>
                <td>{{ book.updated_at }}</td>
                <td>{{ book.deleted_at ?? "-" }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Table Loading placeholder-->
          <div
            :style="{
              height: '100vh',
              width: '100%',
              display: 'grid',
              placeItems: 'center',
            }"
            v-else
          >
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="d-flex justify-content-between mt-2">
        <div v-if="bookResponse">
          Showing
          {{
            bookResponse?.data.per_page! * bookResponse?.data.current_page!
          }}/{{ bookResponse?.data.total }} entries
        </div>
        <div v-else>Loading...</div>

        <!-- Pagination nav -->
        <nav>
          <ul class="pagination pagination-sm">
            <li class="page-item" v-for="page in bookResponse?.data.links">
              <div
                :class="[
                  'page-link',
                  page.active ? 'active' : '',
                  page.url ? '' : 'disabled',
                ]"
                style="cursor: pointer"
                @click="
                  currentPage = page.label.includes('Prev')
                    ? bookResponse?.data.current_page! - 1
                    : page.label.includes('Next')
                    ? bookResponse?.data.current_page! + 1
                    : parseInt(page.label)
                "
                :title="`page ${page.label.includes('Prev') ? bookResponse?.data.current_page! - 1 : page.label.includes('Next') ? bookResponse?.data.current_page! + 1 : parseInt(page.label)}`"
              >
                {{
                  page.label
                    .replaceAll("&amp;laquo;", "")
                    .replaceAll("&amp;raquo;", "")
                }}
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<style></style>
