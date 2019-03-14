import { read } from './storage'
import { STORE_KEY_USERNAME, STORE_KEY_USEREMAIL, STORE_KEY_ACCESS_TOKEN, STORE_KEY_REFRESH_TOKEN,
  STORE_KEY_CONFIG_LANG, STORE_KEY_CONFIG_SIDEBAR, STORE_KEY_CONFIG_PAGE_LIMIT } from './constants'

export const username = read(STORE_KEY_USERNAME) || ''
// eslint-disable-next-line camelcase
export const email = read(STORE_KEY_USEREMAIL) || ''
// eslint-disable-next-line camelcase
export const access_token = read(STORE_KEY_ACCESS_TOKEN) || '' // eslint-disable-line
// eslint-disable-next-line camelcase
export const refresh_token = read(STORE_KEY_REFRESH_TOKEN) || '' // eslint-disable-line
// lang order: localStorage -> browser language -> default
export const sidebar = read(STORE_KEY_CONFIG_SIDEBAR) || 'open' // eslint-disable-line
//
export const lang = read(STORE_KEY_CONFIG_LANG) || navigator.language || 'en'
export const pageLimit = +read(STORE_KEY_CONFIG_PAGE_LIMIT) || 20
