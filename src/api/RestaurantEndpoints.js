import { get, post } from './helpers/ApiRequestsHelper'
function getAll () {
  return get('users/myrestaurants')
}
function getAllCustomer () {
  return get('restaurants')
}
function getDetail (id) {
  return get(`restaurants/${id}`)
}

function getRestaurantCategories () {
  return get('restaurantCategories')
}
function getSortedValorationRestaurants(){
  return get('/restaurants/sortValoration')
}
function create (data) {
  return post('restaurants', data)
}
function getAllCategories () {
  return get('/restaurantCategories')
}
function restaurantFilter (id) {
  return get(`/restaurants/categoryFilter/${id}`)
}

export { getAll, getDetail, getRestaurantCategories, create, getAllCategories, restaurantFilter, getAllCustomer,getSortedValorationRestaurants }
