<script lang="ts" setup>
import toRupiah from "@develoka/angka-rupiah-js";

interface OrderResponse {
  message: string;
  data: DataResponse<OrderWithCustomer>;
}

definePageMeta({
  layout: "admin",
  middleware: ["is-admin"],
});

useHead({
  title: "Admin · Orders",
});

const route = useRoute();
const router = useRouter();
const orderResponse = ref<OrderResponse>();
const sizePerPage = ref(20);
const currentPage = ref(0);
const selectedIds = ref<number[]>([]);
const showAddOrderModal = ref(false);
const showEditOrderModal = ref(false);
const showOrderDetailModal = ref(false);
const orderIdToShowTheDetail = ref(0);
const searchInput = ref("");
const sort = ref<{ by: string; order: "asc" | "desc" }>({
  by: "id",
  order: "asc",
});
const orderToEdit = ref<
  Pick<Order, "id" | "order_date" | "user_id" | "total_amount">
>({
  id: 0,
  user_id: 0,
  order_date: "",
  total_amount: 0,
});

async function getOrders() {
  await useApiFetch("/sanctum/csrf-cookie");

  const params = new URLSearchParams({
    page: currentPage.value.toString(),
    sizePerPage: sizePerPage.value.toString(),
    q: searchInput.value,
  });

  const result = await useApiFetch("/api/v1/admin/orders?" + params, {
    headers: {
      Accept: "application/json",
    },
  });

  if (result?.error.value) {
    alert(result.error.value?.data.errors);
    return;
  }

  orderResponse.value = result.data.value as OrderResponse;
}

async function editOrder() {
  await useApiFetch("/sanctum/csrf-cookie");

  const result = await useApiFetch(
    `/api/v1/admin/orders/${selectedIds.value[0]}/edit`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (result?.error.value) {
    alert(result.error.value?.data.errors);
    return;
  }

  orderToEdit.value.id = selectedIds.value[0];
  orderToEdit.value.user_id = (result.data.value as any).data.user_id;
  orderToEdit.value.order_date = (result.data.value as any).data.order_date;
  orderToEdit.value.total_amount = (result.data.value as any).data.total_amount;

  showEditOrderModal.value = true;
}

async function deleteOrders() {
  let message = "";
  if (selectedIds.value.length === 1) {
    message = `Are you sure you want to delete a order with id ${selectedIds.value[0]}?`;
  } else if (selectedIds.value.length === 2) {
    message = `Are you sure want to delete a orders with id ${selectedIds.value[0]} and ${selectedIds.value[1]}?`;
  } else {
    const lastId = selectedIds.value[selectedIds.value.length - 1];
    const idsString = selectedIds.value
      .slice(0, selectedIds.value.length - 1)
      .join(", ");
    message = `Are you sure you want to delete orders with id ${idsString}, and ${lastId}?`;
  }

  if (confirm(message)) {
    await useApiFetch("/sanctum/csrf-cookie");

    const result = await useApiFetch(
      "/api/v1/admin/orders?ids=" + selectedIds.value.join(","),
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
    await getOrders();
  } else {
    selectedIds.value = [];
  }
}

watch([sizePerPage, currentPage], async () => {
  await getOrders();
});

onMounted(async () => {
  if (route.query.redirectToPage) {
    currentPage.value = parseInt(route.query.redirectToPage.toString());
  } else {
    currentPage.value = 1;
  }

  await getOrders();
});
</script>

<template>
  <div class="p-4 pt-0">
    <Teleport to="body">
      <ModalsAddOrder
        v-if="showAddOrderModal"
        @close="showAddOrderModal = false"
        @refresh="getOrders"
      />
      <!-- <ModalsEditGenre
        v-if="showEditOrderModal"
        :genre="orderToEdit"
        @close="showEditOrderModal = false"
        @refresh="getOrders"
      /> -->
      <ModalsOrderDetail
        v-if="showOrderDetailModal"
        :order-id="orderIdToShowTheDetail"
        @close="showOrderDetailModal = false"
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
            @keyup.enter="getOrders"
          />
          <button
            class="btn btn-primary"
            type="button"
            id="button-search"
            @click="getOrders"
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

      <!-- Data Table -->
      <div class="card">
        <h5
          class="card-header d-flex align-items-center justify-content-between"
        >
          <div class="fs-5">Orders</div>
          <div class="d-flex align-items-center gap-2">
            <button
              class="btn btn-primary btn-sm"
              @click="showAddOrderModal = true"
            >
              <PlusIcon />
            </button>
            <button
              class="btn btn-success btn-sm"
              :disabled="!selectedIds.length"
              @click="editOrder"
            >
              <PencilIcon />
            </button>
            <button
              class="btn btn-danger btn-sm"
              :disabled="!selectedIds.length"
              @click="deleteOrders"
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
          <table class="table table-striped" v-if="orderResponse">
            <thead>
              <tr>
                <th>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      @change="(e) => {
                        if((e.target as HTMLInputElement).checked && orderResponse) {
                          selectedIds = orderResponse?.data.data.map(item => item.id);
                        } else selectedIds = [];
                      }"
                      :checked="
                        selectedIds.length === orderResponse.data.data.length
                      "
                      style="transform: scale(1.4)"
                    />
                  </div>
                </th>
                <th></th>
                <th>
                  ID
                  <OrderArrow v-if="sort.by === 'id'" :order="sort.order" />
                </th>
                <th>
                  Customer
                  <OrderArrow
                    v-if="sort.by === 'customer_id'"
                    :order="sort.order"
                  />
                </th>
                <th>
                  Order Date
                  <OrderArrow
                    v-if="sort.by === 'order_date'"
                    :order="sort.order"
                  />
                </th>
                <th>
                  Total Amount
                  <OrderArrow
                    v-if="sort.by === 'total_amount'"
                    :order="sort.order"
                  />
                </th>
              </tr>
            </thead>
            <tbody class="table-border-bottom-0">
              <tr v-for="order in orderResponse?.data.data">
                <td>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      @change="(e) => {
                        if((e.target as HTMLInputElement).checked) {
                          selectedIds.push(order.id);
                        } else selectedIds = selectedIds.filter(item => item !== order.id);
                      }"
                      :checked="selectedIds.includes(order.id)"
                      :id="`mark-${order.id}`"
                      style="transform: scale(1.4)"
                    />
                  </div>
                </td>
                <td>
                  <span
                    class="badge bg-primary"
                    style="cursor: pointer"
                    @click="
                      () => {
                        orderIdToShowTheDetail = order.id;
                        showOrderDetailModal = true;
                      }
                    "
                    >See detail</span
                  >
                </td>
                <td>{{ order.id }}</td>
                <td>{{ order.customer.name }}</td>
                <td>{{ order.order_date }}</td>
                <td>
                  {{ toRupiah(order.total_amount, { floatingPoint: 0 }) }}
                </td>
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
        <div v-if="orderResponse">
          Showing
          {{
            orderResponse?.data.per_page! * orderResponse?.data.current_page!
          }}/{{ orderResponse?.data.total }} entries
        </div>
        <div v-else>Loading...</div>

        <!-- Pagination nav -->
        <nav>
          <ul class="pagination pagination-sm">
            <li class="page-item" v-for="page in orderResponse?.data.links">
              <div
                :class="[
                  'page-link',
                  page.active ? 'active' : '',
                  page.url ? '' : 'disabled',
                ]"
                style="cursor: pointer"
                @click="
                  currentPage = page.label.includes('Prev')
                    ? orderResponse?.data.current_page! - 1
                    : page.label.includes('Next')
                    ? orderResponse?.data.current_page! + 1
                    : parseInt(page.label)
                "
                :title="`page ${page.label.includes('Prev') ? orderResponse?.data.current_page! - 1 : page.label.includes('Next') ? orderResponse?.data.current_page! + 1 : parseInt(page.label)}`"
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
