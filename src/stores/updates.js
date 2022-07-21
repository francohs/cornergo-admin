import { defineStore } from 'pinia'
import { baseState, baseGetters, baseActions } from './base'
import { api } from 'boot/axios'

export const useUpdates = defineStore({
  id: 'updates',

  state: () => ({
    ...baseState()
  }),

  getters: {
    ...baseGetters()
  },

  actions: {
    ...baseActions(),

    async getPriceLabels(date) {
      try {
        this.loading = true
        const { data } = await api.get(this.$id + '/pricelabels', {
          params: { date }
        })
        return data.docs
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
