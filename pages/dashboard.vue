<template>
  <div>This is dashboard page</div>

  {{ addresses }}
</template>

<script lang="ts" setup>
const addresses = ref();

async function getAddresses() {
  const { data } = await useApiFetch("/api/v1/addresses/coba", {
    headers: {
      Accept: "application/json",
    },
  });

  addresses.value = data;
}

onMounted(async () => {
  await getAddresses();
});
</script>

<style></style>
