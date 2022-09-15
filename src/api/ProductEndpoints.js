import { get, post } from './helpers/ApiRequestsHelper'

function getProductCategories () {
  return get('productCategories')
}

function create (data) {
  return post('/products/', data)
}
function getRestaurantProducts (id) {
  return get(`/restaurants/${id}/products`)
}

export { getProductCategories, create, getRestaurantProducts }
