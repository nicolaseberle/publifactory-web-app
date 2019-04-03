<template>
  <div>
    <figure>
        <figcaption>Fig.1 : {{layout.title}}</figcaption>
        <div class="figure">
          <vue-plotly :data="currentData" :layout="layout" :options="options"/>
        </div>
        <div class='action-button'>
            <el-button icon="el-icon-edit" type="primary" plain @click="$emit('edit',true)" title="Edit chart" circle v-on:click=""></el-button>
            <el-button icon="el-icon-delete"  type="warning" plain @click="$emit('delete',true)" title="delete chart" circle v-on:click=""></el-button>
        </div>
        <p><span class="font-dnltp-medium">Fig 1. </span></p>
    </figure>
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
  props: ["idfigure"],
  data () {
    return {
      options: {},
      layout: {
        title: 'Title',
        showlegend: false
      },
      currentData1: [{
            x: ['Sample A','Sample B','Sample C','Sample D'],
            y: [ 10, 9, 12, 13],
            type: 'bar',
            orientation: 'v'
      }]
    }
  },
  created() {
    this.id = this.$route.params && this.$route.params.id
    console.log("FigureComponent:: idfigure : " + this.idfigure)

    this.currentData = this.currentData1

    this.fetchFigure(this.idfigure)
  },
  mounted () {
    this.fetchFigure(this.idfigure)
  },
  methods: {
    fetchFigure(id) {
      var self = this
      axios.get('/api/figure/' + id ).then(response => {
        self.currentData = response.data.data
        self.layout = response.data.layout
        self.option = response.data.option

      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
