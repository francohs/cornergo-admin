import { defineStore } from 'pinia'
import { baseState, baseGetters, baseActions } from './base'
import { tableState } from './base/state'

export const useProviders = defineStore({
  id: 'providers',
  state: () => ({
    ...baseState(),
    providersTable: tableState('providersTable', {
      visibles: ['name', 'rut'],
      forceSelect: [],
      containsFields: ['name', 'rut'],
      equalFilter: {},
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
