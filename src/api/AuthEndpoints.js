import { get, post, put } from './helpers/ApiRequestsHelper'

function login (data) {
  return post('users/login', data)
}

function register (data) {
  return post('users/registerOwner', data)
}

function update (data) {
  return put('users', data)
}

function isTokenValid (storedToken) {
  return put('users/isTokenValid', { token: storedToken })
}
function getUser (userId) {
  return get(`users/${userId}`)
}

export { login, register, isTokenValid, update, getUser }
