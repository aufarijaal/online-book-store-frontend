<script lang="ts" setup>
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const props = defineProps<{
  existing?: {
    id: number
    name: string
    dob: string
    nationality: string
  }
}>()
const emits = defineEmits(['refresh', 'cancel'])

const validationSchema = toTypedSchema(
  z.object({
    id: z.nullable(z.number()),
    name: z.string().min(1, { message: 'This field is required' }),
    dob: z.string({ message: "This field is required" }),
    nationality: z.string().min(1, { message: "This field is required" })
  })
);

const { handleSubmit, errors } = useForm({
  validationSchema,
  initialValues: {
    id: props.existing?.id ?? 0,
    name: props.existing?.name ?? "",
    dob: props.existing?.dob ?? "",
    nationality: props.existing?.nationality ?? ""
  }
});

const { value: name } = useField('name');
const { value: dob } = useField('dob');
const { value: nationality } = useField('nationality');

const rootError = ref("")
const submitLoading = ref(false)

const submit = handleSubmit(async (values) => {
  submitLoading.value = true
  await useApiFetch('/csrf-cookie')

  const result = await useApiFetch('/admin/authors' + (props.existing && props.existing.id ? `/${props.existing.id}` : ''), {
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
  <ModalsBaseModal :title="existing && existing.id ? 'Edit author' : 'Add new author'" @close="$emit('cancel')">
    <div class="mb-3" v-if="rootError">
      <small class="text-danger">{{ rootError }}</small>
    </div>

    <form class="d-flex flex-column gap-2" id="add-author-form" @submit.prevent="submit">
      <InputField v-model="name" label="Name" :error="errors.name" id="name" ariaDescribedby="nameHelp" />
      <InputField v-model="dob" type="date" label="Date of birth" :error="errors.dob" id="dob"
        ariaDescribedby="dobHelp" />
      <InputField v-model="nationality" label="Nationality" :error="errors.nationality" id="nationality"
        ariaDescribedby="nationalityHelp" />
    </form>

    <template #actions>
      <button type="submit" form="add-author-form" class="btn btn-primary btn-sm">Submit</button>
    </template>
  </ModalsBaseModal>
</template>
