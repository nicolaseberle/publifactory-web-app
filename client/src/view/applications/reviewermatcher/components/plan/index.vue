<template>
  <div style="width:100%">
    <freePlanStatus v-if="currentPlan==='Free'" :maxInvitation="maxInvitation"/>
    <premiumPlanStatus v-else-if="currentPlan==='Premium'"/>
    <publisherPlanStatus v-else-if="currentPlan==='Activated'" :activated="true"/>
    <publisherPlanStatus v-else :activated="false"/>
  </div>
</template>
<script>
import freePlanStatus from './free-plan-status-bar'
import premiumPlanStatus from './premium-plan-status-bar'
import publisherPlanStatus from './publisher-plan-status-bar'

export default{
  name: 'status',
  components: {freePlanStatus,premiumPlanStatus,publisherPlanStatus},
  props:{
    currentPlan:{
			type: String
		},
    maxInvitation: {
      type: Number
    }
  },
  data () {
    return {

    }
  },
  mounted () {
  }


}
</script>
