import Vue from 'vue'
import { authSocket } from '../../socket'

export function login (email, password) {
  return Vue.http.post('auth/local', {
    email,
    password
  }).then(res => res.json())
}

export function resetPassword (id, password, token) {
  return Vue.http.put('users/' + id + '/guestPassword', {
    password
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }).then(res => res.json())
}

export function updateUser (id, firstname, lastname, field, token) {
  return Vue.http.put('users/' + id + '/updateUser', {
    firstname, lastname, field
  }, {
    headers: {
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
