import { defineStore } from 'pinia'
import { baseState, baseGetters, baseActions } from './base'
import { tableState } from './base/state'

export const useProviders = defineStore({
  id: 'providers',
  state: () => ({
    ...baseState(),
    providersTable: tableState('providersTable', {
      visibles: ['name', 'rut', 'alias'],
      forceSelect: [],
      containsFields: ['name', 'rut', 'alias'],
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
