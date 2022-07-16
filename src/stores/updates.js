import { defineStore } from 'pinia'
import { baseState, baseGetters, baseActions } from './base'

export const useUpdates = defineStore({
  id: 'updates',

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
