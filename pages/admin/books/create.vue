<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { useForm, useField } from 'vee-validate';

definePageMeta({
    layout: 'admin',
    middleware: ['authenticated', 'admin'],
})

useHead({
    title: 'Admin · Create a book',
})

const validationSchema = toTypedSchema(
    z.object({
        author_id: z.number().min(1, { message: "This field is required" }),
        genre_id: z.number().min(1, { message: "This field is required" }),
        title: z.string().min(1, { message: "This field is required" }),
        published_date: z.string(),
        price: z.number({ message: "This field is required" }),
        stock_qty: z.number().min(0, { message: "Cannot less than zero" }),
    })
);

const { handleSubmit, errors, resetForm } = useForm({
    validationSchema,
    initialValues: {
        stock_qty: 1,
        price: 0
    }
});

const { value: title } = useField('title');
const { value: authorId } = useField('author_id');
const { value: genreId } = useField('genre_id');
const { value: publishedDate } = useField('published_date');
const { value: price } = useField('price');
const { value: stock } = useField('stock_qty');

const rootError = ref("")
const submitLoading = ref(false)
const inputCover = ref<any>()
const preview = ref("")
const router = useRouter()

function handleInputCoverChange(event: any) {
    const file = event.target.files[0]
    if (file) preview.value = URL.createObjectURL(file)
}

function resetInputCover() {
    inputCover.value = null
    preview.value = ""
}

function formReset() {
    resetForm()
    inputCover.value = null
}

const submit = handleSubmit(async (values) => {
    submitLoading.value = true
    await useApiFetch('/csrf-cookie')

    const formData = new FormData();
    for (const [key, value] of Object.entries(values)) {
        formData.append(key, value as any);
    }

    formData.append(
        "cover_image",
        inputCover.value?.files?.length
            ? (inputCover.value?.files[0] as any)
            : null
    );

    const result = await useApiFetch('/admin/books', {
        method: 'POST',
        body: formData,
        headers: {
            Accept: 'application/json',
        },
    })

    if (result?.error.value) {
        rootError.value = result.error.value.data.message
        return
    }

    submitLoading.value = false

    router.replace('/admin/books')
})
</script>

<template>
    <div class="p-4 pt-2 d-flex flex-column gap-2 align-items-start" style="max-width: 80rem; margin: 0 auto;">
        <button class="btn btn-sm btn-primary" @click="$router.back()">
            <Icon name="mdi:arrow-left" size="20" />
            Back
        </button>

        <div class="mt-2">
            <h5 class="fw-bold">Create a new book</h5>
        </div>

        <div>{{ rootError }}</div>

        <form id="add-book-form" @submit.prevent="submit" enctype="multipart/form-data" class="w-100 row">
            <div class="col d-flex flex-column gap-2">
                <AuthorSelector v-model="authorId" :error="errors.author_id" />
                <GenreSelector v-model="genreId" :error="errors.genre_id" />

                <InputField :error="errors.title" v-model="title" ariaDescribedby="titleHelp" label="Title" />

                <InputField :error="errors.published_date" v-model="publishedDate" ariaDescribedby="publishedDateHelp"
                    label="Published Date" type="date" />
                <InputField :error="errors.stock_qty" v-model="stock" ariaDescribedby="stockHelp" label="Stock Quantity"
                    type="number" />
                <InputField :error="errors.price" v-model.number="price" ariaDescribedby="priceHelp" label="Price" />

                <div class="d-flex gap-2">
                    <button type="button" class="btn btn-warning" style="width: max-content"
                        @click="formReset">Reset</button>
                    <button class="btn btn-primary" style="width: max-content">Submit</button>
                </div>
            </div>

            <div class="col-3 flex-column align-items-center justify-content-center gap-2 bg-body-tertiary cursor-pointer"
                :style="{
                    border: '2px dashed var(--bs-light-border-subtle)',
                    display: preview ? 'none' : 'flex'
                }" @click="() => inputCover?.click()">
                <Icon name="ep:picture" size="48" class="text-body-secondary" />
                <div class="text-body-secondary">Select a cover image</div>
                <span style="font-size: 0.75rem;">JPG, PNG (Max 1MB)</span>
                <input class="form-control form-control-sm" id="formFileSm" type="file" hidden ref="inputCover"
                    accept="image/png, image/jpeg, image/jpg" @change="handleInputCoverChange">
            </div>

            <div class="col-3 d-flex align-items-center justify-content-center cursor-pointer flex-column"
                v-if="preview">
                <div class="text-body-secondary fw-bold">Cover image</div>
                <img :src="preview" alt="book cover image preview"
                    style="width: 100%; height: 100%; max-height: 200px; object-fit: contain;" class="my-2">
                <div>
                    <button type="button" class="btn btn-sm btn-primary me-1"
                        @click="inputCover?.click()">Change</button>
                    <button type="button" class="btn btn-sm btn-danger" @click.stop="resetInputCover">Remove</button>
                </div>
            </div>
        </form>
    </div>
</template>
