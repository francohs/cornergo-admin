import { api } from 'boot/axios'
import { defineStore } from 'pinia'
import { baseState, baseGetters, baseActions } from './base'
import notify from 'tools/notify'

export const useTransfers = defineStore({
  id: 'transfers',

  state: () => ({
    ...baseState(),
    matching: false
  }),

  getters: {
    ...baseGetters(),
    dteNotVerified() {
      return this.docs.filter(t => t.dte && !t.verified).length
    },
    bankNotVerified() {
      return this.docs.filter(t => !t.dte && !t.verified).length
    }
  },

  actions: {
    ...baseActions(),

    async getDocs(month, year) {
      try {
        this.loading = true
        const { data } = await api.post(this.$id, { month, year })
        this.docs = data.docs
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },
    async uploadBankTransfers(file) {
      try {
        this.loading = true

        const formData = new FormData()
        formData.append('file', file)

        const { data } = await api.post(`${this.$id}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        this.docs = data.docs
        notify.positive('Cartola ingresada con éxito')
      } catch (error) {
        notify.negative('Error al ingresar cartola')
        throw error
      } finally {
        this.loading = false
      }
    },
    async match(bankTrasfer) {
      try {
        this.matching = true

        const { doc: posTrasfer } = (
          await api.post(`${this.$id}/find`, {
            dteNumber: bankTrasfer.dteNumber
          })
        ).data

        const { doc: newPosTrasfer } = (
          await api.put(`${this.$id}/${posTrasfer._id}`, {
            doc: {
              ...posTrasfer,
              bankDate: bankTrasfer.bankDate,
              bankAmount: bankTrasfer.bankAmount,
              clientName: bankTrasfer.clientName,
              operationNumber: bankTrasfer.operationNumber,
              verified: true
            }
          })
        ).data
        const index = this.docs.findIndex(d => d._id === newPosTrasfer._id)
        if (index > -1) {
          this.docs[index] = newPosTrasfer
        }

        await api.delete(`${this.$id}/${bankTrasfer._id}`)
        this.docs = this.docs.filter(d => d._id != bankTrasfer._id)

        notify.positive('Trasferencia combinada con éxito')
      } catch (error) {
        notify.negative('Error al combinar trasferencia')
        throw error
      } finally {
        this.matching = false
      }
    }
  }
})
