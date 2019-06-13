<template>
  <div style='width:100%'>
    <el-row >
      <el-col :span="11">
        <div style='width:100%'>
          <textarea id="code" name="code">{{content}}</textarea>
        </div>
      </el-col>
      <el-col :span="12">
        <div class='plotly_js'>
          <vue-plotly :data="currentData" :layout="layout" :options="options"/>
        </div>
        <div class="plotly_js">
          <div class="legend">
            <el-form ref="postForm" :label-position="top" :model="form">
              <el-form-item label="Name of the figure">
                <el-input v-model="postForm.name" disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="Universal Unique IDentifier of the figure">
                <el-input v-model="postForm.uuid_figure" disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="Legend">
                <el-input type="textarea" :rows="3" v-model="postForm.legend" placeholder="Enter the legend of the graph"></el-input>
              </el-form-item>
              <el-form-item label="Source" placeholder="Enter the graph DOI">
                <el-input v-model="postForm.source"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
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
  props: ["idfigure"],
  components: {VuePlotly},
  data () {
    return {
      postForm: {
        legend: '',
        source: 'http://dx.doi.org/00.0000/e0000000',
        name: 'INSERT TITLE HERE',
        uuid_figure: this.idfigure
      },
      editor: {},
      html: '',
      id: '',
      currentData: [{
            x: ['Sample A','Sample B','Sample C','Sample D'],
            y: [ 10, 16, 12, 13],
            type: 'bar',
            orientation: 'v'
      }],
      pythonVersion: '3.7',
      options: {},
      layout: {
        title: 'Distribution',
        showlegend: false
      },
      timer: null,
      content: `
# This file has been formatted to be functional with plotly Python
# Every modification will modify the graphic at the right of your screen.
# You can find some information about plotly and how to make
# good charts here : https://plot.ly/python/

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
        mode: "text/x-python",
        lineWrapping: true
     })
    this.editor.on('change', instance => {
      this.content = instance.getDoc().getValue()
      if (!this.timer) {
        this.$emit('loading', true)
        this.timer = setTimeout(async () => {
          await this.execCode()
          this.timer = null
          this.$emit('loading', true)
        }, 3000)
      }
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
    },
    pythonVersion (newVal) {
      if (newVal === '2.7')
        this.$message({
          message: 'Warning: Python 2.7 will be deprecated in January 2020 and won\'t be maintained anymore.\nThink about to move on Python 3.x version.',
          type: 'warning',
          center: true,
          duration: 5000
        });
    }
  },
  methods: {
    saveFigure () {
      console.log('saveFigure: ',this.idfigure)
      axios.put('http://localhost:4000/api/figure/'  + this.idfigure, {
        data: this.currentData,
        option:this.option,
        layout: this.layout,
        script: {
          language: "Python",
          content: this.content
        }
      }, {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      })
      .then(() => {
        console.log("figure saved")
      })
      .catch(e => {
        console.log(e)
      })
    },
    fetchFigure(id) {
      axios.get('http://localhost:4000/api/figure/' + id , {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      }).then(response => {
        this.currentData = response.data.data
        this.layout = response.data.layout
        this.option = response.data.option
        this.content = response.data.script.content
      }).catch(err => {
        console.log(err)
      })
    },
    async execCode () {
      try {
        const done = await axios.post('http://localhost:4000/api/figure/python', {
          content: this.content,
          version: this.pythonVersion
        }, {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        })
        this.currentData = done.data.values.data
        this.layout.title = done.data.values.layout.title.text.toString()
        this.postForm.name = this.layout.title
        console.log(this.layout)
        if (done.data.options)
          this.options = done.data.values.options
        this.$forceUpdate()
        this.$notify({
          title: 'Script ran well !',
          type: 'success',
          message: this.$t('message.scriptSuccess'),
          offset: 100,
          showClose: false
        })
        console.log(done)
      } catch (e) {
        this.$notify({
          title: 'Error during the script.',
          type: 'error',
          message: e.response.data.message.traceback || this.$t('message.scriptFailure'),
          offset: 100,
          showClose: false
        })
      }
    },
    setVersion (version) {
      this.pythonVersion = version
    }
  }
}

</script>
<style lang="scss">

  .plotly_js {
    width:100%;
    border-left-style: solid;
    border-left-width: 5px;
    border-left-color: #2c3e50;
  }

  .legend {
    width:auto;
    margin-left: 1em;
  }

  .CodeMirror {
    border: 1px solid silver;
    height: auto;
    margin-bottom: 1em;
  }

  dt { text-indent: -2em; padding-left: 2em; margin-top: 1em; }
  dd { margin-left: 1.5em; margin-bottom: 1em; }
  dt {margin-top: 1em;}
</style>
