const { email, backend } = require('../../../config');

const frontUrl = email.rootHTML;
const backUrl =
	process.env.NODE_ENV === 'development'
		? `http://localhost:${backend.port}`
		: `https://${backend.ip}:${backend.port}`;

const emailInviteReviewer = article => `
  <div>
  </div>
  <div style="text-align: center;">
    <h4 style="padding-bottom: 5px;">You were invited to review an Article: </h4>
      <h4> <em>${article.title}</em></h4>
  <div style="
    padding: 10px 20px 10px 20px;
    border: 0.5px solid #C0C0C0;
    background-color: #F8F8F8;
  ">
    <h4>${article.abstract}</h4>
  </div>
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
                        <a href="${frontUrl}/invitationReview/${article._id}/accepted"
                          style="font-family: 'Arial', sans-serif; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; display: inline-block; text-align: center">
                            Accept
                        </a>
                        <td bgcolor="#ca3535"
                        style="padding: 12px 26px 12px 26px; border-radius:4px"
                        align="center">
                        <a href="${frontUrl}/invitationReview/${article._id}/rejected"
                          style="font-family: 'Arial', sans-serif; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; display: inline-block; text-align: center">
                            Reject
                        </a>
                        </td>
                        <td bgcolor="#556270"
                        style="padding: 12px 26px 12px 26px; border-radius:4px"
                        align="center">
                        <a href="${frontUrl}/invitationReview/${article._id}/outfield"
                          style="font-family: 'Arial', sans-serif; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; display: inline-block; text-align: center">
                            Not my field
                        </a>
                        </td>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
  </table>
  </div>
  <div style="border-top: 1px solid #cccccc;">
  </div>
  <div>
     <h6>© Copyright 2018 <a
      href='http://publifactory.co'
      target='_blank'
      rel='noopener noreferrer'
      data-auth='NotApplicable'
      style='font-size:12px; line-height:18px; color:#666666; font-weight:bold'
    >
      Publifactory</a>, All Rights Reserved.</h6>
  </div>`;

module.exports = emailInviteReviewer;
