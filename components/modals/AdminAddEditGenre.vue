<script lang="ts" setup>
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const props = defineProps<{
  existing?: {
    id: number
    name: string
    description: string
  }
}>()
const emits = defineEmits(['refresh', 'cancel'])

const validationSchema = toTypedSchema(
  z.object({
    id: z.nullable(z.number()),
    name: z.string().min(1, { message: 'This field is required' }),
    description: z.string().min(1, { message: 'This field is required' }).max(255),
  })
);

const { handleSubmit, errors } = useForm({
  validationSchema,
  initialValues: {
    id: props.existing?.id ?? 0,
    name: props.existing?.name ?? "",
    description: props.existing?.description ?? "",
  }
});

const { value: name } = useField('name');
const { value: dob } = useField('dob');
const { value: description } = useField('description');

const rootError = ref("")
const submitLoading = ref(false)

const submit = handleSubmit(async (values) => {
  submitLoading.value = true
  await useApiFetch('/csrf-cookie')

  const result = await useApiFetch('/admin/genres' + (props.existing && props.existing.id ? `/${props.existing.id}` : ''), {
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
  <ModalsBaseModal :title="existing && existing.id ? 'Edit genre' : 'Add new genre'" @close="$emit('cancel')">
    <div class="mb-3" v-if="rootError">
      <small class="text-danger">{{ rootError }}</small>
    </div>

    <form class="d-flex flex-column gap-2" id="add-genre-form" @submit.prevent="submit">
      <InputField v-model="name" label="Name" :error="errors.name" id="name" ariaDescribedby="nameHelp" />
      <div class="form-floating">
        <textarea v-model="description" class="form-control" placeholder="Type description here" id="description"
          maxlength="255"></textarea>
        <label for="description">Description</label>
      </div>
    </form>

    <template #actions>
      <button type="submit" form="add-genre-form" class="btn btn-primary btn-sm">Submit</button>
    </template>
  </ModalsBaseModal>
</template>
