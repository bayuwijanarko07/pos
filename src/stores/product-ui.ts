import { defineStore } from 'pinia'

export const useProductUIStore = defineStore('product-ui', () => {
  const mode = ref<'list' | 'create' | 'edit' | 'detail' >('list')
  const selectedId = ref<string | null>(null)
  const deleteId = ref<string | null>(null)

  function reset() {
    selectedId.value = null
  }

  function openCreate() {
    mode.value = 'create'
    reset()
  }

  function openEdit(id: string) {
    mode.value = 'edit'
    selectedId.value = id
  }

  function openDetail(id: string) {
    mode.value = 'detail'
    selectedId.value = id
  }


  function back() {
    mode.value = 'list'
    reset()
  }

  function openDelete(id: string) {
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