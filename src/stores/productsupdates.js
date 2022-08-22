import { defineStore } from 'pinia'
import { baseState, baseGetters, baseActions } from './base'
import { tableState } from './base/state'
import { api } from 'boot/axios'

export const useProductsUpdates = defineStore({
  id: 'productsupdates',

  state: () => ({
    ...baseState(),
    productsUpdatesTable: tableState('productsUpdatesTable', {
      visibles: [
        'username',
        'code',
        'providers',
        'name',
        'field',
        'oldValue',
        'newValue'
      ],
      containsFields: ['code', 'name'],
      equalFilter: {
        username: null,
        field: null
      }
    })
  }),

  getters: {
    ...baseGetters()
  },

  actions: {
    ...baseActions(),

    async getPriceLabels(date) {
      try {
        this.loading = true
        const { data } = await api.get(this.$id + '/pricelabels', {
          params: { date }
        })
        return data.docs
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})
