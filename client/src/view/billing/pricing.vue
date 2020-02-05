<template>
  <div class='app-container'>
    <div class='pricing-container'>
      <div class='title-pricing'>
        <h1 style="text-align:left;">Pricing</h1>
      </div>
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
        <div class='package brilliant'>
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
      </div>
    </div>
      <el-dialog :visible.sync="visibleDiagSubscription" title="Subscription">
          <createSubscription @close="visibleDiagSubscription=false"/>
      </el-dialog>
      <el-dialog :visible.sync="dialogSendEditorVisible" title="Invitation">
          <sendEditorInvitation @close="dialogSendEditorVisible=false"/>
      </el-dialog>
    </div>
</template>
<script>
import createSubscription from './createSubscription';
import sendEditorInvitation from './sendRequestToEditor'
//import createSubscription from './subscription';

export default{
  name: "princing",
  components: {createSubscription,sendEditorInvitation},
  data () {
    return {
      loadingAccess: false,
      visibleDiagSubscription: false,
      dialogSendEditorVisible: false
    }
  }

}
</script>
