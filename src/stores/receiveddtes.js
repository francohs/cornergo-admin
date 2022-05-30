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
        'emissionDate',
        'providerAlias',
        'totalAmount'
      ],
      forceSelect: ['providerName', 'providerRut', 'xmlUrl', 'bsaleId'],
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

    async syncBsaleDte(id) {
      try {
        this.loading = true
        const { data } = await api.get(`${this.$id}/sync/${id}`)

        if (data.doc && data.doc.xmlUrl) {
          const index = this.docs.findIndex(doc => doc._id == data.doc._id)
          if (index > -1) this.docs[index] = data.doc
          notify.positive('XML sincronizado')
        } else {
          notify.negative('XML no encontrado')
        }
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

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
