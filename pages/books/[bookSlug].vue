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
  await useApiFetch('/csrf-cookie')

  const result = await useApiFetch(`/books/detail/${route.params.bookSlug}`, {
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

  await useApiFetch('/csrf-cookie')

  const result = await useApiFetch(`/carts`, {
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

onMounted(async () => {
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

      <div class="placeholder-glow row gap-3" v-if="!book">
        <div class="col-2">
          <div class="placeholder rounded-1" style="width:120px;height:200px"></div>
        </div>
        <div class="col d-flex flex-column">
          <div class="placeholder rounded-1" style="width:100px;height:22px"></div>

          <div class="placeholder rounded-1 mt-2" style="width:100%;height:48px"></div>

          <div class="placeholder rounded-1 mt-4" style="width:100px;height:24px"></div>
          <div class="placeholder rounded-1 mt-2" style="width:100%;height:240px"></div>

          <div class="placeholder rounded-1 mt-4" style="width:100px;height:24px"></div>
          <div class="placeholder rounded-1 mt-2" style="width:100px;height:24px"></div>

          <div class="placeholder rounded-1 mt-4" style="width:100px;height:24px"></div>
          <div class="placeholder rounded-1 mt-2" style="width:100px;height:24px"></div>

          <div class="placeholder rounded-1 mt-4" style="width:100px;height:24px"></div>
          <div class="placeholder rounded-1 mt-2" style="width:100px;height:24px"></div>

          <div class="placeholder rounded-1 mt-4" style="width:100px;height:24px"></div>
          <div class="placeholder rounded-1 mt-2" style="width:100px;height:24px"></div>

          <div class="d-flex justify-content-end mt-4 align-items-center gap-2">
            <div class="placeholder rounded-1" style="width:120px;height:39px"></div>
            <div class="placeholder rounded-1" style="width:105px;height:39px"></div>
          </div>
        </div>
      </div>

      <div class="row gap-3" v-else>
        <div class="col-2 d-flex justify-content-center border-end">
          <img :src="useBookCoverUrl(book.cover_image)" onerror="this.onerror=null; this.src='/fallback_image.jpg'"
            height="200" style="object-fit: contain; max-width: 120px" />
        </div>
        <div class="col">
          <NuxtLink v-if="book.author" :to="`/authors/${book.author.slug}`" class="text-info mb-2"
            style="text-decoration: none">{{ book.author.name }}</NuxtLink>
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
            <button class="btn btn-secondary" type="button" id="button-addon1" @click="() => {
              qty = qty - 1
            }
              " :disabled="qty === 1">
              -
            </button>
            <div class="form-control d-flex justify-content-center">
              {{ qty }}
            </div>
            <button class="btn btn-secondary" type="button" id="button-addon2" @click="() => {
              qty = qty + 1
            }" :disabled="qty === book.stock_qty">
              +
            </button>
          </div>
          <button class="btn btn-primary" @click="addToCart">Add to cart</button>
        </div>
      </div>
    </main>
  </div>
</template>

<style></style>
