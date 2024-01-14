<script lang="ts" setup>
interface CustomerResponse {
  message: string;
  data: DataResponse<Customer>;
}

definePageMeta({
  layout: "admin",
  middleware: ["is-admin"],
});

useHead({
  title: "Admin · Customers",
});

const route = useRoute();
const router = useRouter();
const customerResponse = ref<CustomerResponse>();
const sizePerPage = ref(20);
const currentPage = ref(0);
const selectedIds = ref<number[]>([]);
const showAddCustomerModal = ref(false);
const showEditCustomerModal = ref(false);
const showEditCustomerPasswordModal = ref(false);
const searchInput = ref("");
const customerToEdit = ref<
  Omit<
    Customer,
    "created_at" | "updated_at" | "deleted_at" | "password" | "remember_token"
  >
>({
  id: 0,
  name: "",
  email: "",
  email_verified_at: "",
});

async function getCustomers() {
  await useApiFetch("/sanctum/csrf-cookie");

  const params = new URLSearchParams({
    page: currentPage.value.toString(),
    sizePerPage: sizePerPage.value.toString(),
    q: searchInput.value,
  });

  const result = await useApiFetch("/api/v1/admin/customers?" + params, {
    headers: {
      Accept: "application/json",
    },
  });

  if (result?.error.value) {
    alert(result.error.value?.data.errors);
    return;
  }
  customerResponse.value = result.data.value as CustomerResponse;
}

async function editCustomer() {
  await useApiFetch("/sanctum/csrf-cookie");

  const result = await useApiFetch(
    `/api/v1/admin/customers/${selectedIds.value[0]}/edit`,
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

  customerToEdit.value.id = selectedIds.value[0];
  customerToEdit.value.name = (result.data.value as any).data.name;
  customerToEdit.value.email = (result.data.value as any).data.email;
  customerToEdit.value.email_verified_at = (
    result.data.value as any
  ).data.email_verified_at;

  showEditCustomerModal.value = true;
}

async function deleteCustomers() {
  let message = "";
  if (selectedIds.value.length === 1) {
    message = `Are you sure you want to delete a customer with id ${selectedIds.value[0]}?`;
  } else if (selectedIds.value.length === 2) {
    message = `Are you sure want to delete a customers with id ${selectedIds.value[0]} and ${selectedIds.value[1]}?`;
  } else {
    const lastId = selectedIds.value[selectedIds.value.length - 1];
    const idsString = selectedIds.value
      .slice(0, selectedIds.value.length - 1)
      .join(", ");
    message = `Are you sure you want to delete customers with id ${idsString}, and ${lastId}?`;
  }

  if (confirm(message)) {
    await useApiFetch("/sanctum/csrf-cookie");

    const result = await useApiFetch(
      "/api/v1/admin/customers?ids=" + selectedIds.value.join(","),
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
    await getCustomers();
  } else {
    selectedIds.value = [];
  }
}

watch([sizePerPage, currentPage], async () => {
  await getCustomers();
});

onMounted(async () => {
  if (route.query.redirectToPage) {
    currentPage.value = parseInt(route.query.redirectToPage.toString());
  } else {
    currentPage.value = 1;
  }

  await getCustomers();
});
</script>

<template>
  <div class="p-4 pt-0">
    <Teleport to="body">
      <ModalsAddCustomer
        v-if="showAddCustomerModal"
        @close="showAddCustomerModal = false"
        @refresh="getCustomers"
      />
      <ModalsEditCustomer
        v-if="showEditCustomerModal"
        :customer="customerToEdit"
        @close="showEditCustomerModal = false"
        @refresh="getCustomers"
      />
      <ModalsChangePassword
        v-if="showEditCustomerPasswordModal"
        :customerId="selectedIds[0]"
        @close="showEditCustomerPasswordModal = false"
        @refresh="getCustomers"
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
            @keyup.enter="getCustomers"
          />
          <button
            class="btn btn-primary"
            type="button"
            id="button-search"
            @click="getCustomers"
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
          <div class="fs-5">Customers</div>
          <div class="d-flex align-items-center gap-2">
            <button
              class="btn btn-primary btn-sm"
              @click="showAddCustomerModal = true"
            >
              <PlusIcon />
            </button>
            <button
              class="btn btn-success btn-sm"
              :disabled="!selectedIds.length"
              @click="editCustomer"
            >
              <PencilIcon />
            </button>
            <button
              class="btn btn-warning btn-sm"
              title="Reset Password"
              :disabled="!selectedIds.length"
              @click="
                () => {
                  showEditCustomerPasswordModal = true;
                }
              "
            >
              <PasswordIcon />
            </button>
            <button
              class="btn btn-danger btn-sm"
              :disabled="!selectedIds.length"
              @click="deleteCustomers"
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
          <table class="table table-striped" v-if="customerResponse">
            <thead>
              <tr>
                <th>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      @change="(e) => {
                        if((e.target as HTMLInputElement).checked && customerResponse) {
                          selectedIds = customerResponse?.data.data.map(item => item.id);
                        } else selectedIds = [];
                      }"
                      :checked="
                        selectedIds.length === customerResponse.data.data.length
                      "
                      style="transform: scale(1.4)"
                    />
                  </div>
                </th>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Email Verified At</th>
                <th>Remember Token</th>
              </tr>
            </thead>
            <tbody class="table-border-bottom-0">
              <tr v-for="customer in customerResponse?.data.data">
                <td>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      @change="(e) => {
                        if((e.target as HTMLInputElement).checked) {
                          selectedIds.push(customer.id);
                        } else selectedIds = selectedIds.filter(item => item !== customer.id);
                      }"
                      :checked="selectedIds.includes(customer.id)"
                      :id="`mark-${customer.id}`"
                      style="transform: scale(1.4)"
                    />
                  </div>
                </td>
                <td>{{ customer.id }}</td>
                <td>{{ customer.name }}</td>
                <td>{{ customer.email }}</td>
                <td>{{ customer.email_verified_at }}</td>
                <td>{{ customer.remember_token }}</td>
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
        <div v-if="customerResponse">
          Showing
          {{
            customerResponse?.data.per_page! *
            customerResponse?.data.current_page!
          }}/{{ customerResponse?.data.total }} entries
        </div>
        <div v-else>Loading...</div>

        <!-- Pagination nav -->
        <nav>
          <ul class="pagination pagination-sm">
            <li class="page-item" v-for="page in customerResponse?.data.links">
              <div
                :class="[
                  'page-link',
                  page.active ? 'active' : '',
                  page.url ? '' : 'disabled',
                ]"
                style="cursor: pointer"
                @click="
                  currentPage = page.label.includes('Prev')
                    ? customerResponse?.data.current_page! - 1
                    : page.label.includes('Next')
                    ? customerResponse?.data.current_page! + 1
                    : parseInt(page.label)
                "
                :title="`page ${page.label.includes('Prev') ? customerResponse?.data.current_page! - 1 : page.label.includes('Next') ? customerResponse?.data.current_page! + 1 : parseInt(page.label)}`"
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
