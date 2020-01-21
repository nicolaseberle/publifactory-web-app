/**
 * Project config file includes dev/prod and frontend/backend
 */
var path = require('path')

var backendBase = {
  // Root path of server
  root: path.normalize(__dirname),

  // Server port
  port: process.env.PORT || 4000,

  // Socket port
  socketPort: process.env.SOCKET_PORT || 4001,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: process.env.SECRET || 'publifactory-project-secret'
  },

  // List of user roles
  userRoles: ['admin', 'editor', 'user'],

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  }
}

const url = process.env.ROOT_APP || 'http://localhost:9001'

const email = {
  rootHTML: process.env.ROOT_APP || 'http://localhost:9001',
  user: 'publifactory.noreply@gmail.com',
  pass: 'cxuxhyudqehcujro'
}

const orcid = {
  clientId: 'APP-HCKHJYQTALPVGUJ1',
  clientSecret: '66671331-2305-4cd9-915e-fd65887fe14f',
  callbackUrl: 'http://api:4000/api/auth/local/orcid/callback'
}

const google = {
  client_id:
		'512110219820-jg8kgmn0keerqaq6iktdp6th80gqguvv.apps.googleusercontent.com',
  client_secret: 'bP63zGcgNyfv5jBDKYdsgpbE',
  callbackUrl: 'http://localhost:9001'
}

const frontend = {
  port: 9001,
  assetsRoot: path.resolve(__dirname, './client/src'),
  assetsSubDirectory: 'static',
  assetsPublicPath: '/',
  proxyTable: {
    '/api': {
      target: 'http://localhost:' + backendBase.port,
      changeOrigin: true
    },
    '/socket.io': {
      target: 'http://localhost:' + backendBase.port,
      changeOrigin: true,
      ws: true
    },
    '/cursors': {
      target: 'http://localhost:' + backendBase.port + '/cursors',
      changeOrigin: true,
      ws: true
    },
    '/mevn-dev': {
      target: 'http://localhost:' + backendBase.port + '/mevn-dev',
      changeOrigin: true,
      ws: true
    }
  },
  // CSS Sourcemaps off by default because relative paths are "buggy"
  // with this option, according to the CSS-Loader README
  // (https://github.com/webpack/css-loader#sourcemaps)
  // In our experience, they generally work as expected,
  // just be aware of this issue when enabling this option.
  cssSourceMap: false
}

const backend = Object.assign({}, backendBase, {
  resetDB: 'false',
  seedDB: 'true',
  mongo: {
    uri: `mongodb://${process.env.BASE_MONGO}:27017/`,
    useNewUrlParser: true
  }
})
const staging = {
  url,
  env: 'staging',
  email,
  orcid,
  google,
  frontend,
  backend
}
const production = {
  url,
  env: 'production',
  email,
  orcid,
  google,
  frontend,
  backend
}
const development = {
  url,
  env: 'development',
  email,
  orcid,
  google,
  frontend,
  backend
}

let config = null
switch (process.env.NODE_ENV) {
  case 'production':
    config = production
    break
  case 'development':
    config = development
    break
  case 'staging':
    config = staging
    process.env.NODE_ENV = 'poduction'
    break
  default:
    config = development
    break
}

console.log(process.env.NODE_ENV)
module.exports = Object.assign({}, config)
