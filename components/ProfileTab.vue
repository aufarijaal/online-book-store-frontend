<script lang="ts" setup>
const initialEmail = ref('')
const initialName = ref('')

const email = ref('')
const name = ref('')
const errorMsg = ref('')
const oldPassword = ref('')
const newPassword = ref('')
const passwordConfirmation = ref('')

const isNameDirty = computed(() => {
  return name.value !== initialName.value
})

const isEmailDirty = computed(() => {
  return email.value !== initialEmail.value
})

async function getProfileInfo() {
  await useApiFetch('/sanctum/csrf-cookie')

  const result = await useApiFetch('/api/v1/account/profile', {
    headers: {
      Accept: 'application/json',
    },
  })

  if (result?.error.value) {
    errorMsg.value = result?.error.value.message
    return
  }

  initialName.value = (result.data.value as any).data.name
  initialEmail.value = (result.data.value as any).data.email

  name.value = (result.data.value as any).data.name
  email.value = (result.data.value as any).data.email
}

async function resetPassword() {
  await useApiFetch('/sanctum/csrf-cookie')

  const result = await useApiFetch(`/api/v1/account/update-password`, {
    headers: {
      Accept: 'application/json',
    },
    method: 'PATCH',
    body: {
      old_password: oldPassword.value,
      password: newPassword.value,
      password_confirmation: passwordConfirmation.value,
    },
  })

  if (result?.error.value) {
    errorMsg.value = result?.error.value.message
    return
  }

  await getProfileInfo()
  oldPassword.value = ''
  newPassword.value = ''
  passwordConfirmation.value = ''
}

async function updateEmail() {
  await useApiFetch('/sanctum/csrf-cookie')

  const result = await useApiFetch(`/api/v1/account/update-email`, {
    headers: {
      Accept: 'application/json',
    },
    method: 'PATCH',
    body: {
      email: email.value,
    },
  })

  if (result?.error.value) {
    errorMsg.value = result?.error.value.message
    return
  }

  await getProfileInfo()
}

async function updateName() {
  await useApiFetch('/sanctum/csrf-cookie')

  const result = await useApiFetch(`/api/v1/account/update-name`, {
    headers: {
      Accept: 'application/json',
    },
    method: 'PATCH',
    body: {
      name: name.value,
    },
  })

  if (result?.error.value) {
    errorMsg.value = result?.error.value.message
    return
  }

  await getProfileInfo()
}

onMounted(async () => {
  await getProfileInfo()
})
</script>

<template>
  <div class="profile-tab-content d-flex flex-column gap-2 align-items-start">
    <!-- Alert -->
    <div class="alert alert-dismissible alert-danger w-100" v-show="errorMsg">
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      <span>{{ errorMsg }}</span>
    </div>

    <section v-if="name" class="name-section w-100 border-bottom mb-4 pb-4">
      <form id="form-update-name" style="max-width: 400px" @submit.prevent="updateName">
        <div class="mb-3">
          <label for="formGroupExampleInput" class="form-label">Name</label>
          <input
            required
            type="text"
            class="form-control"
            id="formGroupExampleInput"
            placeholder="Change your name"
            v-model="name"
          />
        </div>
        <button type="submit" :class="['btn btn-primary', isNameDirty ? '' : 'disabled']" :disabled="!isNameDirty">
          Update Name
        </button>
      </form>
    </section>

    <section v-if="email" class="email-section w-100 border-bottom mb-4 pb-4">
      <form id="form-update-email" style="max-width: 400px" @submit.prevent="updateEmail">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            required
            type="email"
            class="form-control"
            id="email"
            placeholder="Change your email"
            v-model="email"
          />
        </div>
        <button
          type="submit"
          class="btn btn-primary"
          :class="['btn btn-primary', isEmailDirty ? '' : 'disabled']"
          :disabled="!isEmailDirty"
        >
          Update Email
        </button>
      </form>
    </section>

    <section class="password-section w-100">
      <form id="form-update-password" style="max-width: 400px" @submit.prevent="resetPassword">
        <div class="mb-3">
          <label for="old_password" class="form-label">Old Password</label>
          <input
            required
            type="password"
            class="form-control"
            id="old_password"
            placeholder="Type your old password"
            v-model="oldPassword"
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">New Password</label>
          <input
            required
            type="password"
            class="form-control"
            id="password"
            placeholder="Type your new password"
            v-model="newPassword"
          />
        </div>
        <div class="mb-3">
          <label for="password_confirmation" class="form-label">Confirm New Password</label>
          <input
            required
            type="password"
            class="form-control"
            id="password_confirmation"
            placeholder="New password confirmation"
            v-model="passwordConfirmation"
          />
        </div>
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="
            oldPassword.trim() === '' ||
            newPassword.trim() === '' ||
            passwordConfirmation.trim() === '' ||
            newPassword !== passwordConfirmation
          "
        >
          Update Password
        </button>
        <span role="button" class="text-info text-sm text-decoration-underline ms-4"> I forgot my password </span>
      </form>
    </section>
  </div>
</template>

<style></style>
