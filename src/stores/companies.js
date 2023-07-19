import { defineStore } from 'pinia'
import { baseState, baseGetters, baseActions } from './base'

export const useCompanies = defineStore({
  id: 'companies',

  state: () => ({
    ...baseState()
  }),

  getters: {
    ...baseGetters()
  },

  actions: {
    ...baseActions()
  }
})
