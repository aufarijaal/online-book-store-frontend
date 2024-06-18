<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm, useField } from 'vee-validate';
import { z } from 'zod';

const auth = useAuthStore()

const validationSchema = toTypedSchema(
    z.object({
        email: z.string().email(),
    })
);

const { handleSubmit, errors, resetForm, isFieldDirty } = useForm({
    validationSchema,
    initialValues: {
        email: auth.user?.email
    }
});

const { value: email } = useField('email');

const rootError = ref("")
const submitLoading = ref(false)

const submit = handleSubmit(async (values) => {
    submitLoading.value = true
    await useApiFetch('/csrf-cookie')

    const result = await useApiFetch(`/account/update-email`, {
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
    <form id="form-update-email" style="max-width: 400px" @submit.prevent="submit">
        <div class="form-text text-danger mb-2">{{ rootError }}</div>

        <InputFieldTopLabel v-model="email" id="email" html-label="Email" :error="errors.email" />

        <button type="submit" class="btn btn-primary" :disabled="!isFieldDirty('email')">
            Update email
        </button>
    </form>
</template>
