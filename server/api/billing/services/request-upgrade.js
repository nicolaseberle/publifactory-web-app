const Journal = require('../../journal/journal.model')
const User = require('../../user/user.model')
const { ApiError } = require('../../../config/error')
const { journalGetRole } = require('../../roles/services')
const Email = require('../../email/email.controller')
const { emailRequestUpgrade } = require('../../../config/emailing')

async function requestUpgrade ({ journalId, userId }) {
  const journal = await Journal.findById(journalId).populate('billing')
  if (!journal) throw new ApiError('JOURNAL_NOT_FOUND')

  if (!journal.billing) throw new ApiError('BILLING_NOT_FOUND')
  if (!journal.billing.plan === 'premium') {
    throw new ApiError('BILLING_ALREADY_PREMIUM')
  }

  const associateEditor = await User.findById(userId)
  if (!associateEditor) throw new ApiError('USER_NOT_FOUND')
  const editor = await journalGetRole({ journalId, right: 'editor' })
  const email = new Email(editor.id_user.email)
  email.sendEmail({
    subject: 'Suggestion from an associate editor',
    html: emailRequestUpgrade(associateEditor, { ...journal, billing: { ...journal.billing, subscription: await journal.billing.subscription }})
  })
  return undefined
}

module.exports = requestUpgrade
