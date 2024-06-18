<script lang="ts" setup>
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const props = defineProps<{
  existing?: {
    id: number
    name: string
    user_id: number
    full_address: string
    city: string
    state: string
    country: string
    postal_code: string
    is_active: boolean
  }
}>()
const emits = defineEmits(['refresh', 'cancel'])

const validationSchema = toTypedSchema(
  z.object({
    id: z.nullable(z.number()),
    name: z.string().min(1, { message: 'This is required' }),
    user_id: z.number({ message: 'This is required' }),
    full_address: z.string().min(1, { message: 'This is required' }),
    city: z.string().min(1, { message: 'This is required' }),
    state: z.string().min(1, { message: 'This is required' }),
    country: z.string().min(1, { message: 'This is required' }),
    postal_code: z.string().min(1, { message: 'This is required' }),
    is_active: z.boolean(),
  })
);

const { handleSubmit, errors } = useForm({
  validationSchema,
  initialValues: {
    id: props.existing?.id ?? 0,
    name: props.existing?.name,
    user_id: props.existing?.user_id,
    full_address: props.existing?.full_address,
    city: props.existing?.city,
    state: props.existing?.state,
    country: props.existing?.country,
    postal_code: props.existing?.postal_code,
    is_active: props.existing?.is_active ?? false,
  }
});

const { value: name } = useField('name');
const { value: userId } = useField('user_id');
const { value: fullAddress } = useField('full_address');
const { value: city } = useField('city');
const { value: state } = useField('state');
const { value: country } = useField('country');
const { value: postalCode } = useField('postal_code');
const { value: isActive } = useField('is_active');

const rootError = ref("")
const submitLoading = ref(false)

const submit = handleSubmit(async (values) => {
  submitLoading.value = true
  await useApiFetch('/csrf-cookie')

  const result = await useApiFetch('/admin/addresses' + (props.existing && props.existing.id ? `/${props.existing.id}` : ''), {
    method: props.existing && props.existing.id ? 'PUT' : 'POST',
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
  <ModalsBaseModal :title="existing && existing.id ? 'Edit address' : 'Add new address'" @close="$emit('cancel')">
    <div class="mb-3" v-if="rootError">
      <small class="text-danger">{{ rootError }}</small>
    </div>

    <form class="d-flex flex-column gap-2" id="add-address-form" @submit.prevent="submit">
      <CustomerSelector v-model="userId" label="Customer" :error="errors.user_id" id="customer"
        ariaDescribedby="customerHelp" />
      <InputField v-model="name" label="Name" :error="errors.name" id="name" ariaDescribedby="nameHelp" />
      <InputField v-model="fullAddress" label="Full Address" :error="errors.full_address" id="full-address"
        ariaDescribedby="fullAddressHelp" />
      <InputField v-model="city" label="City" :error="errors.city" id="city" ariaDescribedby="cityHelp" />
      <InputField v-model="state" label="State" :error="errors.state" id="state" ariaDescribedby="stateHelp" />
      <CountryCodeSelector v-model="country" />
      <InputField v-model="postalCode" label="Postal Code" :error="errors.postal_code" id="postal-code"
        ariaDescribedby="postalCodeHelp" />
      <InputCheckbox v-model="isActive" ariaDescribedby="isActiveHelp" :error="errors.is_active" id="is-active"
        label="Set as default address" />
    </form>

    <template #actions>
      <button type="submit" form="add-address-form" class="btn btn-primary btn-sm">Submit</button>
    </template>
  </ModalsBaseModal>
</template>
