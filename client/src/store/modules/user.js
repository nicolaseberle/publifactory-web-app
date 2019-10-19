// import { merge } from 'lodash'
import { clearMulti, saveMulti } from '../../storage'
import {
  changePassword,
  checkEmail,
  getUserInfo,
  login,
  loginOrcid,
  resetGuestPassword,
  resetPassword,
  updateUser
} from './user.api'
// eslint-disable-next-line camelcase
import { access_token, email, refresh_token, username } from '../../stored'
import {
  STORE_KEY_ACCESS_TOKEN,
  STORE_KEY_REFRESH_TOKEN,
  STORE_KEY_USEREMAIL,
  STORE_KEY_USERNAME
} from '../../constants'

const state = {
  _id: '',
  role: 'guest',
  roles: ['guest'],
  avatar: '',
  email: email,
  username: username,
  access_token, // eslint-disable-line
  refresh_token // eslint-disable-line
}

const mutations = {
  // set user info
  SET_USER_INFO (state, userInfo) {
    // merge(state, userInfo)
    Object.assign(state, userInfo)
  },
  // after logout
  LOGOUT (state) {
    state._id = ''
    state.username = ''
    state.email = ''
    state.role = 'guest'
    state.roles = []
    state.avatar = ''
    state.access_token = '' // eslint-disable-line
    state.refresh_token = '' // eslint-disable-line
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  TOGGLE_ROLE:(state, role) => {
    state.roles = [ role ]
  }
}

const actions = {
  // init user info
  initUserInfo ({ commit, dispatch, state }) {
    return new Promise((resolve, reject) => {
      // token
      if (email) {
        getUserInfo(state.access_token).then(data => { // eslint-disable-line
          if (data._id) {
            commit('SET_USER_INFO', data)
          }
          resolve(data)
        }).catch(err => { reject(err) })
      } else {
        resolve()
      }
    })
  },
  loginOrcid ({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      loginOrcid(payload.orcidId, payload.password).then(data => {
        if (!data) {
          reject('error')
        }
        getUserInfo(data.token).then(user => {
          const userInfo = Object.assign({}, user, {
            email: payload.orcidId,
            access_token: data.token, // eslint-disable-line
            refresh_token: '' // eslint-disable-line
          })
          var arrRoles = []
          arrRoles.push(user.role)
          commit('SET_ROLES', arrRoles)
          commit('SET_AVATAR', user.avatar)
          commit('SET_USER_INFO', userInfo)
          saveMulti([{
            key: STORE_KEY_USEREMAIL,
            value: userInfo.orcidId
          }, {
            key: STORE_KEY_ACCESS_TOKEN,
            value: userInfo.access_token // eslint-disable-line
          }, {
            key: STORE_KEY_REFRESH_TOKEN,
            value: userInfo.refresh_token // eslint-disable-line
          }])
          resolve()
        }).catch(() => {})
      }).catch(err => { reject(err) })
    })
  },
  // login action
  login ({ commit, dispatch }, payload) {
    return new Promise(async (resolve, reject) => {
      await login(payload.email, payload.password).then(data => {
        if (!data) {
          reject('error')
        }
        getUserInfo(data.token).then(user => {
          /* const userInfo = merge({}, user, {
            email: payload.email,
            access_token: data.token, // eslint-disable-line
            refresh_token: '' // eslint-disable-line
          }) */
          const userInfo = Object.assign({}, user, {
            email: payload.email,
            access_token: data.token, // eslint-disable-line
            refresh_token: '' // eslint-disable-line
          })
          var arrRoles = []
          arrRoles.push(user.role)
          commit('SET_ROLES', arrRoles)
          commit('SET_AVATAR', user.avatar)
          commit('SET_USER_INFO', userInfo)
          saveMulti([{
            key: STORE_KEY_USEREMAIL,
            value: userInfo.email
          }, {
            key: STORE_KEY_ACCESS_TOKEN,
            value: userInfo.access_token // eslint-disable-line
          }, {
            key: STORE_KEY_REFRESH_TOKEN,
            value: userInfo.refresh_token // eslint-disable-line
          }])
          resolve()
        }).catch(() => {
        })
      }).catch(err => {
        reject(err)
      })
    })
  },
  // resetPassword action
  resetGuestPassword ({ commit, dispatch }, payload) {
    return new Promise(async (resolve, reject) => {
      await resetGuestPassword(payload.id, payload.password, payload.token).then(data => {
        if (!data) {
          reject('error')
        }
        getUserInfo(data.token).then(user => {
          const userInfo = Object.assign({}, user, {
            email: payload.email,
            access_token: data.token, // eslint-disable-line
            refresh_token: '' // eslint-disable-line
          })
          var arrRoles = []
          arrRoles.push(user.role)
          commit('SET_ROLES', arrRoles)
          commit('SET_AVATAR', user.avatar)
          commit('SET_USER_INFO', userInfo)
          saveMulti([{
            key: STORE_KEY_USEREMAIL,
            value: userInfo.email
          }, {
            key: STORE_KEY_ACCESS_TOKEN,
            value: userInfo.access_token // eslint-disable-line
          }, {
            key: STORE_KEY_REFRESH_TOKEN,
            value: userInfo.refresh_token // eslint-disable-line
          }])
          resolve(userInfo.access_token)
        }).catch(() => {
        })
      }).catch(err => { reject(err) })
    })
  },
  // changePassword action
  changePassword ({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      changePassword(payload.oldPassword, payload.newPassword, payload.token).then(data => {
        if (!data) {
          reject('error')
        }
        resolve()
      }).catch(err => { reject(err) })
    })
  },
  // resetPassword action
  resetPassword ({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      resetPassword(payload.email).then(data => {
        if (!data) {
          reject('error')
        }
        resolve()
      }).catch(err => { reject(err) })
    })
  },
  // updateUser action
  updateUser ({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      updateUser(payload.firstname,
                  payload.lastname,
                  payload.field,
                  payload.token).then(data => {
                    if (!data) {
                      reject('error')
                    }
                    resolve()
                  }).catch(err => { reject(err) })
    })
  },
  // refresh token action
  refreToken ({ commit }, payload) {
    commit('REFERE_TOKEN', payload)
    saveMulti([{
      key: STORE_KEY_ACCESS_TOKEN,
      value: payload.access_token // eslint-disable-line
    }, {
      key: STORE_KEY_REFRESH_TOKEN,
      value: payload.refresh_token // eslint-disable-line
    }])
  },
  // logout action
  logout ({ commit }, payload) {
    commit('LOGOUT')
    clearMulti([STORE_KEY_USERNAME, STORE_KEY_USEREMAIL, STORE_KEY_ACCESS_TOKEN, STORE_KEY_REFRESH_TOKEN])
  },
  checkEmail ({ commit }, payload) {
    checkEmail(payload.userId)
  },
  toggleRole ({ commit }, role) {
    commit('TOGGLE_ROLE', role)
  },
}

const getters = {
  userId (state) {
    return state._id
  },
  userRole (state) {
    return state.role
  },
  userRoles (state) {
    return state.roles
  },
  userAvatar (state) {
    return state.avatar
  },
  accessToken (state) {
    return state.access_token // eslint-disable-line
  },
  username (state) {
    return state.username
  },
  email (state) {
    return state.email
  },
  loggedIn (state) {
    return !!(state.email && state.access_token) // eslint-disable-line
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
