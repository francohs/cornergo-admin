import { LocalStorage } from 'quasar'

export const baseState = () => ({
  docs: [],
  doc: {},
  count: 0,
  options: [],
  loading: false,
  saving: false,
  deleting: false
})

export const tableState = (
  tableName,
  { visibles, forceSelect, containsFields, equalFilter, dateFilter, populate }
) => {
  const table = LocalStorage.getItem(tableName) || {
    input: '',
    visibles: visibles || [],
    forceSelect: forceSelect || [],
    pagination: {
      sortBy: null,
      descending: false,
      page: 1,
      rowsPerPage: 10
    },
    containsFields: containsFields || [],
    equalFilter: equalFilter || {},
    dateFilter: dateFilter || {},
    actives: true,
    populate: populate || []
  }
  table.input = ''
  table.pagination.page = 1
  table.equalFilter = equalFilter

  return table
}
