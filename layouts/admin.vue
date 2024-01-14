<script lang="ts" setup>
const showSidebar = ref(true);
const auth = useAuthStore();

onMounted(() => {
  document.addEventListener("keyup", (e) => {
    if (e.ctrlKey && e.altKey && e.key === "b") {
      showSidebar.value = !showSidebar.value;
    }
  });
});
</script>

<template>
  <main
    :style="{
      minHeight: '100vh',
      width: '100%',
      display: 'grid',
      gridTemplateColumns: showSidebar ? '280px auto' : '1fr',
      overflow: 'hidden',
    }"
  >
    <Sidebar v-if="showSidebar" />
    <div
      style="width: inherit; height: 100vh; position: relative; overflow: auto"
    >
      <header
        class="p-3 mb-3 border-bottom bg-white"
        style="position: sticky; top: 0; left: 0; z-index: 50"
      >
        <div
          class="d-flex flex-wrap align-items-center justify-content-between"
        >
          <!-- Sidebar toggler -->
          <div
            class="me-4"
            style="cursor: pointer"
            @click="showSidebar = !showSidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M3 4h18v2H3V4Zm0 7h12v2H3v-2Zm0 7h18v2H3v-2Z"
              />
            </svg>
          </div>

          <div class="dropdown text-end">
            <a
              href="#"
              class="d-block link-dark text-decoration-none dropdown-toggle"
              id="dropdownUser1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <CustomerIcon class="text-primary" />
            </a>
            <ul
              class="dropdown-menu text-small"
              aria-labelledby="dropdownUser1"
            >
              <!-- <li><a class="dropdown-item" href="#">Profile</a></li>
              <li><hr class="dropdown-divider" /></li> -->
              <li>
                <a class="dropdown-item" @click="auth.logout">Sign out</a>
              </li>
            </ul>
          </div>
        </div>
      </header>
      <slot />
    </div>
  </main>
</template>

<style></style>
