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
      <div class="font-dnltp-medium">
        <p><b style="font-family: DNLTPro-bold;">Legends</b>: {{infos.legend}}</p>
        <p><b style="font-family: DNLTPro-bold;">Source</b>: "{{infos.name}}" from figure n°{{infos.uuid_figure}}</p>
        <p><b style="font-family: DNLTPro-bold;">DOI</b>: {{infos.source}}</p>
      </div>
    </figure>
  </div>
</template>
<script>
import Vue from 'vue';
import locales from 'locales/charts'
import VuePlotly from '@statnett/vue-plotly'
import axios from 'axios'
import { mapGetters } from 'vuex'

const debug = require('debug')('frontend');


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
      }],
      currentData: [{

      }],
      infos: {
        legend: '',
        source: '',
        name: '',
        uuid_figure: ''
      }
    }
  },
  computed: {
    ...mapGetters(['accessToken'])
  },
  created() {
    this.id = this.$route.params && this.$route.params.id
    debug("FigureComponent:: idfigure : " + this.idfigure)

    this.currentData = this.currentData1
  },
  mounted () {
    this.fetchFigure(this.idfigure)
  },
  methods: {
    fetchFigure(id) {
      axios.get('/api/figure/' + id , {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      }).then(response => {
        console.log(response.data)
        this.currentData = response.data.data
        this.layout = response.data.layout
        this.option = response.data.option
        this.infos = response.data.infos
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
