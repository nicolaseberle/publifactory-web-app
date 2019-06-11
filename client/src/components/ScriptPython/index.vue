<template>
  <div style='width:100%'>
    <el-row :gutter="40" >

        <el-col :span="12">
          <textarea id="code" name="code">
            {{content}}
          </textarea>
        </el-col>
        <el-col :span="12">
          <div style='width:100%'>
            <vue-plotly :data="currentData" :layout="layout" :options="options"/>
          </div>
        </el-col>

    </el-row>
    <el-button @click="execCode()" round>PREVIEW</el-button>

  </div>
</template>
<script>
import Vue from 'vue';
import locales from 'locales/charts'
import VuePlotly from '@statnett/vue-plotly'
import CodeMirror from 'codemirror'
import 'codemirror/mode/python/python.js'
import 'codemirror/lib/codemirror.css'
import '../../styles/one-dark.css'
import { mapGetters } from 'vuex'


import axios from 'axios'


export default {
  name: 'ScriptPython',
  locales,
  components: {VuePlotly},
  props: ['idfigure'],
  data () {
    return {
      postForm: {},
      editor: {},
      content: '',
      html: '',
      id: '',
      currentData: [{
            x: ['Sample A','Sample B','Sample C','Sample D'],
            y: [ 10, 16, 12, 13],
            type: 'bar',
            orientation: 'v'
      }],
      options: {},
      layout: {
        title: 'Distribution',
        showlegend: false
      },
      content:`
import plotly.graph_objs as go
import plotly.io as plio

import numpy as np


# This function is used to insert your values into the plotly graph.
# This function is called in the main to populate data.
def plotly_values():
    y0 = np.random.randn(50) + 1.2
    y1 = np.random.randn(50) + 1
    y2 = np.random.randn(50) * 2
    y3 = np.random.randn(50) * 0.8 + 1

    trace0 = go.Box(
        y=y0,
        name='Sample A'
    )
    trace1 = go.Box(
        y=y1,
        name='Sample B'
    )
    trace2 = go.Box(
        y=y2,
        name='Sample C'
    )
    trace3 = go.Box(
        y=y3,
        name='Sample D'
    )
    data = [trace0, trace1, trace2, trace3]
    return data


# This function is used to modify the title of the graph.
# This function return the layout, and only this variable should be modified.
def plotly_layout():
    layout = "INSERT TITLE HERE"
    return layout


# This function is the main of the project.
# This function call plotly_values to get the data for the plotly graph.
# This part musn't be modified.
def main():
    data = plotly_values()
    layout = go.Layout(title=plotly_layout())
    figure = go.Figure(data=data, layout=layout)
    plio.write_json(figure, './example.json')
    exit(0)


if __name__ == "__main__":
    main()
`
    }
  },
  created () {

  },
  computed: {
    ...mapGetters(['accessToken'])
  },
  mounted () {
    this.editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        value: '',
        lineNumbers: true,
        styleActiveLine: true,
        matchBrackets: true,
        theme: 'one-dark',
        mode: "text/x-python"
     })
    var y0 = [];
    var y1 = [];
    var y2 = [];
    var y3 = [];
    for (var i = 0; i < 50; i ++) {
    	y0[i] = Math.random() + 1.2;
    	y1[i] = Math.random() + 1;
      y2[i] = Math.random()*2;
      y3[i] = Math.random()*0.8+1;
    }

    var trace0 = {
      y: y0,
      type: 'box',
      name: "sample A",
      marker: {
        color: 'rgb(9,56,125)'
      }
    };

    var trace1 = {
      y: y1,
      type: 'box',
      name: "sample B",
      marker: {
        color: 'rgb(9,56,125)'
      }
    };

    var trace2 = {
      y: y2,
      type: 'box',
      name: "sample C",
      marker: {
        color: 'rgb(9,56,125)'
      }
    };

    var trace3 = {
      y: y3,
      type: 'box',
      name: "sample D",
      marker: {
        color: 'rgb(9,56,125)'
      }
    };
    var data = [trace0, trace1, trace2, trace3];
    this.currentData = data
  },
  watch: {
    currentData (newVal) {
      this.saveFigure ()
    }
  },
  methods: {
    saveFigure () {
      console.log('saveFigure: ',this.idfigure)
      axios.put('/api/figure/'  + this.idfigure, { "data": this.currentData,"option":this.option,"layout": this.layout }, {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      })
      .then(response => {
        console.log("figure saved")
      })
      .catch(e => {
        console.log(e)
      })
    },
    fetchFigure(id) {
      var self = this
      axios.get('/api/figure/' + id , {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      }).then(response => {
        self.currentData = response.data.data
        self.layout = response.data.layout
        self.option = response.data.option

      }).catch(err => {
        console.log(err)
      })
    },
    execCode: async function () {
      const response = await new Promise((resolve, reject) => {
        axios.post('/api/figure/python', {
          content: this.content
        }, { headers: { 'Authorization': `Bearer ${this.accessToken}` } })
          .then(done => {
            resolve(done.data)
          })
          .catch(err => {
            reject(err)
          })
      })
      if (!response.data || !response.layout)
        this.$message({
          type: 'error',
          message: this.$t('message.scriptFailure')
        })
      else
        this.$message({
          type: 'success',
          message: this.$t('message.scriptSuccess')
        })
      this.currentData = response.data
      this.layout = response.layout
      if (response.options)
        this.options = response.options
      this.$forceUpdate()
    }
  }
}

</script>
<style>

  .CodeMirror {border: 1px solid silver; margin-bottom: 1em; }
  dt { text-indent: -2em; padding-left: 2em; margin-top: 1em; }
  dd { margin-left: 1.5em; margin-bottom: 1em; }
  dt {margin-top: 1em;}
</style>
