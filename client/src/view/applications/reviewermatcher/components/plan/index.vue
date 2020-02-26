<template>
  <div style="width:100%">

    <freePlanStatus v-if="currentPlan==='freemium'" :maxInvitation="maxInvitation"/>
    <premiumPlanStatus v-else-if="currentPlan==='premium'"/>
    <disconnectedPlanStatus v-else-if="currentPlan==='disconnected'"/>
    <publisherPlanStatus v-else-if="currentPlan==='activated'" :activated="true"/>
    <publisherPlanStatus v-else :activated="false"/>
  </div>
</template>
<script>
import freePlanStatus from './free-plan-status-bar'
import premiumPlanStatus from './premium-plan-status-bar'
import publisherPlanStatus from './publisher-plan-status-bar'
import disconnectedPlanStatus from './disconnected-status-bar'

export default{
  name: 'status',
  components: {freePlanStatus,premiumPlanStatus,publisherPlanStatus,disconnectedPlanStatus},
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
