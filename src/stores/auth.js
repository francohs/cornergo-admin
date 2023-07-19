import { defineStore } from 'pinia'
import { LocalStorage } from 'quasar'
import { axios, api, addBererToken } from 'src/boot/axios'
import { useCompanies } from 'stores/companies'
import notify from 'tools/notify'

export const useAuth = defineStore({
  id: 'auth',

  state: () => ({
    credentials: {
      username: '',
      password: ''
    },
    user: LocalStorage.getItem('user'),
    token: LocalStorage.getItem('token'),
    loading: false
  }),

  getters: {
    isLogged() {
      return this.token !== null
    },
    isAdmin() {
      return this.user.isAdmin
    }
  },

  actions: {
    async login() {
      try {
        this.loading = true

        const { data } = await api.post(`${this.$id}/login`, this.credentials)

        this.user = data.user
        this.token = data.token
        LocalStorage.set('user', this.user)
        LocalStorage.set('token', this.token)
        addBererToken(this.token)

        const companies = useCompanies()
        await companies.getDoc('5fae93a5378e42182886b016')
        const publicIP = await axios.get('https://api.db-ip.com/v2/free/self')
        if (
          !data.user.isAdmin &&
          !companies.doc.whitelist.find(i => i.ip == publicIP.data.ipAddress)
        ) {
          this.logout()
          notify.negative(
            'Debe iniciar sesión desde uno de los equipos de la empresa'
          )
        }
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },
    logout() {
      this.user = null
      this.token = null
      LocalStorage.remove('user')
      LocalStorage.remove('token')
    }
  }
})
