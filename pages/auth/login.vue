<script lang="ts" setup>
const auth = useAuthStore();

definePageMeta({
  name: "SigninPage",
  layout: false,
  middleware: ["guest"],
});

const route = useRoute();
const showPassword = ref(false);
const showUnauthAlert = ref(route.query["unauth-alert"]);
const errorMsg = ref<{
  name: string[];
  email: string[];
  password: string[];
}>();
const form = ref({
  email: "",
  password: "",
});

function toggleShowPassword() {
  showPassword.value = !showPassword.value;
}
async function submit() {
  const result = await auth.login(form.value);

  if (result?.error.value) {
    errorMsg.value = result.error.value?.data.errors;
    return;
  }
}

watch(
  () => auth.isLoggedIn,
  () => {
    if (auth.isLoggedIn) {
      navigateTo(auth.user?.is_admin === "1" ? "/admin" : "/");
    }
  }
);
</script>

<template>
  <main
    id="signin-page"
    class="w-100 min-vh-100 bg-light d-grid place-items-center"
  >
    <div
      class="container bg-white p-5 rounded shadow-lg"
      style="max-width: 500px"
    >
      <!-- Alert -->
      <div
        class="alert alert-warning text-sm p-2 text-center"
        role="alert"
        v-if="showUnauthAlert"
      >
        You need to sign in first
      </div>

      <div
        class="mb-4 d-flex justify-content-center flex-column align-items-center"
      >
        <NuxtLink to="/">
          <img width="86" height="86" src="/logo.svg" alt="nuxt logo" />
        </NuxtLink>
        <div class="text-center text-3xl font-weight-bold mb-3">Sign in</div>
        <p class="text-muted text-sm text-center">Welcome back!</p>
      </div>
      <!-- Form -->
      <form @submit.prevent="submit" class="d-flex flex-column gap-3">
        <!-- Input Email -->
        <div class="form-group">
          <label for="email">Email address</label>
          <input
            type="email"
            class="form-control"
            id="email"
            name="email"
            aria-describedby="email_help"
            required
            v-model="form.email"
          />
          <small
            id="email_help"
            class="form-text text-danger text-xs d-block"
            v-if="errorMsg?.email"
            v-for="message in errorMsg?.email"
            >{{ message }}</small
          >
        </div>

        <!-- Input Password -->
        <div class="form-group">
          <label for="password">Password</label>
          <div class="d-flex align-items-center">
            <input
              :type="showPassword ? 'text' : 'password'"
              class="form-control me-2"
              id="password"
              name="password"
              aria-describedby="password_help"
              required
              v-model="form.password"
            />
            <button
              class="btn btn-success btn-sm px-2 py-2"
              type="button"
              @click="toggleShowPassword"
            >
              <eye-icon v-show="!showPassword" />
              <eye-icon-slash v-show="showPassword" />
            </button>
          </div>
          <small
            id="password_help"
            class="form-text text-danger text-xs d-block"
            v-if="errorMsg?.password"
            v-for="message in errorMsg?.password"
            >{{ message }}</small
          >
        </div>

        <!-- Submit Button -->
        <div
          class="w-100 mt-4 d-flex justify-content-center flex-column align-items-center"
        >
          <button type="submit" class="btn btn-success w-100 mb-3">
            Sign in
          </button>
          <!-- <button
            type="button"
            class="btn btn-secondary w-100 mb-3 d-flex align-items-center justify-content-center"
          >
            <img
              class="me-2"
              width="16"
              height="16"
              src="/google.svg"
              alt="google icon"
            />
            Continue with Google
          </button> -->
          <p class="text-sm">
            Don't have an account?
            <NuxtLink to="/auth/register"> sign up</NuxtLink>
          </p>
        </div>
      </form>
    </div>
  </main>
</template>

<style></style>
