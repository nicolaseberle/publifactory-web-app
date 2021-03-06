/**
 * Project config file includes dev/prod and frontend/backend
 */
var path = require('path');

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
};

const url = process.env.ROOT_APP || 'http://localhost:9001';

const email = {
	rootHTML: process.env.ROOT_APP || 'http://localhost:9001',
	user: 'publifactory.noreply@gmail.com',
	pass: 'cxuxhyudqehcujro'
};

const orcid = {
	clientId: 'APP-HCKHJYQTALPVGUJ1',
	clientSecret: '66671331-2305-4cd9-915e-fd65887fe14f',
	callbackUrl: 'http://api:4000/api/auth/local/orcid/callback'
};

const google = {
	client_id:
		'512110219820-jg8kgmn0keerqaq6iktdp6th80gqguvv.apps.googleusercontent.com',
	client_secret: 'bP63zGcgNyfv5jBDKYdsgpbE',
	callbackUrl: 'http://localhost:9001'
};

const frontendProd = {
	index: path.resolve(__dirname, './client/dist/index.html'),
	assetsRoot: path.resolve(__dirname, './client/dist'),
	assetsSubDirectory: 'static',
	assetsPublicPath: '/',
	cssSourceMap: true,
	// Gzip off by default as many popular static hosts such as
	// Surge or Netlify already gzip all static assets for you.
	// Before setting to `true`, make sure to:
	// npm install --save-dev compression-webpack-plugin
	productionGzip: false,
	productionGzipExtensions: ['js', 'css']
};

const frontendDev = {
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
};

const backendDev = Object.assign({}, backendBase, {
	resetDB: 'false',
	seedDB: 'true',
	mongo: {
		uri: `mongodb://${process.env.BASE_MONGO}:27017/`,
		useNewUrlParser: true
	}
});

const backendProd = Object.assign({}, backendBase, {
	// whether backend servers the frontend, you can use nginx to server frontend and proxy to backend services
	// if set to true, you need no web services like nginx
	serverFrontend: true,
	resetDB: process.env.RESETDB || 'false',
	seedDB: process.env.SEEDB || 'false',
	// Server IP
	ip: process.env.OPENSHIFT_NODEJS_IP || process.env.ip || undefined,

	// Server port

	// port: process.env.APP_PORT || process.env.PORT || 8080,

	// Socket.io port
	socketPort: process.env.SOCKET_PORT || 4001,

	// MongoDB connection options
	mongo: {
		// uri: process.env.MONGODB_URI
		uri: 'mongodb://mongo'
	},

	// frontend folder
	frontend: path.resolve(__dirname, './client/dist')
});

const stripeDev = {
	publicKey: 'pk_test_B5NEIJrmVXYt6iLyxaAwfVrY00rWgvQyAs',
	privateKey: 'sk_test_b9eIkUCav37bCcEOdMAoB2jJ00vLO95PS0',
	// productId: 'prod_GiN2vv8ZQTb6N9',
	freemiumProductId: 'prod_GnHdv8ms8HqCmp',
	premiumProductId: 'prod_GnHfGHsqb4WyYX',
	freemiumPlanId: 'plan_GnIMGf8T12pBpw',
	premiumPlanId: 'plan_GnHgEDiknMJqar'
};

const stripeProd = {
	publicKey: '',
	privateKey: '',
	freemiumProductId: '',
	premiumProductId: '',
	freemiumPlanId: '',
	premiumPlanId: ''
};

const staging = {
	url,
	env: 'staging',
	email,
	stripe: stripeDev,
	orcid,
	google,
	frontend: frontendProd,
	backend: backendProd
};
const production = {
	url,
	env: 'production',
	email,
	stripe: stripeProd,
	orcid,
	google,
	frontend: frontendProd,
	backend: backendProd
};
const development = {
	url,
	env: 'development',
	email,
	stripe: stripeDev,
	orcid,
	google,
	frontend: frontendDev,
	backend: backendDev
};

let config = null;
switch (process.env.NODE_ENV) {
	case 'production':
		config = production;
		break;
	case 'development':
		config = development;
		break;
	case 'staging':
		config = staging;
		// process.env.NODE_ENV = 'poduction'
		break;
	default:
		config = development;
		break;
}

console.log('CONFIG', process.env.NODE_ENV);

console.log('---------------------------------');
console.log(config);
console.log('---------------------------------');

module.exports = Object.assign({}, config);
