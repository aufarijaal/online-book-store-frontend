<script lang="ts" setup>
const addresses = ref<Omit<Address[], 'id'>>()
const existingDataToEdit = ref()
const showModal = ref(false)
const errorMsg = ref('')
const initialLoading = ref(true)

async function getAddresses() {
  initialLoading.value = true
  await useApiFetch('/csrf-cookie')
  const result = await useApiFetch('/addresses')

  if (result.error.value) {
    errorMsg.value = result.error.value.message
    return
  }

  addresses.value = (result.data.value as any).data as Address[]
  initialLoading.value = false
}

async function remove(id: number, addressName: string) {
  if (confirm(`Are you sure want to delete ${addressName} ?`)) {
    await useApiFetch('/csrf-cookie')

    const result = await useApiFetch('/addresses/' + id, {
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
    <Teleport to="body">
      <ModalsAddEditAddress v-if="showModal" @cancel="() => {
        showModal = false
        existingDataToEdit = undefined
      }" @refresh="() => {
        showModal = false
        existingDataToEdit = undefined
        getAddresses()
      }" :existing="existingDataToEdit" />
    </Teleport>

    <!-- Alert -->
    <div class="alert alert-dismissible alert-danger" v-show="errorMsg">
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      <span>{{ errorMsg }}</span>
    </div>

    <div class="placeholder-glow d-flex flex-column gap-1" v-if="initialLoading">
      <div class="placeholder rounded-1" v-for="n in 3" style="width: 100%; height: 82px;"></div>
    </div>

    <ul class="list-group address-list" v-else>
      <AddressItem v-for="(address, i) in addresses" :address="address" @delete="remove(address.id, address.name)"
        @edit="() => {
          existingDataToEdit = address
          showModal = true
        }" :loading="initialLoading" />
    </ul>

    <div class="text-black-50 text-center my-4" v-if="!initialLoading && addresses && !addresses.length">
      You don't have any address yet
    </div>

    <!-- Button trigger modal -->
    <button type="button" class="btn btn-primary" @click="showModal = true" :disabled="initialLoading">
      Add new address
    </button>
  </div>
</template>