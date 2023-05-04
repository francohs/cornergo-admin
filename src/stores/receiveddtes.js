import { defineStore } from 'pinia'
import { baseState, baseGetters, baseActions } from './base'
import { tableState } from './base/state'
import { api } from 'boot/axios'
import notify from 'tools/notify'

export const useReceivedDtes = defineStore({
  id: 'receiveddtes',

  state: () => ({
    ...baseState(),
    receivedDtesTable: tableState('receivedDtesTable', {
      visibles: [
        '_id',
        'dteTypeName',
        'number',
        'providerAlias',
        'totalAmount',
        'receptionDate'
      ],
      forceSelect: ['providerName', 'providerRut', 'hasXML', 'provider'],
      containsFields: ['number'],
      equalFilter: {
        providerAlias: null
      },
      dateFilter: {
        field: 'emissionDate',
        value: null
      }
    })
  }),

  getters: {
    ...baseGetters()
  },

  actions: {
    ...baseActions(),

    async receiveDte(id, receivedDte) {
      try {
        const { data } = await api.post(
          `${this.$id}/${id}/receive`,
          receivedDte
        )
        this.doc.receptionDate = data.receptionDate
        notify.positive('DTE recibido')
      } catch (error) {
        throw error
      }
    }
  }
})
