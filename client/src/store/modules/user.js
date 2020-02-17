// import { merge } from 'lodash'

import { clearMulti, saveMulti } from '../../storage'
import {
  changePassword,
  checkEmail,
  userGetUserInfo,
  login,
  userLoginSync,
  loginOrcid,
  resetGuestPassword,
  resetPassword,
  updateUser
} from './user.api'
// eslint-disable-next-line camelcase
import {
  access_token,
  email,
  refresh_token,
  username,
  roles
} from '../../stored'
import {
  STORE_KEY_ACCESS_TOKEN,
  STORE_KEY_REFRESH_TOKEN,
  STORE_KEY_USEREMAIL,
  STORE_KEY_USERNAME,
  STORE_KEY_ROLES
} from '../../constants'

const state = {
  _id: '',
  role: 'guest',
  roles: roles,
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
		state.access_token = ''; // eslint-disable-line
		state.refresh_token = ''; // eslint-disable-line
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  TOGGLE_ROLE: (state, role) => {
    state.roles = [role]
  }
}

const actions = {
  // init user info
  initUserInfo ({ commit, dispatch, state }) {
    return new Promise(async (resolve, reject) => {
      // token
      if (email) {
        await dispatch('getUserInfo', { token: state.access_token })
      } else {
        resolve()
      }
    })
  },
  loginOrcid ({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      loginOrcid(payload.orcidId, payload.password)
        .then(async data => {
          if (!data) {
            reject('error')
          }
          await dispatch('getUserInfo', { token: data.token })
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  async getUserInfo ({ commit }, { token }) {
    const responseGetInfo = await userGetUserInfo({
      token
    })
    const user = Object.assign({}, responseGetInfo.data, {
      // eslint-disable-next-line
			access_token: token,
      // eslint-disable-next-line
			refresh_token: '',
      roles: [responseGetInfo.data.role]
    })
    commit('SET_ROLES', user.roles)
    commit('SET_AVATAR', user.avatar)
    commit('SET_USER_INFO', user)
    saveMulti([
      {
        key: STORE_KEY_USEREMAIL,
        value: user.email
      },
      {
        key: STORE_KEY_ACCESS_TOKEN,
				value: user.access_token // eslint-disable-line
      },
      {
        key: STORE_KEY_REFRESH_TOKEN,
        value: user.refresh_token
      },
      {
        key: STORE_KEY_ROLES,
				value: user.roles // eslint-disable-line
      }
    ])
    return responseGetInfo
  },
  async loginSync ({ dispatch }, { email, password }) {
    const responseLogin = await userLoginSync({ email, password })
    await dispatch('getUserInfo', {
      token: responseLogin.data.token
    })
  },
  // login action
  login ({ commit, dispatch }, payload) {
    return new Promise(async (resolve, reject) => {
      await login(payload.email, payload.password)
        .then(async data => {
          if (!data) {
            reject('error')
          }
          await dispatch('getUserInfo', { token: data.token })
          resolve()
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // resetPassword action
  resetGuestPassword ({ commit, dispatch }, payload) {
    return new Promise(async (resolve, reject) => {
      await resetGuestPassword(payload.id, payload.password, payload.token)
        .then(async data => {
          if (!data) {
            reject('error')
          }
          await dispatch('getUserInfo', { token: data.token })
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // changePassword action
  changePassword ({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      changePassword(payload.oldPassword, payload.newPassword, payload.token)
        .then(data => {
          if (!data) {
            reject('error')
          }
          resolve()
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // resetPassword action
  resetPassword ({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      resetPassword(payload.email)
        .then(data => {
          if (!data) {
            reject('error')
          }
          resolve()
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // updateUser action
  updateUser ({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      updateUser(
        payload.firstname,
        payload.lastname,
        payload.field,
        payload.token
      )
        .then(data => {
          if (!data) {
            reject('error')
          }
          resolve()
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  // refresh token action
  refreToken ({ commit }, payload) {
    commit('REFERE_TOKEN', payload)
    saveMulti([
      {
        key: STORE_KEY_ACCESS_TOKEN,
				value: payload.access_token // eslint-disable-line
      },
      {
        key: STORE_KEY_REFRESH_TOKEN,
				value: payload.refresh_token // eslint-disable-line
      }
    ])
  },
  // logout action
  logout ({ commit }, payload) {
    commit('LOGOUT')
    clearMulti([
      STORE_KEY_USERNAME,
      STORE_KEY_USEREMAIL,
      STORE_KEY_ACCESS_TOKEN,
      STORE_KEY_REFRESH_TOKEN
    ])
  },
  checkEmail ({ commit }, payload) {
    checkEmail(payload.userId)
  },
  toggleRole ({ commit }, role) {
    commit('TOGGLE_ROLE', role)
  }
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
		return state.access_token; // eslint-disable-line
  },
  username (state) {
    return state.username
  },
  email (state) {
    return state.email
  },
  loggedIn (state) {
		return !!(state.email && state.access_token); // eslint-disable-line
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
