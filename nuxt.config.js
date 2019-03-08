module.exports = {
  serverMiddleware: [
    { path: '/api/emailer', handler: './server/api/email/index.js' },
  ]
}
