<script lang="ts" setup>
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const props = defineProps<{
  info?: {
    id: number
    name: string
  }
}>()

const emits = defineEmits(['refresh', 'cancel'])

const validationSchema = toTypedSchema(
  z.object({
    password: z.string().min(1, { message: 'Password must be at least 6 characters' })
  })
);

const { handleSubmit, errors } = useForm({
  validationSchema,
});

const { value: password } = useField('password');

const rootError = ref("")
const submitLoading = ref(false)
const showPassword = ref(false)

const submit = handleSubmit(async (values) => {
  submitLoading.value = true
  await useApiFetch('/csrf-cookie')

  const result = await useApiFetch(`/admin/customers/${props.info?.id}/reset-password`, {
    method: 'PUT',
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
  <ModalsBaseModal :title="`Reset ${info?.name}'s password`" @close="$emit('cancel')">
    <div class="mb-3" v-if="rootError">
      <small class="text-danger">{{ rootError }}</small>
    </div>

    <form class="d-flex flex-column gap-2" id="reset-customer-password-form" @submit.prevent="submit">
      <InputField v-model="password" label="Password" :error="errors.password"
        :type="showPassword ? 'text' : 'password'" id="password" ariaDescribedby="passwordHelp" />
      <button type="button" class="btn btn-sm btn-secondary" style="width: max-content; font-size: 10px"
        @click="showPassword = !showPassword">{{ (showPassword ? 'Hide' : 'Show') + ' password' }}</button>
    </form>

    <template #actions>
      <button type="submit" form="reset-customer-password-form" class="btn btn-primary btn-sm">Submit</button>
    </template>
  </ModalsBaseModal>
</template>
