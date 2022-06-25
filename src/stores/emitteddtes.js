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
      forceSelect: ['_id', 'number', 'emissionDate', 'xmlUrl', 'bsaleId'],
      containsFields: ['number'],
      equalFilter: {
        client: null
      },
      dateFilter: {
        field: 'emissionDate',
        value: null
      },
      populate: ['client']
    })
  }),

  getters: {
    ...baseGetters()
  },

  actions: {
    ...baseActions(),
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
