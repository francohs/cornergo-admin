import { api } from 'boot/axios'
import notify from 'tools/notify'

export const baseActions = () => {
  return {
    async getQueryDocs(request) {
      try {
        this.loading = true
        const { data } = await api.post(`${this.$id}/query`, request)

        if (request.pagination && request.pagination.page > 1) {
          this.docs = [...this.docs, ...data.docs]
        } else {
          this.docs = data.docs
        }

        this.count = data.count
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },
    async getQueryOptions(request) {
      try {
        this.loading = true
        const { data } = await api.post(`${this.$id}/query`, request)

        this.options = data.docs
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },
    async getDocs() {
      try {
        this.loading = true
        const { data } = await api.get(this.$id)
        this.docs = data.docs
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },
    async getDoc(id) {
      try {
        this.loading = true
        const { data } = await api.get(`${this.$id}/${id}`)
        this.doc = data.doc
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },
    async findDoc(equal) {
      try {
        this.loading = true
        const { data } = await api.post(`${this.$id}/find`, equal)
        this.doc = data.doc
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },
    async create(doc) {
      try {
        this.saving = true
        const { data } = await api.post(this.$id, { doc })
        this.docs.push(data.doc)
        this.clearDoc()
        notify.positive('Datos creados con éxito')
      } catch (error) {
        throw error
      } finally {
        this.saving = false
      }
    },
    async update(id, mod, message = 'Datos modificados con éxito') {
      try {
        this.saving = true

        const { data } = await api.patch(`${this.$id}/${id}`, {
          mod
        })

        this.doc = data.doc
        const index = this.docs.findIndex(doc => doc._id === id)
        if (index > -1) {
          this.docs[index] = data.doc
        }

        notify.positive(message)
      } catch (error) {
        throw error
      } finally {
        this.saving = false
      }
    },
    async replace(id, doc, message = 'Datos modificados con éxito') {
      try {
        this.saving = true

        const { data } = await api.put(`${this.$id}/${id}`, {
          doc
        })

        this.doc = data.doc
        const index = this.docs.findIndex(doc => doc._id === id)
        if (index > -1) {
          this.docs[index] = data.doc
        }

        notify.positive(message)
      } catch (error) {
        throw error
      } finally {
        this.saving = false
      }
    },
    async delete(id) {
      try {
        this.deleting = true
        await api.delete(`${this.$id}/${id}`)
        this.doc = {}
        this.docs.filter(doc => doc._id != id)
        notify.positive('Datos eliminados con éxito')
      } catch (error) {
        throw error
      } finally {
        this.deleting = false
      }
    },
    clearDoc() {
      this.doc = {}
    },
    clearDocs() {
      this.docs = []
    }
  }
}
