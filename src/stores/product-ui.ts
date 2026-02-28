import { defineStore } from 'pinia'

export type Mode = 'list' | 'create' | 'edit'
export type ModuleKey = 'products' | 'category' | 'inventory'

export const useProductUIStore = defineStore('product-ui', () => {
  const activeModule = ref<ModuleKey>('products')

  const modeMap = ref<Record<ModuleKey, Mode>>({
    products: 'list',
    category: 'list',
    inventory: 'list',
  })

  const selectedIdMap = ref<Record<ModuleKey, string | null>>({
    products: null,
    category: null,
    inventory: null,
  })

  const deleteIdMap = ref<Record<ModuleKey, string | null>>({
    products: null,
    category: null,
    inventory: null,
  })

  function setModule(module: ModuleKey) {
    activeModule.value = module
  }

  function reset(module: ModuleKey = activeModule.value) {
    selectedIdMap.value[module] = null
  }

  function openCreate(module: ModuleKey = activeModule.value) {
    modeMap.value[module] = 'create'
    reset(module)
  }

  function openEdit(id: string, module: ModuleKey = activeModule.value) {
    modeMap.value[module] = 'edit'
    selectedIdMap.value[module] = id
  }

  function back(module: ModuleKey = activeModule.value) {
    modeMap.value[module] = 'list'
    reset(module)
  }

  function openDelete(id: string, module: ModuleKey = activeModule.value) {
    deleteIdMap.value[module] = id
  }

  function afterDelete(module: ModuleKey = activeModule.value) {
    modeMap.value[module] = 'list'
    reset(module)
  }

  return {
    activeModule,
    modeMap,
    selectedIdMap,
    deleteIdMap,
    setModule,
    openCreate,
    openEdit,
    openDelete,
    back,
    afterDelete,
  }
})