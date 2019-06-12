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
    props: ["idfigure"],
    components: {VuePlotly},
    data () {
      return {
        postForm: {},
        editor: {},
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
        timer: null,
        content: `
# This file has been formatted to be functional with plotly R
# Every modification will modify the graphic at the right of your screen.
# You can find some information about plotly and how to make
# good charts here : https://plot.ly/r/

# This line is used to give the plotly library and musn't be removed
library(plotly)
library(rjson)

# This function contains values to print with the type of the plot,
# options and values to print.
# This function contains a lot of idea for your plots.
# Don't forget to check the documentation : some examples are given.
plotly_graphs <- function (name_layout) {
  y1 <- c(0.75, 5.25, 5.5, 6, 6.2, 6.6, 6.80, 7.0, 7.2, 7.5, 7.5, 7.75, 8.15,
          8.15, 8.65, 8.93, 9.2, 9.5, 10, 10.25, 11.5, 12, 16, 20.90, 22.3, 23.25)
  y2 <- c(0.75, 5.25, 5.5, 6, 6.2, 6.6, 6.80, 7.0, 7.2, 7.5, 7.5, 7.75, 8.15,
          8.15, 8.65, 8.93, 9.2, 9.5, 10, 10.25, 11.5, 12, 16, 20.90, 22.3, 23.25)
  y3 <- c(0.75, 5.25, 5.5, 6, 6.2, 6.6, 6.80, 7.0, 7.2, 7.5, 7.5, 7.75, 8.15,
          8.15, 8.65, 8.93, 9.2, 9.5, 10, 10.25, 11.5, 12, 16, 20.90, 22.3, 23.25)
  y4 <- c(0.75, 5.25, 5.5, 6, 6.2, 6.6, 6.80, 7.0, 7.2, 7.5, 7.5, 7.75, 8.15,
          8.15, 8.65, 8.93, 9.2, 9.5, 10, 10.25, 11.5, 12, 16, 20.90, 22.3, 23.25)

  p <- plot_ly(type = 'box') %>%
    add_boxplot(y = y1, jitter = 0.3, pointpos = -1.8, boxpoints = 'all',
                marker = list(color = 'rgb(7,40,89)'),
                line = list(color = 'rgb(7,40,89)'),
                name = "All Points") %>%
    add_boxplot(y = y2, name = "Only Whiskers", boxpoints = FALSE,
                marker = list(color = 'rgb(9,56,125)'),
                line = list(color = 'rgb(9,56,125)')) %>%
    add_boxplot(y = y3, name = "Suspected Outlier", boxpoints = 'suspectedoutliers',
                marker = list(color = 'rgb(8,81,156)',
                              outliercolor = 'rgba(219, 64, 82, 0.6)',
                              line = list(outliercolor = 'rgba(219, 64, 82, 1.0)',
                                          outlierwidth = 2)),
                line = list(color = 'rgb(8,81,156)')) %>%
    add_boxplot(y = y4, name = "Whiskers and Outliers", boxpoints = 'outliers',
                marker = list(color = 'rgb(107,174,214)'),
                line = list(color = 'rgb(107,174,214)')) %>%
    layout(title = name_layout)
}

response <- plotly_graphs("INSERT TITLE HERE")
json <- plotly_json(response, TRUE)
print(toJSON(json))
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
        mime: "text/x-rsrc"
      })
      this.editor.on('change', instance => {
        this.content = instance.getDoc().getValue()
        if (!this.timer) {
          this.timer = setTimeout(() => {
            this.execCode()
            this.timer = null
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
            language: "R",
            content: this.content
          }
        }, {
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
        axios.get('http://localhost:4000/api/figure/' + id , {
          headers: {'Authorization': `Bearer ${this.accessToken}`}
        }).then(response => {
          this.currentData = response.data.data
          this.layout = response.data.layout
          this.option = response.data.option

        }).catch(err => {
          console.log(err)
        })
      },
      async execCode () {
        try {
          const done = await axios.post('http://localhost:4000/api/figure/r', {
            content: this.content
          }, {
            headers: {
              'Authorization': `Bearer ${this.accessToken}`
            }
          })
          console.log(done)
          this.currentData = done.data.values.data
          this.layout.title = done.data.values.layout.title
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
        } catch (e) {
          this.$notify({
            title: 'Error during the script.',
            type: 'error',
            message: e.response.data.message.traceback,
            offset: 100,
            showClose: false
          })
        }
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
