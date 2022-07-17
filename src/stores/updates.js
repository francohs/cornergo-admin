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

    async getPriceLabels() {
      try {
        this.loading = true
        const { data } = await api.get(this.$id + '/pricelabels', {
          params: { date: '2022-07-15' }
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
