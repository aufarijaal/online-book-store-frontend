<script lang="ts" setup>
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const props = defineProps<{
  existing?: {
    id: number
    name: string
    email: string
    email_verified_at: string
  }
}>()

const emits = defineEmits(['refresh', 'cancel'])

const validationSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, { message: 'This field is required' }),
    email: z.string().email().min(1, { message: 'This field is required' }),
    set_as_verified: z.boolean(),
  })
);

const { handleSubmit, errors } = useForm({
  validationSchema,
  initialValues: {
    name: props.existing?.name,
    email: props.existing?.email,
    set_as_verified: !!props.existing?.email_verified_at
  }
});

const { value: name } = useField('name');
const { value: email } = useField('email');
const { value: setAsVerified } = useField('set_as_verified');

const rootError = ref("")
const submitLoading = ref(false)

const submit = handleSubmit(async (values) => {
  submitLoading.value = true
  await useApiFetch('/csrf-cookie')

  const result = await useApiFetch(`/admin/customers/${props.existing?.id}`, {
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
  <ModalsBaseModal title="Edit customer" @close="$emit('cancel')">
    <div class="mb-3" v-if="rootError">
      <small class="text-danger">{{ rootError }}</small>
    </div>

    <form class="d-flex flex-column gap-2" id="edit-customer-form" @submit.prevent="submit">
      <InputField v-model="name" label="Name" :error="errors.name" id="name" ariaDescribedby="nameHelp" />
      <InputField v-model="email" type="email" label="Email" :error="errors.email" id="email"
        ariaDescribedby="emailHelp" />
      <InputCheckbox v-model="setAsVerified" ariaDescribedby="setAsVerifiedHelp" :error="errors.set_as_verified"
        id="set-as-verified" label="Set as verified account" />
    </form>

    <template #actions>
      <button type="submit" form="edit-customer-form" class="btn btn-primary btn-sm">Submit</button>
    </template>
  </ModalsBaseModal>
</template>
