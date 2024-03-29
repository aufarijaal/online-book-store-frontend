<script setup lang="ts">
const auth = useAuthStore();
const genres = ref();
const q = ref("");
const router = useRouter();
const showModalCartInfo = ref(false);
const mainStore = useMainStore();

async function search() {
  if (!q.value.trim()) return;

  router.push(`/books/search?q=${q.value}`);
}

onMounted(async () => {
  // window.addEventListener("focus", () => {
  //   if (!auth.isLoggedIn) {
  //     navigateTo("/auth/login");
  //   }
  // });

  await useApiFetch("/sanctum/csrf-cookie", {
    headers: {
      Accept: "application/json",
    },
  });
  const { data } = await useApiFetch("/api/v1/genres?getGenreForNav=true");

  genres.value = (data.value as any).data;

  if (auth.isLoggedIn) {
    await mainStore.getCartItemsCount();
  }
});
</script>

<template>
  <div id="default-layout">
    <header>
      <!-- Fixed navbar -->
      <nav
        class="navbar navbar-expand-lg fixed-top bg-dark navbar-dark"
        data-bs-theme="dark"
      >
        <div class="container-fluid">
          <div class="d-flex align-items-center gap-2">
            <img src="/favicon.ico" height="30" />
            <NuxtLink class="navbar-brand" to="/">BookStore</NuxtLink>
          </div>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
            aria-controls="navbarCollapse"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarCollapse">
            <ul class="navbar-nav me-auto mb-2 mb-md-0">
              <li class="nav-item dropdown" data-bs-theme="light">
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Genres
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li v-for="genre in genres">
                    <NuxtLink
                      class="dropdown-item"
                      :to="`/genres/${genre.slug}`"
                      >{{ genre.name }}</NuxtLink
                    >
                  </li>
                </ul>
              </li>
              <li class="nav-item">
                <form class="d-flex" @submit.prevent="search">
                  <input
                    class="form-control me-2"
                    type="search"
                    placeholder="Search book or author..."
                    aria-label="Search"
                    v-model="q"
                  />
                  <button class="btn btn-success" type="submit">Search</button>
                </form>
              </li>
            </ul>
            <ul class="nav justify-content-end">
              <li class="nav-item" v-if="!auth.isLoggedIn">
                <NuxtLink class="nav-link text-white" to="/auth/login"
                  >Login</NuxtLink
                >
              </li>
              <li class="nav-item" v-if="!auth.isLoggedIn">
                <NuxtLink class="nav-link text-white" to="/auth/register"
                  >Register</NuxtLink
                >
              </li>

              <li
                class="nav-item d-flex align-items-center text-white"
                v-if="auth.isLoggedIn"
              >
                <button
                  class="btn"
                  style="position: relative"
                  @click="showModalCartInfo = true"
                >
                  <div id="cart-button" style="position: relative">
                    <CartIcon />
                    <span
                      class="bg-danger p-0 d-flex justify-content-center align-items-center text-xs rounded p-1"
                      style="position: absolute; top: -13px; right: -7px"
                      >{{ mainStore.cartItemsCount }}</span
                    >
                  </div>

                  <Teleport to="body">
                    <ModalsCartInfo
                      v-if="showModalCartInfo"
                      @close="showModalCartInfo = false"
                    />
                  </Teleport>
                </button>
              </li>

              <li
                class="nav-item dropdown"
                v-if="auth.isLoggedIn"
                data-bs-theme="light"
              >
                <a
                  class="nav-link dropdown-toggle text-light"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <CustomerIcon />
                </a>
                <ul
                  class="dropdown-menu dropdown-menu-end"
                  aria-labelledby="navbarDropdown"
                >
                  <li>
                    <NuxtLink to="/my-orders" class="dropdown-item">
                      My Orders
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink to="/account" class="dropdown-item">
                      My Account
                    </NuxtLink>
                  </li>
                  <li><hr class="dropdown-divider" /></li>
                  <li>
                    <button class="dropdown-item fw-bold" @click="auth.logout">
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>

    <slot />
  </div>
</template>
