<script lang="ts" setup>
const addresses = ref<Omit<Address[], 'id'>>()
const addressToEdit = ref<Address>()
const showEditAddressModal = ref(false)
const errorMsg = ref('')

async function getAddresses() {
  await useApiFetch('/sanctum/csrf-cookie')
  const result = await useApiFetch('/api/v1/addresses')

  if (result.error.value) {
    errorMsg.value = result.error.value.message
    return
  }

  addresses.value = (result.data.value as any).data as Address[]
}

async function remove(id: number, addressName: string) {
  if (confirm(`Are you sure want to delete ${addressName} ?`)) {
    await useApiFetch('/sanctum/csrf-cookie')

    const result = await useApiFetch('/api/v1/addresses/' + id, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    })

    if (result.error.value) {
      errorMsg.value = result.error.value.message
      return
    }

    await getAddresses()
  }
}

onMounted(async () => {
  await getAddresses()
})
</script>

<template>
  <div class="address-tab-content d-flex flex-column gap-2">
    <!-- Alert -->
    <div class="alert alert-dismissible alert-danger" v-show="errorMsg">
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      <span>{{ errorMsg }}</span>
    </div>

    <ul class="list-group address-list">
      <AddressItem
        v-if="addresses"
        v-for="(address, i) in addresses"
        :address="address"
        @delete="remove(address.id, address.name)"
        @edit="
          () => {
            addressToEdit = address
            showEditAddressModal = true
          }
        "
      />
    </ul>

    <!-- Button trigger modal -->
    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addAddressModal">
      Add new address
    </button>
  </div>

  <!-- Modal -->
  <ModalsAddAddress @refresh="getAddresses" />
  <Teleport to="body">
    <ModalsEditAddress
      :address="addressToEdit"
      @close="
        () => {
          addressToEdit = undefined
          showEditAddressModal = false
        }
      "
      @refresh="getAddresses"
      v-if="showEditAddressModal"
    />
  </Teleport>
</template>

<style></style>
