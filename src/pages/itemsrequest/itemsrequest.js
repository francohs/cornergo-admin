import { defineStore } from 'pinia'
import { api } from 'boot/axios'
import notify from 'tools/notify'

export const useItemsRequest = defineStore({
  id: 'itemsrequest',

  state: () => ({
    docs: [],
    loading: false
  }),

  getters: {},

  actions: {
    async getDocs() {
      try {
        this.loading = true
        const { data } = await api.post(this.$id, {
          operation: 'find'
        })
        this.docs = data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },
    async create(doc) {
      try {
        this.saving = true
        const { data } = await api.post(this.$id, { operation: 'create', doc })
        this.docs.push(data)
        // this.clearDoc()
        notify.positive('Datos creados con éxito')
      } catch (error) {
        throw error
      } finally {
        this.saving = false
      }
    }
  }
})
