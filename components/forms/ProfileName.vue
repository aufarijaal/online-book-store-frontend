<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm, useField } from 'vee-validate';
import { z } from 'zod';

const auth = useAuthStore()

const validationSchema = toTypedSchema(
    z.object({
        name: z.string(),
    })
);

const { handleSubmit, errors, resetForm, isFieldDirty } = useForm({
    validationSchema,
    initialValues: {
        name: auth.user?.name
    }
});

const { value: name } = useField('name');

const rootError = ref("")
const submitLoading = ref(false)

const submit = handleSubmit(async (values) => {
    submitLoading.value = true
    await useApiFetch('/csrf-cookie')

    const result = await useApiFetch(`/account/update-name`, {
        headers: {
            Accept: 'application/json',
        },
        method: 'PATCH',
        body: values,
    })

    if (result?.error.value) {
        rootError.value = result.error.value.data.message
        return
    }

    submitLoading.value = false

    resetForm()
})
</script>

<template>
    <form id="form-update-name" style="max-width: 400px" @submit.prevent="submit">
        <div class="form-text text-danger mb-2">{{ rootError }}</div>

        <InputFieldTopLabel v-model="name" id="name" html-label="Name" :error="errors.name" />

        <button type="submit" class="btn btn-primary" :disabled="!isFieldDirty('name')">
            Update name
        </button>
    </form>
</template>
