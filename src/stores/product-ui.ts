import { defineStore } from 'pinia'

export const useProductUIStore = defineStore('product-ui', () => {
  const mode = ref<'list' | 'create' | 'edit' | 'detail' >('list')
  const selectedId = ref<number | null>(null)
  const deleteId = ref<number | null>(null)

  function reset() {
    selectedId.value = null
  }

  function openCreate() {
    mode.value = 'create'
    reset()
  }

  function openEdit(id: number) {
    mode.value = 'edit'
    selectedId.value = id
  }

  function openDetail(id: number) {
    mode.value = 'detail'
    selectedId.value = id
  }


  function back() {
    mode.value = 'list'
    reset()
  }

  function openDelete(id: number) {
    deleteId.value = id
  }

  function afterDelete() {
    mode.value = 'list'
    reset()
  }

  return {
    mode,
    selectedId,
    openCreate,
    openDelete,
    openEdit,
    openDetail,
    back,
    afterDelete,
  }

})