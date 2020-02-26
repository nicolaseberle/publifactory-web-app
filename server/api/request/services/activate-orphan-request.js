const { Request } = require('../model')
const { Billing } = require('../../billing/model')
const Journal = require('../../journal/journal.model')
const create = require('./create')

async function activateOrphanRequest (journalId) {
  const journal = await Journal.findById(journalId).populate({
    path: 'billing',
    populate: {
      path: 'requests'
    }
  })
  const requests = [...journal.billing.requests]
  journal.billing.requests = []
  await Billing.updateOne({ _id: journal.billing._id }, {
    $set: { requests: [] }
  }, { runValidators: true })
	await journal.save()
  const orphanRequestIds = await Promise.all(
    requests.map(async request => {
      const { _id, __v, ...req } = request.toObject() // eslint-disable-line
      await create(req, request.user, journal.billing._id)
      return request._id
    })
  )
  await Request.deleteMany({ _id: { $in: orphanRequestIds }})
  await journal.save()
}

module.exports = activateOrphanRequest
