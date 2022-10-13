import { defineStore } from 'pinia'
import { baseState, baseGetters, baseActions } from './base'

export const useCashMoves = defineStore({
  id: 'cashmoves',

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
