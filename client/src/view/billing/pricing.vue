<template>
    <div>
    <div class='pricing-container'>


      <transition name="slide-fade">
        <el-row>
        <div class='title-pricing'>
          <h1>Pricing Plans</h1>
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
              <b>10 invitations</b>
            </li>
            <li><i class="el-icon-check"></i>
              <b>Unlimited</b> access to your board
            </li>
          </ul>
          </div>
          <div class='footer-pricing'>
             <router-link :to="{path: '/register'}">
               <el-button class='blue-button' round>Sign Up Free</el-button>
             </router-link>
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
              <router-link :to="{path: '/register'}">
                <el-button v-if='state' class='blue-button' round>Sign up</el-button>
              </router-link>
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

          <div class='subscription-package' v-show='state==false & !statePremium'>
            <div class='name'>Send a notification to the editor</div>
            <div class='content'   style="margin-top:60px">
              <sendEditorInvitation @close="closeEditorInvitation()"/>
            </div>
          </div>

      </div>
      </el-row>
    </transition>
    </div>
    <div class='faq-container'>

            <h1>FAQ</h1>
            <el-row :gutter='80'>
              <el-col :span='8' :offset='4'>
                <div class='item-title'><h2>How does per-use pricing work?</h2></div>
                <div class='item-content'>
                  <p>You are charged based on the number of invitations that you sent to reviewer. Consistent month-to-month usage results in a consistent invoice.</p>
                </div>
                <div class='item-title'><h2>Do you offer annual plans?</h2></div>
                <div class='item-content'>
                  <p>We will announce annual plans for the beta version. To make sure you get the news, <router-link :to="{path: '/register'}"><a>Sign up for free</a></router-link></p>
                </div>
                <div class='item-title'><h2>How does Semaphore keep my code safe?</h2></div>
                <div class='item-content'>
                    <p>We don't store your code or credit card number on our server, transactions are synchronized with <a href='https://stripe.com/fr'>Stripe</a>, one of the safest service to make safe payments.</p>
                </div>
                <div class='item-title'><h2>Am I charged if the newspaper has an activated account?</h2></div>
                <div class='item-content'>
                    <p>No, you have to select in the invitation "editorial use", the journal will be charged</p>
                </div>

              </el-col>
              <el-col :span='8'>
                <div class='item-title'><h2>How does the credit system work?</h2></div>
                <div class='item-content'>
                    <p>After signing up, $10 of free credits are offered. If you've used all your free credits, Publifactory will block new invitation</p>
                </div>
                <div class='item-title'><h2>What forms of payment do you accept?</h2></div>
                <div class='item-content'>
                    <p>We accept all major credit cards: Visa, Mastercard, American Express, Discover</p>
                </div>
                <div class='item-title'><h2>Am I committed over a period of time?</h2></div>
                <div class='item-content'>
                    <p>No, you can decide to disengage at any time. </p>
                </div>

              </el-col>

            </el-row>



    </div>
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
.pricing-container{
  position: relative;
  padding-bottom:100px;
  background-image: linear-gradient(#FFFFFF,#FFF );
  clip-path: polygon(
    0 0,
    100% 0,
    100% 100%,
    0 calc(100% - 5vw)
  );

}


.faq-container {
  margin-top: -5vw;
  padding-bottom:100px;
  /*background-image: linear-gradient(135deg, #2C305E, #181A33);*/
  background-image: linear-gradient(135deg,#2E4054, #202D3B);
}
.faq-container  h1 {
  font-size: 3rem;
  margin: 0;
  padding: 100px 0 0 0;
  color: white;
  text-align: center;
  font-family: 'DNLTPro-bold';
}

.item-title {
  margin-top:60px;
}
.item-title h2{
  font-size: 1.6rem;
  color: white;
  font-family: 'DNLTPro-bold';
}
.item-content{
  color: white;
  font-size: 1.1rem;
  text-align: justify;
  text-justify: inter-word;
  font-family: "Helvetica Neue",sans-serif;
}
.item-content a{
  color:#3a8ee6;
}
.item-content a:hover{
  color:#66b1ff;
}
</style>
