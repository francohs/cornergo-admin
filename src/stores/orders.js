import { defineStore } from 'pinia'
import { baseState, baseGetters, baseActions } from './base'

export const useOrders = defineStore({
  id: 'orders',

  state: () => ({
    ...baseState()
  }),

  getters: {
    ...baseGetters()
  },

  actions: {
    ...baseActions(),

    async getDoc(id, day) {
      try {
        this.loading = true
        const { data } = await api.get(this.$id, {
          params: {
            id,
            day
          }
        })
        this.doc = data.doc
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
