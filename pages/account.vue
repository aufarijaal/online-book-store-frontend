<script lang="ts" setup>
definePageMeta({
  name: "AccountPage",
  middleware: ["auth"],
});

useHead({
  title: "My Account · BookStore",
});

const route = useRoute();
const tab = computed(() => {
  return route.query.tab ?? "profile";
});
</script>

<template>
  <div id="acount-page">
    <main class="container" style="padding-top: 100px">
      <div class="p-4">
        <ul class="nav nav-pills nav-fill pb-4 border-bottom">
          <li class="nav-item">
            <NuxtLink
              to="/account?tab=profile"
              :class="['nav-link', tab === 'profile' ? 'active' : '']"
              aria-current="page"
              >Profile</NuxtLink
            >
          </li>
          <li class="nav-item">
            <NuxtLink
              to="/account?tab=address"
              :class="['nav-link', tab === 'address' ? 'active' : '']"
              >Addresses</NuxtLink
            >
          </li>
        </ul>

        <div class="p-2">
          <AddressTab v-if="tab === 'address'" />
          <ProfileTab v-else />
        </div>
      </div>
    </main>
  </div>
</template>

<style></style>
