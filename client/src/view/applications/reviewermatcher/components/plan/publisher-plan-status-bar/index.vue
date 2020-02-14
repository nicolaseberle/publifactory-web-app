<template>
	<div class='plan-box'>
			<div v-if='activated' class='mv3 bg-lightest-green bl bw2 green'>
				<div class='flex-l items-center justify-between'>
					<div class='bill-title-free-plan'>Activated account</div>
					<div class='bill-content-free-plan'>Publisher has activated his account, you can use it</div>
				</div>
			</div>
			<div v-else class='mv3 bg-lightest-yellow bl bw2 yellow'>
				<div class='flex-l items-center justify-between'>
					<div class='bill-title-free-plan'>Non-Activated account</div>
					<div class='bill-content-free-plan'>Publisher has not activated his account</div>
				</div>
			</div>
	</div>
</template>

<script>
import { mapGetters } from "vuex";

// To get cookies : this.$cookie.get("maxInvitation");

export default {
  name: "publisherPlanStatusBar",
  props: {
    activated: {
      type: Boolean
    }
  },
  data() {
    return {

    };
  },
  methods: {
  },
  watch: {

  }
};
</script>

<style scoped>
.mv3{
  margin: 1rem 0;
  padding:  0.5rem 1rem ;
  border-radius: 2px;
}

.bw2 {
    border-width: 4px;
}

.light-blue {
    color: rgb(48, 65, 86);
}
.red {
    color:#ea261a;
}
.green{
    color: #458227;
}
.yellow{
  color: #DB9107;
}

.bg-lightest-light-blue {
    background-color: #F0F7FF;
}

.bg-lightest-red {
    background-color: #fdd;
}

.bg-lightest-green {
    background-color: rgb(225, 243, 216);
}

.bg-lightest-yellow {
    background-color: #FAF4D0;
}

.bl{
  border-left-style: solid;
}

.items-center {
    -ms-flex-align: center;
    align-items: center;

}

@media screen and (min-width: 60em)
.flex-l {
    display: -ms-flexbox;
    display: flex;
}

.justify-between {
    -ms-flex-pack: justify;
    justify-content: space-between;
}

.bill-title-free-plan{
  font-size: 0.9rem;
  display: block;
  font-family: "DNLTPro-bold";
  line-height: 1;
}

.bill-content-free-plan{
  font-size: 0.7rem;
  display: block;
  font-family: "DNLTPro-regular";
  line-height: 1;
}

.pv2{
  padding-top: .5rem;
  padding-bottom: .5rem;
}
.mv1{
  margin-top: .25rem;
  margin-bottom: .25rem;
}
.mv2{
  margin-top: .5rem;
  margin-bottom: .5rem;
}

.plan-box{
  font-family: "DNLTPro-bold";
  text-align:left;
	margin-left:30px;
}

.plan-box-content{
  text-align: left;
  margin-left:5px;
	width: 100%;
}
</style>
