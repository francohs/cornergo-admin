import { defineStore } from 'pinia'
import { baseState, baseGetters, baseActions } from './base'
import { tableState } from './base/state'
import { api } from 'boot/axios'

export const useEmittedDtes = defineStore({
  id: 'emitteddtes',

  state: () => ({
    ...baseState(),
    emittedDtesTable: tableState('emittedDtesTable', {
      visibles: ['_id', 'dteTypeName', 'number', 'emissionDate', 'totalAmount'],
      forceSelect: ['_id', 'number', 'emissionDate'],
      containsFields: ['number'],
      equalFilter: {
        client: null
      },
      dateFilter: {
        field: 'emissionDate',
        value: null
      },
      populate: ['client']
    }),
    sales: []
  }),

  getters: {
    ...baseGetters()
  },

  actions: {
    ...baseActions(),
    async getSalesByDate(date) {
      try {
        this.loading = true
        const { data } = await api.get('emitteddtes/sales', {
          params: {
            date
          }
        })
        this.sales = data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },
    async create(doc) {
      try {
        this.saving = true
        const { data } = await api.post(this.$id, { doc })
        return data.doc
      } catch (error) {
        throw error
      } finally {
        this.saving = false
      }
    }
  }
})
