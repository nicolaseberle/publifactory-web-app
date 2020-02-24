<template>
    <div>
    <div class='pricing-container'>


      <transition name="slide-fade">
        <el-row>
        <div v-if='!loggedIn' style='margin:0 0 20px 0;'>
          <h1>Pay as you publish</h1>
        </div>


      <div class='wrapper'>

          <el-button v-if='state==false'  icon='el-icon-arrow-left' @click="state=true;statePremium=true" round></el-button>

        <div class='package' v-if='state'>
          <div class='name'>Freemium<p style='font-size:0.8rem;'>(Individual plan)</p></div>

          <div class='price'>€0</div>
          <div class='trial'>Free trial</div>
          <hr>
          <div class='list-item-content'>
          <ul>
            <li><i class="el-icon-check"></i>
              <b>Unlimited</b> research
            </li>
            <li><i class="el-icon-check"></i>
              <b>5 invitations</b>
            </li>
            <li><i class="el-icon-check"></i>
              <b>Unlimited</b> access to your board
            </li>
          </ul>
          </div>
          <div class='footer-pricing'>
            <el-button class='blue-button-trial' disabled round>Current trial</el-button>
          </div>
        </div>
          <div class='package' v-if='statePremium'>
            <div class='name'>Premium<p style='font-size:0.8rem;'>(Individual plan)</p></div>
            <div class='price'>€1</div>
            <div class='trial'>Pay per use</div>
            <hr>
            <div class='list-item-content'>
            <ul>
              <li><i class="el-icon-check"></i>
                <b>Unlimited</b> research
              </li>
              <li><i class="el-icon-check"></i>
                <b>Unlimited</b> invitation
              </li>
              <li><i class="el-icon-check"></i>
                <b>Unlimited</b> access to your board
              </li>
            </ul>
            </div>
            <div class='footer-pricing'>
              <el-button v-if='state' class='blue-button' @click="showSubscriptionView()" round>Update</el-button>
              <el-row v-if='state==false'>
                <el-button  icon='el-icon-arrow-left' @click="state=true" circle></el-button>
              </el-row>
            </div>
          </div>
        <div class='package' v-if='state || !statePremium'>
          <div class='name'>Publisher<p style='font-size:0.8rem;'>(Publisher plan)</p></div>
          <div class='price'>€0.3-1</div>
          <div class='trial'>Pay per use</div>
          <hr>
          <div class='list-item-content'>
            <ul>
              <li><i class="el-icon-check"></i>
                <b>Negociable</b> by volume
              </li>
              <li><i class="el-icon-check"></i>
                <b>Unlimited</b> research
              </li>
              <li><i class="el-icon-check"></i>
                <b>Unlimited</b> invitation
              </li>
              <li><i class="el-icon-check"></i>
                <b>Unlimited</b> collaborator
              </li>
            </ul>
          </div>
          <div class='footer-pricing'>
            <el-button v-if='state' class='blue-button' @click='showEditorView()' round>Send a request to your editor</el-button>
            <el-row v-if='state==false'>
              <el-button  icon='el-icon-arrow-left' @click="state=true,statePremium=true " circle></el-button>
            </el-row>
          </div>
        </div>
        <div v-if='loggedIn'>
          <div class='subscription-package' v-show='state==false & statePremium'>
            <div class='name'>Premium Plan Subscription</div>
            <div class='content'>
              <createSubscription  @close="closeCheckout()"/>
            </div>
          </div>
          <div class='subscription-package' v-show='state==false & !statePremium'>
            <div class='name'>Send a notification to the editor</div>
            <div class='content'   style="margin-top:60px">
              <sendEditorInvitation @close="closeEditorInvitation()"/>
            </div>
          </div>
        </div>
      </div>
      </el-row>
      </transition>


    </div>
    <!--
    <el-row>
      <div class="footer-details"><p>*Only accepted or rejected invitations are counted</p></div>
    </el-row>
    -->

    <el-dialog custom-class='subscribe-dialog-container' top='10vh' :visible.sync="visibleDiagSubscription"  title="Subscription" width="30%" append-to-body>
        <createSubscription @close="closeCheckout()"/>
    </el-dialog>
    <el-dialog custom-class='subscribe-dialog-container' :visible.sync="dialogSendEditorVisible"  title="Invitation" append-to-body>
        <sendEditorInvitation @close="closeEditorInvitation()"/>
    </el-dialog>

  </div>
</template>
<script>
import locales from 'locales/article'
import { mapGetters } from 'vuex'
import axios from 'axios'
import createSubscription from './createSubscription';
import sendEditorInvitation from './sendRequestToEditor'

export default{
  locales,
  name: 'showPrincing',
  computed: {
    ...mapGetters([
      'loggedIn',
      'userId',
      'accessToken'
    ])
  },
  components: {createSubscription,sendEditorInvitation},
  data () {
    return {
      state : true,
      visibleDiagSubscription: false,
      dialogSendEditorVisible: false,
      statePremium: true
    }
  },
  mounted () {
  },
  watch: {
    visibleDiagSubscription (val) {
      if (!val){
        this.$emit('close-pricing')
      }
    }
  },
  methods:{
    showSubscriptionView () {
      this.state = false
      this.statePremium = true
      //visibleDiagSubscription=true
    },
    showEditorView () {
      this.state = false
      this.statePremium = false
      //visibleDiagSubscription=true
    },
    closeCheckout () {
      this.visibleDiagSubscription=false
      this.$emit('close-pricing')

    },
    closeEditorInvitation () {
      this.dialogSendEditorVisible=false
    }

  }


}
</script>
<style>

</style>
