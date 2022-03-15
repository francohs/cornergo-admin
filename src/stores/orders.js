import { defineStore } from 'pinia'
import { baseState, baseGetters, baseActions } from './base'

export const useOrders = defineStore({
  id: 'orders',

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
