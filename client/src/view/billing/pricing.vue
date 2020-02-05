<template>
  <div class='app-container'>
    <div class='pricing-dialog-container'>
    <el-dialog :visible.sync="visiblePricing" width="80%" top="10vh"  title="Pricing">
        <showPricing @close="visiblePricing=false"/>
    </el-dialog>
    <el-dialog :visible.sync="dialogSendEditorVisible" title="Invitation">
        <sendEditorInvitation @close="dialogSendEditorVisible=false"/>
    </el-dialog>
    </div>
  </div>
</template>
<script>

import sendEditorInvitation from './sendRequestToEditor'
import showPricing from './showPricing'
//import createSubscription from './subscription';

export default{
  name: "princing",
  components: {sendEditorInvitation,showPricing},
  data () {
    return {
      loadingAccess: false,
      visibleDiagSubscription: false,
      dialogSendEditorVisible: false,
      visiblePricing: true
    }
  }
}
</script>
<style>
.pricing-dialog-container .el-dialog .el-dialog__header{
  background-color: #FFFFFF;
  padding: 10 0;
}
.pricing-dialog-container .el-dialog .el-dialog__title{
  color: #333;
  font-size: 2rem;
  font-family: 'DNLTPro-bold';
}
</style>
