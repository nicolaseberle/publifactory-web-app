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
  data () {
    return {
      options: {},
      layout: {
        title: 'Title',
        showlegend: false
      },
      currentData: [{
            x: ['Sample A','Sample B','Sample C','Sample D'],
            y: [ 10, 9, 12, 13],
            type: 'bar',
            orientation: 'v'
      }]
    }
  },
  created() {
    this.id = this.$route.params && this.$route.params.id

  }
}
</script>
