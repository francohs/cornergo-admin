import { defineStore } from 'pinia'
import { baseState, baseGetters, baseActions } from './base'
import { tableState } from './base/state'

export const useSupplies = defineStore({
  id: 'supplies',

  state: () => ({
    ...baseState(),
    suppliesTable: tableState('suppliesTable', {
      visibles: ['name', 'sku'],
      forceSelect: [],
      containsFields: ['name', 'sku', 'productCode'],
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
