import { date } from 'quasar'
import moment from 'moment'

const formatter = {
  rut: value => {
    if (!value) return ''
    const splited = value.toString().replace('-', '').split('')
    splited.splice(-7, 0, '.')
    splited.splice(-4, 0, '.')
    splited.splice(-1, 0, '-')
    return splited.join('')
  },

  currency: value => {
    if (!value) return '$ 0'
    const numValue = parseInt(value)
    const isNegative = numValue < 0
    const splited = numValue.toString().replace('-', '').split('')
    if (splited.length > 6) {
      splited.splice(-6, 0, '.')
      splited.splice(-3, 0, '.')
    } else if (splited.length > 3) {
      splited.splice(-3, 0, '.')
    }
    return `${isNegative ? '- ' : ''}$ ${splited.join('')}`
  },

  percent: value => {
    if (!value) return '0%'
    return value.toString() + '%'
  },

  decimal: value => {
    if (!value || value == '0') return '0'
    return Number.isInteger(value) ? value : value.toFixed(2)
  },

  unformat: value => {
    if (!value) return 0
    return parseInt(
      value
        .toString()
        .replace('%', '')
        .replace('$', '')
        .replaceAll('.', '')
        .replaceAll(' ', '')
    )
  },

  uppercase: value => {
    if (!value) return ''
    return value.toString().toUpperCase()
  },

  date: value => {
    if (value) {
      return moment(value).format('YYYY-MM-DD')
    }
    return null
  },

  localDate: value => {
    if (value) {
      return moment(value).format('DD/MM/YYYY')
    }
    return null
  },

  time: value => date.formatDate(new Date(value), 'HH:mm:ss'),

  datetime: value => date.formatDate(new Date(value), 'DD/MM/YYYY HH:mm:ss'),

  boolean: value => {
    return value ? 'SI' : 'NO'
  }
}

export default formatter
