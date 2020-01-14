const { email, backend } = require('../../../config');

const frontUrl = email.rootHTML;
const backUrl =
	process.env.NODE_ENV === 'development'
		? `http://localhost:${backend.port}`
		: `https://${backend.ip}:${backend.port}`;

const emailArticleSubmissionInvitation = (article, journal) => `
<div>
	<div>
		<h4 style="text-align: center;">The ${journal.title} journal selectionned the article: <em>${article.title}</em> to be submitted in their collections.</h4>
		<div>
			<table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
				<tr>
						<td>
								<table style="border-collapse: separate;
								border-spacing: 20px 30px;" border="0" cellspacing="0" cellpadding="0" align="center">
										<tr>
												<td bgcolor="#57a957"
														style="margin: 20px; padding: 12px 26px 12px 26px; border-radius:4px"
														align="center">
														<a href="${frontUrl}/invitationSubmission/${journal._id}/${article._id}/accept"
															style="font-family: 'Arial', sans-serif; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; display: inline-block; text-align: center">
																Submit
														</a>
														<td bgcolor="#ca3535"
														style="padding: 12px 26px 12px 26px; border-radius:4px"
														align="center">
														<a href="${frontUrl}/invitationSubmission/${journal._id}/${article._id}/reject"
															style="font-family: 'Arial', sans-serif; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; display: inline-block; text-align: center">
																Reject
														</a>
												</td>
										</tr>
								</table>
						</td>
				</tr>
			</table>
			<div style="text-align: center; margin-bottom:20px;">
				(You can either submit from here or from your <a href="${frontUrl}/articles/${article._id}">article edition page</a>)
			</div>
  	</div>
	</div>
	<div style="border-top: 1px solid #cccccc; text-align: center;">

      <h6>© Copyright 2018 <a
      href='https://publifactory.co'
      target='_blank'
      rel='noopener noreferrer'
      data-auth='NotApplicable'
      style='font-size:12px; line-height:18px; color:#666666; font-weight:bold'
    >
      Publifactory</a>, All Rights Reserved.</h6>
      <a href='https://app.publifactory.co'> <img widht="25px" height="32px" src="${backUrl}/api/requests/logo/"></a>
    </div>
</div>`;

module.exports = emailArticleSubmissionInvitation;
