<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { useForm, useField } from 'vee-validate';
import { toast } from 'vue-sonner';

definePageMeta({
  layout: 'admin',
  middleware: ['authenticated', 'admin'],
})

useHead({
  title: 'Admin · Create a book',
})

const route = useRoute()
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

const { handleSubmit, errors, setFieldValue } = useForm({
  validationSchema,
});

const { value: title } = useField('title');
const { value: authorId } = useField('author_id');
const { value: genreId } = useField('genre_id');
const { value: publishedDate } = useField('published_date');
const { value: price } = useField('price');
const { value: stock } = useField('stock_qty');

const rootError = ref("")
const submitLoading = ref(false)
const initialLoading = ref(true)
const router = useRouter()

const submit = handleSubmit(async (values) => {
  submitLoading.value = true
  await useApiFetch('/csrf-cookie')

  const result = await useApiFetch(`/admin/books/${route.params.id}`, {
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
  router.replace('/admin/books')
})

onMounted(async () => {
  try {
    const bookId = route.params.id

    await useApiFetch("/csrf-cookie");

    const result = await useApiFetch(
      "/admin/books/" + bookId + "/edit",
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (result?.error.value) {
      toast.error(result.error.value?.message);
      return;
    }

    const book = (result.data.value as any).data;

    setFieldValue('title', book.title)
    setFieldValue('author_id', book.author_id)
    setFieldValue('genre_id', book.genre_id)
    setFieldValue('published_date', book.published_date)
    setFieldValue('stock_qty', book.stock_qty)
    setFieldValue('price', parseFloat(book.price))

    initialLoading.value = false
  } catch (error: any) {
    toast.error(error)
  }
})
</script>

<template>
  <div class="p-4 pt-2 d-flex flex-column gap-2 align-items-start" style="max-width: 56rem; margin: 0 auto;">
    <button class="btn btn-sm btn-primary" @click="$router.back()">
      <Icon name="mdi:arrow-left" size="20" />
      Back
    </button>

    <div class="mt-2">
      <h5 class="fw-bold">Edit a book</h5>
    </div>

    <div>{{ rootError }}</div>

    <form id="add-book-form" @submit.prevent="submit" enctype="multipart/form-data" class="w-100 row">
      <div class="col d-flex flex-column gap-2">
        <AuthorSelector v-model="authorId" :error="errors.author_id" />
        <GenreSelector v-model="genreId" :error="errors.genre_id" />

        <InputField :error="errors.title" v-model="title" ariaDescribedby="titleHelp" label="Title"
          :loading="initialLoading" />

        <InputField :error="errors.published_date" v-model="publishedDate" ariaDescribedby="publishedDateHelp"
          label="Published Date" type="date" :loading="initialLoading" />
        <InputField :error="errors.stock_qty" v-model="stock" ariaDescribedby="stockHelp" label="Stock Quantity"
          type="number" :loading="initialLoading" />
        <InputField :error="errors.price" v-model.number="price" ariaDescribedby="priceHelp" label="Price"
          :loading="initialLoading" />

        <div class="d-flex gap-2">
          <button class="btn btn-primary" style="width: max-content">Submit</button>
        </div>
      </div>
    </form>
  </div>
</template>
