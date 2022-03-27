import { defineStore } from 'pinia'
import { baseState, baseGetters, baseActions } from './base'
import { tableState } from './base/state'

export const useProducts = defineStore({
  id: 'products',

  state: () => ({
    ...baseState(),
    productsTable: tableState('productsTable', {
      visibles: ['code', 'name', 'stock', 'price', 'active'],
      containsFields: ['code', 'name'],
      equalFilter: {
        providers: null
      }
    })
  }),

  getters: {
    ...baseGetters()
  },

  actions: {
    ...baseActions()
  }
})
