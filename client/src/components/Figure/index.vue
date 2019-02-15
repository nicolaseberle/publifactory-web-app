<template>
  <div>
      <vue-plotly :data="currentData" :layout="layout" :options="options"/>
  </div>
</template>
<script>
import Vue from 'vue';
import locales from 'locales/charts'
import VuePlotly from '@statnett/vue-plotly'
import axios from 'axios'

export default {
  name: 'figureComponent',
  locales,
  components: {VuePlotly},
  props: ["value","idfigure"],
  data () {
    return {
      options: {},
      layout: {
        title: 'Title',
        showlegend: false
      },
      currentData1: [{
            x: ['Goden Open Access','Green Open Access','Daimond Open Access','Subscription'],
            y: [ 12, 6, 3, 40],
            type: 'bar',
            orientation: 'v'
      }],
      currentData2: [{
            x: ['Sample A','Sample B','Sample C','Sample D'],
            y: [ 10, 9, 12, 13],
            type: 'bar',
            orientation: 'v'
      }]
    }
  },
  created() {
    this.id = this.$route.params && this.$route.params.id
    if (this.value===2){
      this.currentData = this.currentData1
    }
    else{
      this.currentData = this.currentData2
    }
    console.log('Figure Component : ' + this.idfigure)
  }
}
</script>
