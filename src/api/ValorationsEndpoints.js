import { get, post } from './helpers/ApiRequestsHelper'
function getAll () {
  return get('/valorations')
}

function getMeanValoration (id) {
  return get(`valorations/mean/${id}`)
}

function create (data) {
  return post('valorations', data)
}
function indexRestaurant (id) {
  return get(`valorations/${id}`)
}
export { getAll, getMeanValoration, create, indexRestaurant }
