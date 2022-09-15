import { get, post } from './helpers/ApiRequestsHelper'

function create (data) {
  return post('/orders', data)
}
function getOrdersUser () {
  return get('/orders')
}

export { create, getOrdersUser }
