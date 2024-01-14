<script lang="ts" setup>
const emits = defineEmits(["refresh", "close"]);
const form = ref({
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
}>();

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

async function submit() {
  await useApiFetch("/sanctum/csrf-cookie");

  const formData = new FormData();
  for (const [key, value] of Object.entries(form.value)) {
    formData.append(key, value as any);
  }

  formData.append(
    "cover_image",
    coverImageInputRef.value?.files?.length
      ? (coverImageInputRef.value?.files[0] as any)
      : null
  );

  const result = await useApiFetch("/api/v1/admin/books", {
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
  emits("refresh");
  emits("close");
}

onMounted(async () => {
  await getGenres();
  await getAuthors();
});
</script>

<template>
  <div class="custom-modal-backdrop">
    <div class="custom-modal">
      <div class="custom-modal__header">
        <div>Add new book</div>
        <button
          type="button"
          class="btn-close"
          aria-label="Close"
          @click="$emit('close')"
        ></button>
      </div>

      <div class="custom-modal__body">
        <form
          id="add-book-form"
          @submit.prevent="submit"
          enctype="multipart/form-data"
        >
          <!-- Author Reference -->
          <div class="input-group mb-3">
            <span class="input-group-text fw-bold">Author</span>
            <select class="form-select" v-model="form.author_id" required>
              <option
                v-for="(author, i) in authors"
                :value="author.id"
                :selected="i === 0"
              >
                {{ author.id }} ⠂ {{ author.name }} ⠂ {{ author.nationality }}
              </option>
            </select>
            <div
              class="form-text text-xs text-danger"
              v-if="errorMsg?.author_id"
              v-for="message in errorMsg.author_id"
            >
              {{ message }}
            </div>
          </div>

          <!-- Genre Reference -->
          <div class="input-group mb-3">
            <span class="input-group-text fw-bold">Genre</span>
            <select class="form-select" v-model="form.genre_id" required>
              <option selected>Select genre</option>
              <option
                v-for="(genre, i) in genres"
                :value="genre.id"
                :selected="i === 0"
              >
                {{ genre.id }} ⠂ {{ genre.name }}
              </option>
            </select>

            <div
              class="form-text text-xs text-danger"
              v-if="errorMsg?.genre_id"
              v-for="message in errorMsg?.genre_id"
            >
              {{ message }}
            </div>
          </div>

          <!-- Title -->
          <div class="input-group mb-3">
            <span class="input-group-text fw-bold">Title</span>
            <input
              type="text"
              class="form-control"
              id="title"
              aria-describedby="titleHelp"
              required
              v-model="form.title"
            />
            <div
              id="titleHelp"
              class="form-text text-xs text-danger"
              v-if="errorMsg?.title"
              v-for="message in errorMsg?.title"
            >
              {{ message }}
            </div>
          </div>

          <!-- Published Date -->
          <div class="input-group mb-3">
            <span class="input-group-text fw-bold">Published Date</span>
            <input
              type="date"
              class="form-control"
              id="published_date"
              required
              v-model="form.published_date"
            />
            <div
              class="form-text text-xs text-danger"
              v-if="errorMsg?.published_date"
              v-for="message in errorMsg?.published_date"
            >
              {{ message }}
            </div>
          </div>

          <!-- Stock Qty -->
          <div class="input-group mb-3">
            <span class="input-group-text fw-bold">Stock Qty</span>
            <input
              type="number"
              class="form-control"
              id="stock_qty"
              required
              min="0"
              step="1"
              v-model.number="form.stock_qty"
            />
            <div
              class="form-text text-xs text-danger"
              v-if="errorMsg?.stock_qty"
              v-for="message in errorMsg?.stock_qty"
            >
              {{ message }}
            </div>
          </div>

          <!-- Price -->
          <div class="input-group mb-3">
            <span class="input-group-text fw-bold">Rp </span>
            <input
              type="number"
              class="form-control"
              id="price"
              placeholder="Price"
              required
              min="0"
              v-model.number="form.price"
            />
            <div
              class="form-text text-xs text-danger"
              v-if="errorMsg?.price"
              v-for="message in errorMsg?.price"
            >
              {{ message }}
            </div>
          </div>

          <!-- Cover Image -->
          <div class="input-group mb-3">
            <span class="input-group-text fw-bold">Cover</span>
            <input
              class="form-control"
              type="file"
              id="cover"
              ref="coverImageInputRef"
              accept="image/*"
            />
          </div>
        </form>
      </div>

      <div class="custom-modal__footer">
        <button
          type="button"
          class="btn btn-light btn-sm"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="add-book-form"
          class="btn btn-primary btn-sm"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>
