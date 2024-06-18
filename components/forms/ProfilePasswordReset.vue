<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { useForm, useField } from 'vee-validate';
import { z } from 'zod';

const validationSchema = toTypedSchema(
    z.object({
        old_password: z.string(),
        password: z.string().min(1, { message: 'Password must be at least 6 characters' }),
        password_confirmation: z.string().min(1, { message: 'Password must be at least 6 characters' }),
    }).superRefine(({ password, password_confirmation }, ctx) => {
        if (password_confirmation !== password) {
            ctx.addIssue({
                code: "custom",
                message: "The passwords did not match",
                path: ['password_confirmation']
            });
        }
    })
);

const { handleSubmit, errors, resetForm } = useForm({
    validationSchema,
});

const { value: old_password } = useField('old_password');
const { value: password } = useField('password');
const { value: password_confirmation } = useField('password_confirmation');

const rootError = ref("")
const submitLoading = ref(false)

const submit = handleSubmit(async (values) => {
    submitLoading.value = true
    await useApiFetch('/csrf-cookie')

    const result = await useApiFetch(`/account/update-password`, {
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
    <form id="form-update-password" style="max-width: 400px" @submit.prevent="submit">
        <div class="form-text text-danger mb-2">{{ rootError }}</div>

        <InputFieldTopLabel type="password" v-model="old_password" id="old-password" html-label="Old Password"
            :error="errors.old_password" />
        <InputFieldTopLabel type="password" v-model="password" id="password" html-label="New Password"
            :error="errors.password" />
        <InputFieldTopLabel type="password" v-model="password_confirmation" id="password-confirm"
            html-label="New Password Confirmation" :error="errors.password_confirmation" />

        <button type="submit" class="btn btn-primary">
            Update Password
        </button>
    </form>
</template>
