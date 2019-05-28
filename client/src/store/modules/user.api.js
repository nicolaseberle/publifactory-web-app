import Vue from 'vue'
import { authSocket } from '../../socket'

export async function login (email, password) {
  return new Promise((resolve, reject) => {
    Vue.http.post('auth/local', {
      email,
      password
    }).then(res => resolve(res.json()))
      .catch(err => reject(err))
  })
}

export function checkEmail (userId) {
  return Vue.http.patch('users/confirmation', {
    userId
  }).then(res => res.json())
}

export function loginOrcid (orcidId, password) {
  return Vue.http.post('auth/local/orcid', {
    orcidId, password
  }).then(res => console.log(res.json()))
}

export function resetGuestPassword (id, password, token) {
  return Vue.http.put('users/' + id + '/guestPassword', {
    password,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(res => res.json())
}

export function changePassword (id, oldPassword, newPassword, token) {
  return Vue.http.put('users/' + id + '/changePassword', {
    oldPassword, newPassword, headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(res => res.json())
}

export function resetPassword (email) {
  return Vue.http.put('users/resetPassword', {
    email
  }).then(res => res.json())
}

export function updateUser (id, firstname, lastname, field, token) {
  return Vue.http.put('users/' + id + '/updateUser', {
    firstname, lastname, field, headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(res => res.json())
}

export function getUserInfo (token) {
  return new Promise((resolve) => {
    Vue.http.get('users/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(data => data.json()).then(data => {
      authSocket(token, () => {
        console.log('Token authenticated.')
      })
      resolve(data)
    }).catch(() => {
      resolve({})
    })
  })
}
