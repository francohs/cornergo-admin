import { defineStore } from 'pinia'
import { baseState, baseGetters, baseActions } from './base'
import { tableState } from './base/state'

export const useSupplies = defineStore({
  id: 'supplies',

  state: () => ({
    ...baseState(),
    table: tableState('supplies', {
      visibles: ['name'],
      forceSelect: [],
      containsFields: ['unitCode', 'name'],
      equalFilter: {
        providerAlias: null
      },
      dateFilter: {}
    })
  }),

  getters: {
    ...baseGetters()
  },

  actions: {
    ...baseActions()
  }
})
