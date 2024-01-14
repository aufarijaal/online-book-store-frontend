<script lang="ts" setup>
const route = useRoute();
const router = useRouter();

definePageMeta({
  layout: "admin",
  middleware: ["is-admin"],
});

useHead({
  title: `Books · ${route.params.id} · Edit`,
});

const form = ref<Omit<Book, "created_at" | "updated_at" | "deleted_at">>({
  id: parseInt(route.params.id as string),
  author_id: 0,
  genre_id: 0,
  title: "",
  published_date: "",
  stock_qty: 0,
  price: 0,
});

const errorMsg = ref<{
  author_id: string[];
  genre_id: string[];
  title: string[];
  published_date: string[];
  stock_qty: string[];
  price: string[];
  cover_image: string[];
}>();
const book = ref<Book>();
const genres = ref<Genre[]>();
const authors = ref<Author[]>();
const coverImageInputRef = ref<HTMLInputElement>();

async function getGenres() {
  await useApiFetch("/sanctum/csrf-cookie");
  const result = await useApiFetch("/api/v1/admin/genres?forDropdown=true", {
    headers: {
      Accept: "application/json",
    },
  });
  if (result?.error.value) {
    alert(result.error.value?.message);
    return;
  }
  genres.value = (result.data.value as any).data as Genre[];
}

async function getAuthors() {
  await useApiFetch("/sanctum/csrf-cookie");

  const result = await useApiFetch("/api/v1/admin/authors?forDropdown=true", {
    headers: {
      Accept: "application/json",
    },
  });

  if (result?.error.value) {
    alert(result.error.value?.message);
    return;
  }

  authors.value = (result.data.value as any).data as Author[];
}

async function getBook() {
  await useApiFetch("/sanctum/csrf-cookie");

  const result = await useApiFetch(
    "/api/v1/admin/books/" + route.params.id + "/edit",
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (result?.error.value) {
    alert(result.error.value?.message);
    return;
  }

  book.value = (result.data.value as any).data as Book;
  form.value.id = book.value.id;
  form.value.author_id = book.value.author_id;
  form.value.genre_id = book.value.genre_id;
  form.value.title = book.value.title;
  form.value.published_date = book.value.published_date;
  form.value.stock_qty = book.value.stock_qty;
  form.value.price = book.value.price;
}

async function submit() {
  await useApiFetch("/sanctum/csrf-cookie");

  const formData = new FormData();
  for (const [key, value] of Object.entries(form.value)) {
    formData.append(key, value as any);
  }

  if (coverImageInputRef.value?.files?.length) {
    formData.append("cover_image", coverImageInputRef.value?.files[0] as any);
  }

  formData.append("_method", "PUT");

  const result = await useApiFetch("/api/v1/admin/books/" + route.params.id, {
    method: "POST",
    body: formData,
    headers: {
      Accept: "application/json",
    },
  });

  if (result?.error.value) {
    alert(result.error.value.message);
    errorMsg.value = result.error.value?.data.errors;
    return;
  }

  router.push(`/admin/books?redirectToPage=${route.query.redirectPage}`);
}

onMounted(async () => {
  await getBook();
  await getGenres();
  await getAuthors();
});
</script>

<template>
  <div
    :style="{
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
      overflow: 'auto',
    }"
    class="p-4 pt-0"
  >
    <button
      class="btn btn-primary btn-sm d-flex align-items-center gap-2"
      @click="$router.back"
    >
      <ArrowLeftIcon />
      Back
    </button>

    <div class="row">
      <form class="row g-3 col-md-8" @submit.prevent="submit">
        <!-- Title -->
        <div class="col-md-12">
          <label for="title" class="form-label">Title</label>
          <input
            type="text"
            :class="['form-control', errorMsg?.title ? 'is-invalid' : '']"
            id="title"
            aria-describedby="titleValidationFeedback"
            required
            v-model="form.title"
          />
          <div
            id="titleValidationFeedback"
            class="invalid-feedback"
            v-if="errorMsg?.title"
            v-for="message in errorMsg.title"
          >
            {{ message }}
          </div>
        </div>

        <!-- Author -->
        <div class="col-md-6">
          <label for="author" class="form-label">Author</label>
          <select
            :class="['form-select', errorMsg?.author_id ? 'is-invalid' : '']"
            id="author"
            aria-describedby="authorValidationFeedback"
            required
            v-model="form.author_id"
          >
            <option selected disabled>Choose an author</option>
            <option
              v-for="(author, i) in authors"
              :value="author.id"
              :selected="i === 0"
            >
              {{ author.id }} ⠂ {{ author.name }} ⠂ {{ author.nationality }}
            </option>
          </select>
          <div
            id="authorValidationFeedback"
            class="invalid-feedback"
            v-if="errorMsg?.author_id"
            v-for="message in errorMsg.author_id"
          >
            {{ message }}
          </div>
        </div>

        <!-- Genre -->
        <div class="col-md-6">
          <label for="genre" class="form-label">Genre</label>
          <select
            :class="['form-select', errorMsg?.genre_id ? 'is-invalid' : '']"
            id="genre"
            aria-describedby="genreValidationFeedback"
            required
            v-model="form.genre_id"
          >
            <option selected disabled>Choose a genre</option>
            <option
              v-for="(genre, i) in genres"
              :value="genre.id"
              :selected="i === 0"
            >
              {{ genre.id }} ⠂ {{ genre.name }}
            </option>
          </select>
          <div
            id="genreValidationFeedback"
            class="invalid-feedback"
            v-if="errorMsg?.genre_id"
            v-for="message in errorMsg.genre_id"
          >
            {{ message }}
          </div>
        </div>

        <!-- Stock Qty -->
        <div class="col-md-6">
          <label for="stock_qty" class="form-label">Stock Qty</label>
          <input
            type="number"
            :class="['form-control', errorMsg?.stock_qty ? 'is-invalid' : '']"
            id="stock_qty"
            aria-describedby="stockQtyValidationFeedback"
            required
            v-model.number="form.stock_qty"
          />
          <div
            id="stockQtyValidationFeedback"
            class="invalid-feedback"
            v-if="errorMsg?.stock_qty"
            v-for="message in errorMsg.stock_qty"
          >
            {{ message }}
          </div>
        </div>

        <!-- Price -->
        <div class="col-md-6">
          <label for="price" class="form-label">Price</label>
          <div class="input-group has-validation">
            <span
              class="input-group-text rounded-start"
              style="border-top-right-radius: 0; border-bottom-right-radius: 0"
              >Rp</span
            >
            <input
              type="number"
              :class="['form-control', errorMsg?.price ? 'is-invalid' : '']"
              id="price"
              aria-describedby="validationPriceFeedback"
              required
              v-model.number="form.price"
            />
            <div
              id="validationPriceFeedback"
              class="invalid-feedback"
              v-if="errorMsg?.price"
              v-for="message in errorMsg.price"
            >
              {{ message }}
            </div>
          </div>
        </div>

        <!-- Cover Image -->
        <div class="col-md-12">
          <label for="cover_image" class="form-label">Cover</label>
          <div class="input-group has-validation">
            <input
              :class="[
                'form-control',
                errorMsg?.cover_image ? 'is-invalid' : '',
              ]"
              type="file"
              id="cover_image"
              ref="coverImageInputRef"
              accept="image/*"
            />
            <div
              id="validationCoverImageFeedback"
              class="invalid-feedback"
              v-if="errorMsg?.cover_image"
              v-for="message in errorMsg.cover_image"
            >
              {{ message }}
            </div>
          </div>
          <div class="form-text d-block text-xs" v-if="!errorMsg?.cover_image">
            Upload an image to replace the current cover.
          </div>
        </div>

        <!-- Published Date -->
        <div class="col-md-12">
          <label for="published_date" class="form-label">Published Date</label>
          <div class="input-group has-validation">
            <input
              type="date"
              :class="[
                'form-control',
                errorMsg?.published_date ? 'is-invalid' : '',
              ]"
              id="published_date"
              aria-describedby="validationPublishedDateFeedback"
              required
              v-model="form.published_date"
            />
            <div
              id="validationPublishedDateFeedback"
              class="invalid-feedback"
              v-if="errorMsg?.published_date"
              v-for="message in errorMsg.published_date"
            >
              {{ message }}
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="col-12">
          <button class="btn btn-primary" type="submit">Update</button>
        </div>
      </form>
      <div class="col-md-4 d-none d-md-block">
        <img style="max-width: 100%" :src="book?.cover_image" alt="" />
      </div>
    </div>
  </div>
</template>

<style></style>
