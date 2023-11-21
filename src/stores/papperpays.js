import { api } from 'boot/axios'
import { defineStore } from 'pinia'
import { baseState, baseGetters, baseActions } from './base'

export const usePapperPays = defineStore({
  id: 'papperpays',

  state: () => ({
    ...baseState()
  }),

  getters: {
    ...baseGetters()
  },

  actions: {
    ...baseActions(),
    async getDocs(date) {
      try {
        this.loading = true
        const { data } = await api.get(`${this.$id}/${date}`)
        this.docs = data.docs
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },
    async getDocsByMonth(month, year) {
      try {
        this.loading = true
        const { data } = await api.get(`${this.$id}/month/${year}/${month}`)
        this.docs = data.docs
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
