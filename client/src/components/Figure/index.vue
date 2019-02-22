<template>
  <div>
    <figure>
        <figcaption>Fig.1 {{layout.title}}</figcaption>
        <div class="figure">
          <vue-plotly :data="currentData" :layout="layout" :options="options"/>
        </div>
        <div class='action-button'>
            <el-button icon="el-icon-edit" type="primary" plain @click="$emit('edit',true)" title="Edit chart" circle v-on:click=""></el-button>
            <el-button icon="el-icon-delete"  type="warning" plain @click="$emit('delete',true)" title="delete chart" circle v-on:click=""></el-button>
        </div>
        <p><span class="font-dnltp-medium">Fig 1. Aging is a 2-phases process.</span> <span class="font-dnltp-medium">A.</span> Aging is characterized by two distinct and consecutive phases. Phase 1 is characterized by a time-dependent increase in the probability of at least one organ–the intestine–to fail. Phase 2 is the terminal phase of life during which a large number of so-called age-related phenotypes occur concomitantly. <span class="font-dnltp-medium">B.</span>                            Each phase can be described by a distinct equation. Phase 1 is defined by a linear equation (y = a t + b–left panel) describing the time-dependent increase of the probability for an individual to turn Smurf. Phase 2 is characterized by a 1-phase exponential decay equation (y = e-kt)–right panel) describing the survival of an isolated Smurf subpopulation. <span class="font-dnltp-medium">C.</span> The longevity curve of a homogenous population (green line) of flies is the sum of the number of non-Smurfs flies (blue line) and living Smurfs (red line). The mathematical equations that lead to the different curves are given in the right panel. The model uses 3 parameters; a is the rate of apparition of the Smurfs in the whole population, t0 = -b/a is the age at which the Smurfs appear in the population and k is the rate constant defining the Smurf longevity.
        </p>
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
