<script lang="ts" setup>
import dayjs from 'dayjs'
import toRupiah from '@develoka/angka-rupiah-js'

definePageMeta({
  middleware: ['public-or-not-admin'],
})

const route = useRoute()

const book = ref()
const qty = ref(1)
const mainStore = useMainStore()
const errorMsg = ref('')
const auth = useAuthStore()

useHead({
  title: `Garadia · Book Detail`,
})

async function getBook() {
  await useApiFetch('/sanctum/csrf-cookie')

  const result = await useApiFetch(`/api/v1/books/detail/${route.params.bookSlug}`, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (result?.error.value) {
    errorMsg.value = result.error.value?.data.message
    return
  }

  book.value = (result.data.value as { message: string; data: any }).data
}

async function addToCart() {
  if (!auth.isLoggedIn) {
    return navigateTo('/auth/login')
  }

  await useApiFetch('/sanctum/csrf-cookie')

  const result = await useApiFetch(`/api/v1/carts`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: {
      book_id: book.value.id,
      qty: qty.value,
      item_price: qty.value * book.value.price,
    },
  })

  if (result?.error.value) {
    errorMsg.value = result.error.value?.data.message
    return
  }

  await mainStore.getCartItemsCount()
}

onBeforeMount(async () => {
  await getBook()
})
</script>

<template>
  <div id="book-detail-page">
    <main class="container" style="padding: 100px 0">
      <!-- Alert -->
      <div class="alert alert-dismissible alert-danger" v-show="errorMsg">
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        <span>{{ errorMsg }}</span>
      </div>

      <div class="row gap-3" v-if="book">
        <div class="col-2 d-flex justify-content-center border-end">
          <img
            :src="book.cover_image"
            onerror="this.onerror=null; this.src='/fallback_image.jpg'"
            height="200"
            style="object-fit: contain"
          />
        </div>
        <div class="col">
          <NuxtLink
            v-if="book.author"
            :to="`/authors/${book.author.slug}`"
            class="text-info mb-2"
            style="text-decoration: none"
            >{{ book.author.name }}</NuxtLink
          >
          <div class="fw-bold fs-2">{{ book.title }}</div>

          <div class="mt-4">
            <div class="text-muted mb-2">Description</div>
            <p class="text-sm" style="text-align: justify">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia enim reprehenderit provident
              consequuntur nisi praesentium placeat unde, eum illum consectetur facere ratione veritatis sunt amet
              aliquid laborum labore numquam atque sapiente! Quibusdam repudiandae itaque sunt cum eveniet similique
              unde! Consectetur quisquam tempora molestiae impedit omnis, ab et officia, suscipit non voluptatem
              doloremque, facere commodi. Sequi expedita dolores dignissimos mollitia ducimus incidunt aliquam nobis
              quae quasi delectus reprehenderit ipsam ab sed repellendus ullam facere, saepe a deleniti? Placeat
              consequatur, exercitationem maiores, similique iure qui, quisquam magni impedit autem omnis deleniti
              laudantium quis inventore. Distinctio suscipit laudantium perferendis. Odit nam consequatur neque
              necessitatibus. Aut deleniti doloremque a magnam cupiditate totam incidunt, maiores aliquam tenetur odio
              impedit unde repellat. Distinctio sed quibusdam, saepe pariatur at molestiae maiores exercitationem
              numquam natus eveniet debitis consequuntur voluptatibus recusandae officiis incidunt maxime nisi eligendi
              laboriosam eos inventore. Mollitia repellendus, vero quis explicabo amet fugiat quaerat tempore molestias
              impedit facere excepturi omnis reiciendis unde voluptate doloribus architecto eaque quidem beatae sunt
              iure iusto asperiores? Maiores ullam optio dolore, quo natus possimus culpa odio deserunt consequuntur
              dolor? Cum asperiores sit cumque, animi dolorum, adipisci natus hic sunt qui quidem nulla nemo voluptate
              alias consequatur a, quae quis laboriosam vitae?
            </p>
          </div>

          <div class="mt-4">
            <div class="text-muted mb-2">Published Date</div>
            <div class="fw-bold">
              {{ dayjs(book.published_date, 'YYYY-MM-DD').format('DD MMMM YYYY') }}
            </div>
          </div>

          <div class="mt-4">
            <div class="text-muted mb-2">Genre</div>
            <div class="fw-bold">
              {{ book.genre.name }}
            </div>
          </div>

          <div class="mt-4">
            <div class="text-muted mb-2">Price per item</div>
            <div class="fw-bold text-success fs-5">
              {{ toRupiah(book.price, { floatingPoint: 0 }) }}
            </div>
          </div>

          <div class="mt-4">
            <div class="text-muted mb-2">Stock</div>
            <div class="fw-bold fs-5">{{ book.stock_qty }} Items</div>
          </div>
        </div>

        <div class="mt-4 d-flex justify-content-end align-items-center gap-2">
          <div class="input-group" style="width: 130px">
            <button
              class="btn btn-outline-secondary"
              type="button"
              id="button-addon1"
              @click="
                () => {
                  if (qty === 1 && qty > 0) return
                  qty = qty - 1
                }
              "
            >
              -
            </button>
            <div class="form-control d-flex justify-content-center">
              {{ qty }}
            </div>
            <button
              class="btn btn-outline-secondary"
              type="button"
              id="button-addon2"
              @click="
                () => {
                  qty = qty + 1
                }
              "
            >
              +
            </button>
          </div>
          <button class="btn btn-primary" @click="addToCart">Add to cart</button>
        </div>
      </div>

      <!-- <hr /> -->

      <!-- <div class="row">
        <div class="fw-bold fs-5">Other books by this author</div>
        <div>
          <NuxtLink
              v-if="bookResponse"
              v-for="book in bookResponse.data"
              style="width: 265px; height: 330px; text-decoration: none"
              :to="`/books/${book.slug}`"
            >
              <div class="card shadow-sm p-2">
                <img
                  :src="
                    book.cover_image ??
                    'https://bookstoreromanceday.org/wp-content/uploads/2020/08/book-cover-placeholder.png'
                  "
                  :style="{
                    height: '200px',
                    width: '100%',
                    objectFit: 'contain',
                  }"
                />

                <div
                  class="card-body text-center d-flex flex-column justify-content-center gap-2"
                >
                  <div class="text-muted line-clamp-1">
                    by {{ book.author ? book.author.name : "Unknown" }}
                  </div>
                  <div class="fw-bold line-clamp-1">{{ book.title }}</div>
                  <div class="fw-bold text-success">
                    {{ toRupiah(book.price, { floatingPoint: 0 }) }}
                  </div>
                </div>
              </div>
            </NuxtLink>
        </div>
      </div> -->
    </main>
  </div>
</template>

<style></style>
