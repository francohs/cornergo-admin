import { defineStore } from 'pinia'
import { baseState, baseGetters, baseActions } from './base'
import { tableState } from './base/state'
import { api } from 'boot/axios'

export const useInventory = defineStore({
  id: 'inventory',

  state: () => ({
    ...baseState(),
    inventoryTable: tableState('inventoryTable', {
      visibles: ['code', 'name', 'stock', 'checked'],
      containsFields: ['code', 'name']
    }),
    provider: null
  }),

  getters: {
    ...baseGetters()
  },

  actions: {
    async getDocs(provider) {
      try {
        this.loading = true
        const { data } = await api.get('products/inventory', {
          params: {
            provider
          }
        })
        this.docs = data.docs
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },
    async update(id, product) {
      const index = this.docs.findIndex(doc => doc._id === id)
      if (index > -1) {
        this.docs[index] = product
      }
    },
    clearDocs() {
      this.docs = []
    }
  }
})
