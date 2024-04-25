<script lang="ts" setup>
interface AddressResponse {
  message: string;
  data: DataResponse<Address>;
}

const auth = useAuthStore();

definePageMeta({
  layout: "admin",
  middleware: ["authenticated", "admin"],
});

useHead({
  title: "Admin · Addresses",
});

const route = useRoute();
const router = useRouter();
const addressResponse = ref<AddressResponse>();
const sizePerPage = ref(20);
const currentPage = ref(0);
const selectedIds = ref<number[]>([]);
const showAddAddressModal = ref(false);
const showEditAddressModal = ref(false);
const searchInput = ref("");
const addressToEdit = ref<Address>({
  id: 0,
  user_id: 0,
  name: "",
  full_address: "",
  city: "",
  state: "",
  country: "",
  postal_code: "",
  is_active: false,
});

async function getAddresss() {
  await useApiFetch("/sanctum/csrf-cookie");

  const params = new URLSearchParams({
    page: currentPage.value.toString(),
    sizePerPage: sizePerPage.value.toString(),
    q: searchInput.value,
  });

  const result = await useApiFetch("/api/v1/admin/addresses?" + params, {
    headers: {
      Accept: "application/json",
    },
  });

  if (result?.error.value) {
    alert(result.error.value?.data.errors);
    return;
  }
  addressResponse.value = result.data.value as AddressResponse;
}

async function editAddress() {
  await useApiFetch("/sanctum/csrf-cookie");

  const result = await useApiFetch(
    `/api/v1/admin/addresses/${selectedIds.value[0]}/edit`,
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

  addressToEdit.value.id = selectedIds.value[0];
  addressToEdit.value.user_id = (result.data.value as any).data.user_id;
  addressToEdit.value.name = (result.data.value as any).data.name;
  addressToEdit.value.full_address = (
    result.data.value as any
  ).data.full_address;
  addressToEdit.value.city = (result.data.value as any).data.city;
  addressToEdit.value.state = (result.data.value as any).data.state;
  addressToEdit.value.country = (result.data.value as any).data.country;
  addressToEdit.value.postal_code = (result.data.value as any).data.postal_code;
  addressToEdit.value.is_active = (result.data.value as any).data.is_active;

  showEditAddressModal.value = true;
}

async function deleteAddresss() {
  let message = "";
  if (selectedIds.value.length === 1) {
    message = `Are you sure you want to delete a address with id ${selectedIds.value[0]}?`;
  } else if (selectedIds.value.length === 2) {
    message = `Are you sure want to delete a addresses with id ${selectedIds.value[0]} and ${selectedIds.value[1]}?`;
  } else {
    const lastId = selectedIds.value[selectedIds.value.length - 1];
    const idsString = selectedIds.value
      .slice(0, selectedIds.value.length - 1)
      .join(", ");
    message = `Are you sure you want to delete addresses with id ${idsString}, and ${lastId}?`;
  }

  if (confirm(message)) {
    await useApiFetch("/sanctum/csrf-cookie");

    const result = await useApiFetch(
      "/api/v1/admin/addresses?ids=" + selectedIds.value.join(","),
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
    await getAddresss();
  } else {
    selectedIds.value = [];
  }
}

watch([sizePerPage, currentPage], async () => {
  await getAddresss();
});

onMounted(async () => {
  if (route.query.redirectToPage) {
    currentPage.value = parseInt(route.query.redirectToPage.toString());
  } else {
    currentPage.value = 1;
  }

  await getAddresss();
});
</script>

<template>
  <div class="p-4 pt-0">
    <Teleport to="body">
      <ModalsAdminAddAddress
        v-if="showAddAddressModal"
        @close="showAddAddressModal = false"
        @refresh="getAddresss"
      />
      <ModalsAdminEditAddress
        v-if="showEditAddressModal"
        :address="addressToEdit"
        @close="showEditAddressModal = false"
        @refresh="getAddresss"
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
            @keyup.enter="getAddresss"
          />
          <button
            class="btn btn-primary"
            type="button"
            id="button-search"
            @click="getAddresss"
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
          <div class="fs-5">Addresses</div>
          <div class="d-flex align-items-center gap-2">
            <button
              class="btn btn-primary btn-sm"
              @click="showAddAddressModal = true"
            >
              <PlusIcon />
            </button>
            <button
              class="btn btn-success btn-sm"
              :disabled="!selectedIds.length"
              @click="editAddress"
            >
              <PencilIcon />
            </button>
            <button
              class="btn btn-danger btn-sm"
              :disabled="!selectedIds.length"
              @click="deleteAddresss"
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
          <table class="table table-striped" v-if="addressResponse">
            <thead>
              <tr>
                <th>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      @change="(e) => {
                        if((e.target as HTMLInputElement).checked && addressResponse) {
                          selectedIds = addressResponse?.data.data.map(item => item.id);
                        } else selectedIds = [];
                      }"
                      :checked="
                        selectedIds.length === addressResponse.data.data.length
                      "
                      style="transform: scale(1.4)"
                    />
                  </div>
                </th>
                <th>ID</th>
                <th>Customer ID</th>
                <th>Name</th>
                <th>Full Address</th>
                <th>City</th>
                <th>State</th>
                <th>Country</th>
                <th>Postal Code</th>
                <th>Is Active</th>
              </tr>
            </thead>
            <tbody class="table-border-bottom-0">
              <tr v-for="address in addressResponse?.data.data">
                <td>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      @change="(e) => {
                        if((e.target as HTMLInputElement).checked) {
                          selectedIds.push(address.id);
                        } else selectedIds = selectedIds.filter(item => item !== address.id);
                      }"
                      :checked="selectedIds.includes(address.id)"
                      :id="`mark-${address.id}`"
                      style="transform: scale(1.4)"
                    />
                  </div>
                </td>
                <td>{{ address.id }}</td>
                <td>{{ address.user_id }}</td>
                <td>{{ address.name }}</td>
                <td>{{ address.full_address }}</td>
                <td>{{ address.city }}</td>
                <td>{{ address.state }}</td>
                <td>{{ address.country }}</td>
                <td>{{ address.postal_code }}</td>
                <td>
                  <div
                    :class="[
                      'box-pulse',
                      address.is_active ? 'bg-success pulse' : 'bg-dark',
                    ]"
                    style="width: 10px; height: 10px; border-radius: 9999px"
                  ></div>
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
        <div v-if="addressResponse">
          Showing
          {{
            addressResponse?.data.per_page! *
            addressResponse?.data.current_page!



          }}/{{ addressResponse?.data.total }} entries
        </div>
        <div v-else>Loading...</div>

        <!-- Pagination nav -->
        <nav>
          <ul class="pagination pagination-sm">
            <li class="page-item" v-for="page in addressResponse?.data.links">
              <div
                :class="[
                  'page-link',
                  page.active ? 'active' : '',
                  page.url ? '' : 'disabled',
                ]"
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
