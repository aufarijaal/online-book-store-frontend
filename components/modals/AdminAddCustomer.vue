<script lang="ts" setup>
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const emits = defineEmits(['refresh', 'cancel'])

const validationSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, { message: 'This field is required' }),
    email: z.string().email().min(1, { message: 'This field is required' }),
    set_as_verified: z.boolean(),
    password: z.string().min(1, { message: 'Password must be at least 6 characters' })
  })
);

const { handleSubmit, errors } = useForm({
  validationSchema,
  initialValues: {
    set_as_verified: false
  }
});

const { value: name } = useField('name');
const { value: email } = useField('email');
const { value: setAsVerified } = useField('set_as_verified');
const { value: password } = useField('password');

const rootError = ref("")
const submitLoading = ref(false)
const showPassword = ref(false)

const submit = handleSubmit(async (values) => {
  submitLoading.value = true
  await useApiFetch('/csrf-cookie')

  const result = await useApiFetch('/admin/customers', {
    method: 'POST',
    body: values,
    headers: {
      Accept: 'application/json',
    },
  })

  if (result?.error.value) {
    rootError.value = result.error.value.data.message
    return
  }

  submitLoading.value = false
  emits('refresh')
})
</script>

<template>
  <ModalsBaseModal title="Add new customer" @close="$emit('cancel')">
    <div class="mb-3" v-if="rootError">
      <small class="text-danger">{{ rootError }}</small>
    </div>

    <form class="d-flex flex-column gap-2" id="add-customer-form" @submit.prevent="submit">
      <InputField v-model="name" label="Name" :error="errors.name" id="name" ariaDescribedby="nameHelp" />
      <InputField v-model="email" type="email" label="Email" :error="errors.email" id="email"
        ariaDescribedby="emailHelp" />
      <InputField v-model="password" label="Password" :error="errors.password"
        :type="showPassword ? 'text' : 'password'" id="password" ariaDescribedby="passwordHelp" />
      <button type="button" class="btn btn-sm btn-secondary" style="width: max-content; font-size: 10px"
        @click="showPassword = !showPassword">{{ (showPassword ? 'Hide' : 'Show') + ' password' }}</button>
      <InputCheckbox v-model="setAsVerified" ariaDescribedby="setAsVerifiedHelp" :error="errors.set_as_verified"
        id="set-as-verified" label="Set as verified account" />
    </form>

    <template #actions>
      <button type="submit" form="add-customer-form" class="btn btn-primary btn-sm">Submit</button>
    </template>
  </ModalsBaseModal>
</template>
