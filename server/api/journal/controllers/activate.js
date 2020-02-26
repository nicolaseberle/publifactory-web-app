const serviceActivate = require('../services/activate')

async function activate (req, res, next) {
  try {
    const response = await serviceActivate({
      journalId: req.params.journalId,
      userId: req.params.userId
    })
    return res
      .status(200)
      .json(response)
      .end()
  } catch (error) {
    next(error)
  }
}

module.exports = activate
