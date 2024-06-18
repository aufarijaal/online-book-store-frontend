import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useMainStore = defineStore('main', () => {
  const idstoCheckout = ref(useLocalStorage<number[]>('ids', []))
  const cartItemsCount = ref(0)

  async function getCartItemsCount() {
    await useApiFetch('/csrf-cookie')

    const result = await useApiFetch(`/carts/count`, {
      headers: {
        Accept: 'application/json',
      },
    })

    if (result?.error.value) {
      alert(result.error.value?.data.message)
      return
    }

    cartItemsCount.value = (result.data.value as { message: string; data: any }).data.count

    shake()
  }

  function shake() {
    const shakeButton = document.getElementById('cart-button')

    shakeButton?.classList.add('jello-horizontal')

    setTimeout(() => {
      shakeButton?.classList.remove('jello-horizontal')
    }, 1000)
  }

  return { idstoCheckout, cartItemsCount, getCartItemsCount, shake }
})
