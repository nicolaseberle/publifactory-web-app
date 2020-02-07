<template>
  <div>
    <div class='pricing-container'>
      <el-row>
      <div class='wrapper'>
        <div class='package'>
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
            <el-button class='blue-button' disabled round>Current trial</el-button>
          </div>
        </div>
        <div class='package'>
          <div class='name'>Associate Editor<p style='font-size:0.8rem;'>(Individual plan)</p></div>
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
            <el-button class='blue-button' @click="visibleDiagSubscription=true" round>Update</el-button>
          </div>
        </div>
        <div class='package'>
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
            <el-button class='blue-button' @click='dialogSendEditorVisible=true' round>Send a request to your editor</el-button>
          </div>
        </div>
        <!--
        <div class='package'>
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
            <el-button class='blue-button' @click='dialogSendEditorVisible=true' round>Send a request to your editor</el-button>
          </div>
        </div>-->
      </div>
      </el-row>

    </div>
    <el-row>
    <div class="footer-details"><p>*Only accepted or rejected invitations are counted</p></div>
    </el-row>
    <el-dialog :visible.sync="visibleDiagSubscription"  title="Subscription" width="30%" append-to-body>
        <createSubscription @close="closeCheckout()"/>
    </el-dialog>
    <el-dialog :visible.sync="dialogSendEditorVisible"  title="Invitation" append-to-body>
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
      'userId',
      'accessToken'
    ])
  },
  components: {createSubscription,sendEditorInvitation},
  data () {
    return {
      visibleDiagSubscription: false,
      dialogSendEditorVisible: false
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
