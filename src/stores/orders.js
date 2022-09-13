import { api } from 'boot/axios'
import notify from 'tools/notify'
import { defineStore } from 'pinia'
import { baseState, baseGetters, baseActions } from './base'

export const useOrders = defineStore({
  id: 'orders',

  state: () => ({
    ...baseState(),
    doc: { order: [] }
  }),

  getters: {
    ...baseGetters()
  },

  actions: {
    ...baseActions(),

    async create(doc) {
      try {
        this.saving = true
        await api.post(this.$id, { doc })
        notify.positive('Datos creados con éxito')
      } catch (error) {
        throw error
      } finally {
        this.saving = false
      }
    }

    // async getDoc(id, day) {
    //   try {
    //     this.loading = true
    //     const { data } = await api.get(this.$id, {
    //       params: {
    //         id,
    //         day
    //       }
    //     })
    //     this.doc = data.doc
    //   } catch (error) {
    //     throw error
    //   } finally {
    //     this.loading = false
    //   }
    // }
  }
})
