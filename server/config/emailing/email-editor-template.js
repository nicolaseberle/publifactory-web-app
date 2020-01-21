const config = require("../../../config");

const frontUrl = config.url;
const backUrl =
	config.env === "development" ? `http://localhost:4000` : config.url;

console.log(frontUrl, backUrl)

function formatDate(date) {
	return `${new Date(date).toLocaleString()}`;
}

const answer = (request, status) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
body {
	Margin: 0!important;
	padding: 15px;
	background-color: #FFF;
}
.wrapper {
	width: 100%;
	table-layout: fixed;
}
.wrapper-inner {
	width: 100%;
	background-color: #eee;
	max-width: 670px;
	Margin: 0 auto;
}
table {
	border-spacing: 0;
	font-family: sans-serif;
	color: #727f80;
}
.outer-table {
	width: 100%;
	max-width: 670px;
	margin: 0 auto;
	background-color: #FFF;
}
td {
    padding: 0;
}
.header {
    background-color: #C2C1C1;
    border-bottom: 3px solid #81B9C3;
}
p {
    Margin:0;
}
.header p {
    text-align: center;
    padding: 1%;
    font-weight: 500;
    font-size: 11px;
    text-transform: uppercase;
}
a {
    color: #F1F1F1;
    text-decoration: none;
}
.separator{
  height: 20px;
}
/*--- End Outer Table 1 --*/
.main-table-first {
	width: 100%;
	max-width: 610px;
	Margin: 0 auto;
	background-color: #FFF;
	border-radius: 6px;
	margin-top: 25px;
}
/*--- Start Two Column Sections --*/
.two-column {
    text-align: center;
    font-size: 0;
    padding: 5px 0 10px 0;
}
.two-column .section {
    width: 100%;
    max-width: 300px;
    display: inline-block;
    vertical-align: top;
}
.two-column .content {
    font-size: 16px;
    line-height: 20px;
    text-align: justify;
}
.content {
    width: 100%;
    padding-top: 20px;
}
.center {
    display: table;
    Margin: 0 auto;
}
img {
    border: 0;
}
img.logo {
    float: left;
    Margin-left: 5%;
    max-width: 200px!important;
}
#callout {
    float: right;
    Margin: 4% 5% 2% 0;
    height: auto;
    overflow: hidden;
}
#callout img {
    max-width: 20px;
}
.social {
    list-style-type: none;
    Margin-top: 1%;
    padding: 0;
}
.social li {
    display: inline-block;
}
.social li img {
    max-width: 15px;
    Margin-bottom: 0;
    padding-bottom: 0;
}
/*--- Start Outer Table Banner Image, Text & Button --*/
.image img {
    width: 100%;
    max-width: 670px;
    height: auto;
}
.main-table {
    width: 100%;
    max-width: 610px;
    margin: 0 auto;
    background-color: #FFF;
    border-radius: 6px;
}
.one-column .inner-td {
    font-size: 16px;
    line-height: 20px;
    text-align: justify;
}
.inner-td {
    padding: 10px;
}
.h2 {
    text-align: center;
    font-size: 23px;
    font-weight: 600;
    line-height: 45px;
    Margin: 12px;
    color: #4A4A4A;
}
p.center {
    text-align: center;
    max-width: 580px;
    line-height: 24px;
}
.button-holder-center {
    text-align: center;
    Margin: 5% 2% 3% 0;
}
.button-holder {
    float: right;
    Margin: 5% 0 3% 0;
}
.btn {
    font-size: 15px;
    font-weight: 600;
    background: #81BAC6;
    color: #FFF;
    text-decoration: none;
    padding: 9px 16px;
    border-radius: 28px;
}
.btn-valid {
    font-size: 15px;
    font-weight: 600;
    background: #00A388;
    color: #FFF;
    text-decoration: none;
    padding: 9px 16px;
    border-radius: 28px;
}
.btn-dismiss {
    font-size: 15px;
    font-weight: 600;
    background: #FF6138;
    color: #FFF;
    text-decoration: none;
    padding: 9px 16px;
    border-radius: 28px;
}
.btn-unvalaible {
    font-size: 15px;
    font-weight: 600;
    background: #C3C3C3;
    color: #000;
    text-decoration: none;
    padding: 9px 16px;
    border-radius: 28px;
}

/*--- Start Two Column Image & Text Sections --*/
.two-column img {
    width: 100%;
    max-width: 280px;
    height: auto;
}
.two-column .text {
    padding: 10px 0;
}
/*--- Start 3 Column Image & Text Section --*/
.outer-table-2 {
	width: 100%;
	max-width: 670px;
	margin: 22px auto;
	background-color: #C2C1C1;
    border-bottom: 3px solid #81B9C3;
    border-top: 3px solid #81B9C3;
}
.three-column {
    text-align: center;
    font-size: 0;
    padding: 10px 0 30px 0;
}
.three-column .section {
    width: 100%;
    max-width: 200px;
    display: inline-block;
    vertical-align: top;
}
.three-column .content {
    font-size: 16px;
    line-height: 20px;
}
.three-column img {
    width: 100%;
    max-width: 125px;
    height: auto;
}
.outer-table-2 p {
	margin-top: 6px;
	color: #FFF;
	font-size: 18px;
	font-weight: 500;
	line-height: 23px;
}
/*--- Start Two Column Article Section --*/
.outer-table-3 {
    width: 100%;
    max-width: 670px;
    margin: 22px auto;
    background-color: #C2C1C1;
    border-top: 3px solid #81B9C3;
}
.h3 {
	text-align: center;
	font-size: 21px;
	font-weight: 600;
	Margin-bottom: 8px;
	color: #4A4A4A;
}
/*--- Start Bottom One Column Section --*/
.inner-bottom {
	padding: 22px;
}
.h1 {
    text-align: center!important;
    font-size: 25px!important;
    font-weight: 600;
    line-height: 45px;
    Margin: 12px 0 20px 0;
    color: #4A4A4A;
}
.inner-bottom p {
	font-size: 16px;
	line-height: 24px;
	text-align: justify;
}
/*--- Start Footer Section --*/
.footer {
	width: 100%;
	background-color: #C2C1C1;

  padding-right:10px;
	margin: 0 auto;
    color: #FFF;
}
.footer  img {
	max-width: 135px;
	Margin: 0 auto;
	display: block;
	padding: 4% 0 1% 0;
}
p.footer {
	text-align: right;
  font-size: 0.8rem;
	color: #FFF!important;
	line-height: 30px;
	padding-bottom: 4%;
    text-transform: uppercase;
}
/*--- Media Queries --*/
@media screen and (max-width: 400px) {
	.h1 {
		font-size: 22px;
	}
	.two-column .column, .three-column .column {
		max-width: 100%!important;
	}
	.two-column img {
		width: 100%!important;
	}
	.three-column img {
		max-width: 60%!important;
	}
}
@media screen and (min-width: 401px) and (max-width: 400px) {

	.two-column .column {
		max-width: 50%!important;
	}
	.three-column .column {
		max-width: 33%!important;
}
}
@media screen and (max-width:768px) {
img.logo {
	float:none !important;
	margin-left:0% !important;
	max-width: 200px!important;
}

#callout {
	float:none !important;
	margin: 0% 0% 0% 0;
	height: auto;
	text-align:center;
	overflow: hidden;
}
#callout img {
    max-width:26px !important;
}
.two-column .section {
	width: 100% !important;
	max-width: 100% !important;
	display: inline-block;
	vertical-align: top;
}

.two-column img {
	width: 100% !important;
 	height: auto !important;
}
img.img-responsive {
    width:100% !important;
    height:auto !important;
    max-width:100% !important;
}
.content {
	width: 100%;
	padding-top:0px !important;
}
}
</style>
 </head>
<body>
    <div class="wrapper">
    <div>${(backUrl, frontUrl)}</div>
    	<div class="wrapper-inner">
    		<table class="outer-table">
    			<tr>
    				<td class="header">
    					<p><a href="https://app.publifactory.co">Click to view this email in your browser</a></p>
    				</td>
    			</tr> <!--- End Header -->
            </table> <!--- End Outer Table -->
            <table class="main-table-first" style="display:none">
                <tr>
                    <td class="two-column">
                        <div class="section">
                            <table width="100%">
                                <tr>
                                    <td class="inner-td">
                                        <table class="content">
                                            <tr>
                                                <td align="center">
                                                  <!--<a href="index.html#" target="http://publifactory.co/">
                                                    <img src="logo.png" style='width:40px' class="logo">
                                                  </a>-->
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </div> <!--- End First Column of Two Columns -->
                        <div class="section">
                            <table width="100%">
                                <tr>
                                    <td class="inner-td">
                                        <table class="content">
                                            <tr>
                                                <td>
                                                    <div id="callout">
                                                        <ul class="social">
                                                            <!--<li><a href="index.html#" target="https://twitter.com/ThePubliFactory"><img src="twitter.png"></a></li>-->
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </td>
                </tr>
                </table>
            <table class="outer-table">
    			<!--
          <tr>
    				<td class="image">
    					<img src="earth-background.jpg">
    				</td>
    			</tr>--> <!--- End Banner -->
            </table> <!--- End Outer Table -->
            <table class="main-table-first">
    			<tr>
    				<td class="one-column">
    					<table width="100%">
    						<tr>
    							<td class="inner-td">
									<div>
										<p><strong>${request.reviewer.name} ${
	reviewerAnswer[status]
}</strong> to review the <strong><em>${
	request.title
}'s</em></strong> article : ${formatDate(
	request.history.slice(-2, -1)[0].date
)}.
									</p>
										${
											status === "outfield"
												? ""
												: `
												<br>
												<p>
													You can reach him at this address:
													<strong>${request.reviewer.email}</strong>
												</p>
											`
										}
									</div>
    							</td>
    						</tr>
                <tr>
                  <td class="inner-td">
                    <p class="justify">Reviewing deadline: ${
											request.deadline
										}</p>
                  </td>
                </tr>
    					</table>
    				</td>
    			</tr> <!--- End Heading, Paragraph & Button Section -->
          </table>
            <div class='separator'>
            </div>
            <table class="outer-table-3">
    			<tr>
    				<td class="one-column">
    					<table width="100%">
    						<tr>
    							<td class="footer">
    								<!--<img src="logo.png" style='width : 30px;margin-left:10px;'>-->
                    <div class="center">
                       <h6>© Copyright 2018 <a
                        href='https://app.publifactory.co'
                        target='_blank'
                        rel='noopener noreferrer'
                        data-auth='NotApplicable'
                        style='font-size:12px; line-height:18px; font-weight:bold '
                      >
                        Publifactory</a>, All Rights Reserved.</h6>
                      <!--<a href='https://app.publifactory.co'> <img widht="25px" height="32px" src="${backUrl}/api/requests/logo/"></a>-->
                      <img width="0" height="0" src="${backUrl}/api/requests/seen/${
	request._id
}">
                      <h6>Don't want to get a reminded for this review :
                        <a style="text-decoration: none;" href="${frontUrl}/requests/${
	request._id
}/unsubscribed">
                          unsubscribe
                        </a>
                      </h6>
                    </div>

                  </td>
    						</tr>
    					</table>
    				</td>
    			</tr>
    		</table> <!--- End Main Table -->
    	</div> <!--- End Wrapper Inner -->
    </div> <!--- End Wrapper -->
    <br>
</body>

</html>
`;

const accepted = `accepted`;
const rejected = `rejected`;
const outfield = `doesn't have the right skills`;

const reviewerAnswer = {
	accepted,
	rejected,
	outfield
};

const summary = request => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style type="text/css">
body {
	Margin: 0!important;
	padding: 15px;
	background-color: #FFF;
}
.wrapper {
	width: 100%;
	table-layout: fixed;
}
.wrapper-inner {
	width: 100%;
	background-color: #eee;
	max-width: 670px;
	Margin: 0 auto;
}
table {
	border-spacing: 0;
	font-family: sans-serif;
	color: #727f80;
}
.outer-table {
	width: 100%;
	max-width: 670px;
	margin: 0 auto;
	background-color: #FFF;
}
td {
    padding: 0;
}
.header {
    background-color: #C2C1C1;
    border-bottom: 3px solid #81B9C3;
}
p {
    Margin:0;
}
.header p {
    text-align: center;
    padding: 1%;
    font-weight: 500;
    font-size: 11px;
    text-transform: uppercase;
}
a {
    color: #F1F1F1;
    text-decoration: none;
}
.separator{
  height: 20px;
}
/*--- End Outer Table 1 --*/
.main-table-first {
	width: 100%;
	max-width: 610px;
	Margin: 0 auto;
	background-color: #FFF;
	border-radius: 6px;
	margin-top: 25px;
}
/*--- Start Two Column Sections --*/
.two-column {
    text-align: center;
    font-size: 0;
    padding: 5px 0 10px 0;
}
.two-column .section {
    width: 100%;
    max-width: 300px;
    display: inline-block;
    vertical-align: top;
}
.two-column .content {
    font-size: 16px;
    line-height: 20px;
    text-align: justify;
}
.content {
    width: 100%;
    padding-top: 20px;
}
.center {
    display: table;
    Margin: 0 auto;
}
img {
    border: 0;
}
img.logo {
    float: left;
    Margin-left: 5%;
    max-width: 200px!important;
}
#callout {
    float: right;
    Margin: 4% 5% 2% 0;
    height: auto;
    overflow: hidden;
}
#callout img {
    max-width: 20px;
}
.social {
    list-style-type: none;
    Margin-top: 1%;
    padding: 0;
}
.social li {
    display: inline-block;
}
.social li img {
    max-width: 15px;
    Margin-bottom: 0;
    padding-bottom: 0;
}
/*--- Start Outer Table Banner Image, Text & Button --*/
.image img {
    width: 100%;
    max-width: 670px;
    height: auto;
}
.main-table {
    width: 100%;
    max-width: 610px;
    margin: 0 auto;
    background-color: #FFF;
    border-radius: 6px;
}
.one-column .inner-td {
    font-size: 16px;
    line-height: 20px;
    text-align: justify;
}
.inner-td {
    padding: 10px;
}
.h2 {
    text-align: center;
    font-size: 23px;
    font-weight: 600;
    line-height: 45px;
    Margin: 12px;
    color: #4A4A4A;
}
p.center {
    text-align: center;
    max-width: 580px;
    line-height: 24px;
}
.button-holder-center {
    text-align: center;
    Margin: 5% 2% 3% 0;
}
.button-holder {
    float: right;
    Margin: 5% 0 3% 0;
}
.btn {
    font-size: 15px;
    font-weight: 600;
    background: #81BAC6;
    color: #FFF;
    text-decoration: none;
    padding: 9px 16px;
    border-radius: 28px;
}
.btn-valid {
    font-size: 15px;
    font-weight: 600;
    background: #00A388;
    color: #FFF;
    text-decoration: none;
    padding: 9px 16px;
    border-radius: 28px;
}
.btn-dismiss {
    font-size: 15px;
    font-weight: 600;
    background: #FF6138;
    color: #FFF;
    text-decoration: none;
    padding: 9px 16px;
    border-radius: 28px;
}
.btn-unvalaible {
    font-size: 15px;
    font-weight: 600;
    background: #C3C3C3;
    color: #000;
    text-decoration: none;
    padding: 9px 16px;
    border-radius: 28px;
}

/*--- Start Two Column Image & Text Sections --*/
.two-column img {
    width: 100%;
    max-width: 280px;
    height: auto;
}
.two-column .text {
    padding: 10px 0;
}
/*--- Start 3 Column Image & Text Section --*/
.outer-table-2 {
	width: 100%;
	max-width: 670px;
	margin: 22px auto;
	background-color: #C2C1C1;
    border-bottom: 3px solid #81B9C3;
    border-top: 3px solid #81B9C3;
}
.three-column {
    text-align: center;
    font-size: 0;
    padding: 10px 0 30px 0;
}
.three-column .section {
    width: 100%;
    max-width: 200px;
    display: inline-block;
    vertical-align: top;
}
.three-column .content {
    font-size: 16px;
    line-height: 20px;
}
.three-column img {
    width: 100%;
    max-width: 125px;
    height: auto;
}
.outer-table-2 p {
	margin-top: 6px;
	color: #FFF;
	font-size: 18px;
	font-weight: 500;
	line-height: 23px;
}
/*--- Start Two Column Article Section --*/
.outer-table-3 {
    width: 100%;
    max-width: 670px;
    margin: 22px auto;
    background-color: #C2C1C1;
    border-top: 3px solid #81B9C3;
}
.h3 {
	text-align: center;
	font-size: 21px;
	font-weight: 600;
	Margin-bottom: 8px;
	color: #4A4A4A;
}
/*--- Start Bottom One Column Section --*/
.inner-bottom {
	padding: 22px;
}
.h1 {
    text-align: center!important;
    font-size: 25px!important;
    font-weight: 600;
    line-height: 45px;
    Margin: 12px 0 20px 0;
    color: #4A4A4A;
}
.inner-bottom p {
	font-size: 16px;
	line-height: 24px;
	text-align: justify;
}
/*--- Start Footer Section --*/
.footer {
	width: 100%;
	background-color: #C2C1C1;

  padding-right:10px;
	margin: 0 auto;
    color: #FFF;
}
.footer  img {
	max-width: 135px;
	Margin: 0 auto;
	display: block;
	padding: 4% 0 1% 0;
}
p.footer {
	text-align: right;
  font-size: 0.8rem;
	color: #FFF!important;
	line-height: 30px;
	padding-bottom: 4%;
    text-transform: uppercase;
}
/*--- Media Queries --*/
@media screen and (max-width: 400px) {
	.h1 {
		font-size: 22px;
	}
	.two-column .column, .three-column .column {
		max-width: 100%!important;
	}
	.two-column img {
		width: 100%!important;
	}
	.three-column img {
		max-width: 60%!important;
	}
}
@media screen and (min-width: 401px) and (max-width: 400px) {

	.two-column .column {
		max-width: 50%!important;
	}
	.three-column .column {
		max-width: 33%!important;
}
}
@media screen and (max-width:768px) {
img.logo {
	float:none !important;
	margin-left:0% !important;
	max-width: 200px!important;
}

#callout {
	float:none !important;
	margin: 0% 0% 0% 0;
	height: auto;
	text-align:center;
	overflow: hidden;
}
#callout img {
    max-width:26px !important;
}
.two-column .section {
	width: 100% !important;
	max-width: 100% !important;
	display: inline-block;
	vertical-align: top;
}

.two-column img {
	width: 100% !important;
 	height: auto !important;
}
img.img-responsive {
    width:100% !important;
    height:auto !important;
    max-width:100% !important;
}
.content {
	width: 100%;
	padding-top:0px !important;
}
}
</style>
 </head>
<body>
    <div class="wrapper">
    	<div class="wrapper-inner">
    		<table class="outer-table">
    			<tr>
    				<td class="header">
    					<p><a href="https://app.publifactory.co">Click to view this email in your browser</a></p>
    				</td>
    			</tr> <!--- End Header -->
            </table> <!--- End Outer Table -->
            <table class="main-table-first" style="display:none">
                <tr>
                    <td class="two-column">
                        <div class="section">
                            <table width="100%">
                                <tr>
                                    <td class="inner-td">
                                        <table class="content">
                                            <tr>
                                                <td align="center">
                                                  <!--<a href="index.html#" target="http://publifactory.co/">
                                                    <img src="logo.png" style='width:40px' class="logo">
                                                  </a>-->
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </div> <!--- End First Column of Two Columns -->
                        <div class="section">
                            <table width="100%">
                                <tr>
                                    <td class="inner-td">
                                        <table class="content">
                                            <tr>
                                                <td>
                                                    <div id="callout">
                                                        <ul class="social">
                                                            <!--<li><a href="index.html#" target="https://twitter.com/ThePubliFactory"><img src="twitter.png"></a></li>-->
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </td>
                </tr>
                </table>
            <table class="outer-table">
    			<!--
          <tr>
    				<td class="image">
    					<img src="earth-background.jpg">
    				</td>
    			</tr>--> <!--- End Banner -->
            </table> <!--- End Outer Table -->
            <table class="main-table-first">
    			<tr>
    				<td class="one-column">
    					<table width="100%">
    						<tr>
    							<td class="inner-td">
    								${request.content}
    							</td>
    						</tr>
                <tr>
                  <td class="inner-td">
                    <p class="justify">Reviewing deadline: 20/12/2019</p>
                  </td>
                </tr>
    					</table>
              <table style="border-collapse: separate;
              border-spacing: 20px 30px;" border="0" cellspacing="0" cellpadding="0" align="center">
                  <tr>
                          <td>
                          <a  class="btn-valid" style="font-family: 'Arial', sans-serif; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; display: inline-block; text-align: center">
                              Accept
                          </a>
                          </td>
                          <td>
                          <a  class="btn-dismiss" style="font-family: 'Arial', sans-serif; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; display: inline-block; text-align: center">
                              Reject
                          </a>
                          </td>
                          <td>
                          <a class="btn-unvalaible" style="font-family: 'Arial', sans-serif; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; display: inline-block; text-align: center">
                              Not my field
                          </a>
                          </td>
                      </td>
                  </tr>
              </table>
    				</td>
    			</tr> <!--- End Heading, Paragraph & Button Section -->


          </table>
            <div class='separator'>
            </div>
            <table class="main-table" style="display:none">
              <tr>
                  <td class="one-column">
                      <table width="100%">
                          <tr>
                              <td class="inner-bottom">
                                  <p class="h1">About Publifactory</p>
                                  <p>Sed a ipsum quis neque mollis iaculis. Suspendisse dictum rhoncus elit, quis blandit mauris vulputate non. Aliquam erat volutpat. Integer luctus turpis eros, in auctor lacus auctor nec. Proin suscipit, nisl a accumsan ornare, justo diam aliquam nisi, vel viverra elit purus et ligula. Maecenas nec sodales tortor. Integer a pulvinar nisl, et malesuada lorem. Vivamus venenatis dolor vel nibh iaculis, posuere molestie ipsum rutrum. Nam volutpat sapien eget dui mollis convallis. Sed et enim enim. Vestibulum varius justo arcu, sit amet faucibus velit euismod eu. Curabitur ornare orci at diam rutrum, vel semper elit congue. Aenean sodales, magna id mollis cursus, felis justo eleifend magna, non commodo urna neque sed lectus. Morbi finibus nisi et viverra tincidunt. Ut ultrices viverra arcu, at interdum nisl aliquet eu. Pellentesque sagittis nunc ex, id congue turpis lacinia et.</p>
                                  <div class="button-holder">
                                      <a class="btn" href="https://goo.gl/ikuG8Q">Manifesto</a>
                                  </div>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>

            </table>
            <table class="outer-table-3">
    			<tr>
    				<td class="one-column">
    					<table width="100%">
    						<tr>
    							<td class="footer">
    								<!--<img src="logo.png" style='width : 30px;margin-left:10px;'>-->
                    <div class="center">
                       <h6>© Copyright 2018 <a
                        href='https://app.publifactory.co'
                        target='_blank'
                        rel='noopener noreferrer'
                        data-auth='NotApplicable'
                        style='font-size:12px; line-height:18px; font-weight:bold '
                      >
                        Publifactory</a>, All Rights Reserved.</h6>
                      <!--<a href='https://app.publifactory.co'> <img widht="25px" height="32px" src="${backUrl}/api/requests/logo/"></a>-->
                      <img width="0" height="0" src="${backUrl}/api/requests/seen/${request._id}">
                      <h6>Don't want to get a reminded for this review :
                        <a style="text-decoration: none;" href="${frontUrl}/requests/${request._id}/unsubscribed">
                          unsubscribe
                        </a>
                      </h6>
                    </div>

                  </td>
    						</tr>
    					</table>
    				</td>
    			</tr>
    		</table> <!--- End Main Table -->
    	</div> <!--- End Wrapper Inner -->
    </div> <!--- End Wrapper -->
    <br>
</body>

</html>
`;

module.exports = {
	answer,
	summary
};
