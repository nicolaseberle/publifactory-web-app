const serviceCreate = require('../services/create')
const { ApiError } = require('../../../config/error')

async function create (req, res, next) {
  try {
    if (
      req.path.includes('billings/users/') ||
			req.path.includes('billings/journals/')
    ) throw new ApiError('BAD_ROUTE_PARAMETERS')

    const response = await serviceCreate({
      userId: req.params.userId,
      journalId: req.params.journalId,
      billing: req.body
    })
    res
      .status(200)
      .json(response)
      .end()
  } catch (error) {
    next(error)
  }
}

module.exports = create
