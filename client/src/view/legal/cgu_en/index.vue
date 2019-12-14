<template>
      <div class="main-container">
      <el-row>
          <div class="header">
              <h1>Term Of Use</h1>
              <h2>Publifactory Privacy & Terms Overview</h2>
              <div class='version'>Last Modified: 12th November 2019</div>

              <p>All use of Publifactory web pages located within <i> app.publifactory.com </i>is subject to the terms and conditions set forth below (“Terms”), provided however that additional terms of use may apply with respect to certain PubliFactory websites, as specified on each such website. Any use of such web pages constitutes the user’s agreement to abide by the Terms. We may amend the Terms at any time by posting the amended terms on this site.</p>
              <p>Below you will find the full Privacy Notice, Cookie Policy, License & Site Access, Trademark, Copyright, Electronic Communications for the Publifactory services</p>

          </div>
      </el-row>
      <el-row>
          <div class="content">
            <el-collapse v-model="activeNames">
              <el-collapse-item name="1">
                <template slot="title">
                  <h2>Privacy Notice</h2>
                </template>
                <div class='version'>Last Modified: 12th November 2019</div>
                <div class='subcontent'>
                Please note that Publifactory's Privacy Policy is reviewed periodically. Publifactory reserves the right to modify its Privacy Policy at any time without notice. Any changes to the Privacy Policy will be posted on this page and will become effective on the date of posting. We encourage you to periodically review this page for the latest information on our privacy practices.</p>
                </div>
              </el-collapse-item>
              <el-collapse-item name="2">
                <template slot="title">
                  <h2>Cookie Policy</h2>
                </template>
                <div class='version'>Last Modified: 12th November 2019</div>
                <div class='subcontent'>
                <p>
                  We use “cookies” to collect information and improve Publifactory. A cookie is a small data file that we transfer to your device. We may use “persistent cookies” to save your registration ID and login password for future logins to Publifactory. We may use “session ID cookies” to enable certain features of Publifactory, to better understand how you interact with it and to monitor aggregate usage and web traffic routing. You can instruct your browser, by changing its options, to stop accepting cookies or to prompt you before accepting a cookie from the websites you visit. If you do not accept cookies, however, you may not be able to use all aspects of Publifactory.

                  We also collect some information (ourselves or using third party services, including Google Analytics) using logging and cookies, such as IP address, which can sometimes be correlated with personal data. We use this information for the above purposes and to monitor and analyse use of Publifactory, for Publifactory's technical administration, to increase its functionality and user-friendliness, and to verify users have the authorisation needed to process their requests.

                  More information on data privacy in respect of Google Analytics is available at <a href='https://www.google.co.uk/intl/en/analytics/privacyoverview.html'>https://www.google.co.uk/intl/en/analytics/privacyoverview.html</a> and details about how to opt out can be found at <a href='https://www.google.com/intl/en/policies/privacy/partners'>https://www.google.com/intl/en/policies/privacy/partners</a>.

                </p>
                </div>
              </el-collapse-item><!--
              <el-collapse-item name="3">
                <template slot="title">
                  <h2>General Terms</h2>
                </template>
                <div class='version'>Last Modified: 12th November 2019</div>
                <div class='subcontent'>
                Misuse of service
                <p>Users must not misuse the Publons service. Misuse of the Publons service includes (but is not limited to):

                Submitting content that is inaccurate, untruthful or known not to be your own genuine opinion;
                Submitting content which is unlawful, defamatory, libellous, abusive, discriminatory or obscene;
                Impersonating any person or entity;
                Misrepresenting your affiliation with any person or entity;
                Undertaking activity using the Publons service with the purpose of solely raising your own profile at the expense of sincerely-added, constructive and valuable content or actions.
                Searching for reviewers or editors and contacting them outside of our official and trusted channels.
                </p>
                </div>
              </el-collapse-item>
              <el-collapse-item  name="4">
                <template slot="title">
                  <h2>Trademark</h2>
                </template>
                <div class='version'>Last Modified: 12th November 2019</div>
                <div class='subcontent'>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae ultricies metus. Maecenas et eros dolor. Fusce ac tellus magna. Aenean porttitor condimentum felis vitae condimentum. Suspendisse potenti. Duis tempus ante enim, eget placerat diam varius at. Suspendisse pellentesque, sapien ultricies pulvinar tincidunt, ante justo dictum leo, id interdum nibh dui nec metus. Nunc lectus augue, semper eu iaculis sed, semper id nisi. In id aliquet tellus, sodales mattis urna. Interdum et malesuada fames ac ante ipsum primis in faucibus. Proin sed est molestie odio ornare varius eget sed tortor. Pellentesque et enim sit amet erat accumsan interdum. Praesent vel hendrerit eros. Sed euismod maximus malesuada. Maecenas congue massa et velit placerat, in pulvinar felis viverra.</p>
                </div>
              </el-collapse-item>
              <el-collapse-item  name="5">
                <template slot="title">
                  <h2>Copyright</h2>
                </template>
                <div class='version'>Last Modified: 12th November 2019</div>
                <div class='subcontent'>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vitae ultricies metus. Maecenas et eros dolor. Fusce ac tellus magna. Aenean porttitor condimentum felis vitae condimentum. Suspendisse potenti. Duis tempus ante enim, eget placerat diam varius at. Suspendisse pellentesque, sapien ultricies pulvinar tincidunt, ante justo dictum leo, id interdum nibh dui nec metus. Nunc lectus augue, semper eu iaculis sed, semper id nisi. In id aliquet tellus, sodales mattis urna. Interdum et malesuada fames ac ante ipsum primis in faucibus. Proin sed est molestie odio ornare varius eget sed tortor. Pellentesque et enim sit amet erat accumsan interdum. Praesent vel hendrerit eros. Sed euismod maximus malesuada. Maecenas congue massa et velit placerat, in pulvinar felis viverra.</p>
              </div>
            </el-collapse-item>-->
            </el-collapse>
            <h2></h2>
          </div>
      </el-row>
    </div>
</template>
<script>

export default{
  data () {
    return {
      activeNames: ['1']
    }
  }

}
</script>
<style>
.main-container{
  max-width: 1140px;
}

.content{margin-bottom:100px;}

.header{
  text-align: center;
  margin-bottom: 50px;
}
.header p{text-align:left;font-size:1rem;}
.header h1{font-family: 'DNLTPro-bold';padding-bottom:40px;}
.header h2{font-family: 'DNLTPro-medium-italic';text-align:left;}

.subcontent{
  text-align: left;

}
.subcontent h2{font-family: 'DNLTPro-bold';font-size:1.2rem;}
.subcontent p{text-align:left;}

.version {
  font-family: 'DNLTPro-light-italic';
  font-size: 1rem;
  text-align:left;
}
.subcontent{
  font-size: 1rem;
}
</style>
