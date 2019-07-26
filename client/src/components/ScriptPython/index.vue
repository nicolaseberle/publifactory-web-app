<template>
  <div style='width:100%'>

    <el-row >
      <el-col :span="11">
        <div style='width:100%'>
          <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit" @tab-click="setCodeMirror">
            <el-tab-pane
              v-for="(item, index) in editableTabs"
              :key="item.name"
              :label="item.title"
              :name="item.name"
              id="tabs">
              <textarea :id="item.name" :name="item.name">{{item.content}}</textarea>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
      <el-col :span="12">
        <div class='plotly_js'>
          <vue-plotly :data="currentData" :layout="layout" :options="options" />
        </div>
        <div class="plotly_js">
          <div class="legend">
            <el-form ref="postForm" label-position="top" :model="postForm">
              <el-form-item label="Name of the figure">
                <el-input v-model="postForm.name" disabled></el-input>
              </el-form-item>
              <el-form-item label="Universal Unique IDentifier of the figure">
                <el-input v-model="postForm.uuid_figure" disabled></el-input>
              </el-form-item>
              <el-form-item label="Legend">
                <el-input type="textarea" :rows="3" v-model="postForm.legend" placeholder="Enter the legend of the graph"
                          v-on:change="handleFormUpdate"></el-input>
              </el-form-item>
              <el-form-item label="Source" placeholder="Enter the graph DOI">
                <el-input v-model="postForm.source" v-on:change="handleFormUpdate"></el-input>
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
  import PulseLoader from 'vue-spinner/src/PulseLoader'

  export default {
  name: 'ScriptPython',
  locales,
  props: ["idfigure", "socket"],
  components: { VuePlotly, PulseLoader },
  data () {
    return {
      formPythonFile: {
        name: ''
      },
      isCollapse: false,
      dialogVisible: false,
      loading: true,
      postForm: {
        legend: '',
        source: 'http://dx.doi.org/00.0000/e0000000',
        name: 'INSERT TITLE HERE',
        uuid_figure: this.idfigure
      },
      editableTabsValue: '1',
      editableTabs: [{
        title: 'main.py',
        name: '1',
        content: this.$t('template.pythonFirst')
      }],
      tabIndex: 1,
      tmpIndex: 1,
      editor: {},
      html: '',
      id: '',
      currentData: [{
        x: ['Sample A', 'Sample B', 'Sample C', 'Sample D'],
        y: [10, 16, 12, 13],
        type: 'bar',
        orientation: 'v'
      }],
      pythonVersion: '3.5',
      options: {},
      layout: {
        title: 'Distribution',
        showlegend: false
      },
      timer: null
    }
  },
  created () {
  },
  computed: {
    ...mapGetters(['accessToken'])
  },
  async mounted () {
    /**
     * Socket instructions from API
     */
    this.socket.on('LOAD_CODE_PYTHON', async data => await this.fetchFigure(data.id))

    await this.fetchFigure(this.idfigure)
    this.editor = CodeMirror.fromTextArea(document.getElementById(this.editableTabs[this.tabIndex - 1].name), {
      value: '',
      lineNumbers: true,
      styleActiveLine: true,
      matchBrackets: true,
      indentUnit: 4,
      smartIndentationFix: true,
      theme: 'one-dark',
      mode: "text/x-python",
      lineWrapping: true
    })
    this.editor.on('change', instance => {
      this.editableTabs[parseInt(this.editableTabsValue) - 1].content = instance.getDoc().getValue()
      if (!this.timer) {
        this.$emit('loading', true)
        this.timer = setTimeout(async () => {
          await this.execCode()
          this.timer = null
          this.$emit('loading', true)
        }, 3000)
      }
    });
    this.editor.refresh();
    this.execCode();
    var y0 = [];
    var y1 = [];
    var y2 = [];
    var y3 = [];
    for (var i = 0; i < 50; i++) {
      y0[i] = Math.random() + 1.2;
      y1[i] = Math.random() + 1;
      y2[i] = Math.random() * 2;
      y3[i] = Math.random() * 0.8 + 1;
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
    this.loading = false;
  },
  watch: {
    currentData (newVal) {
      this.saveFigure()
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
    destroy() {
      this.$destroy()
    },
    beforeDestroy() {
      this.$destroy()
    },
    handleTabsEdit (targetName, action) {
      if (action === 'add') {
        let newTabName = ++this.tabIndex + '';
        let promptAnswer = prompt('Which name to add to this file ?')
        const regexp = /^.*?\.py$/;
        if (!regexp.test(promptAnswer))
          promptAnswer = promptAnswer + '.py'
        this.editableTabs.push({
          title: promptAnswer,
          name: newTabName,
          content: this.$t('template.pythonSecond')
        });
        this.$nextTick(() => {
          this.codemirrorOptions(newTabName)
          this.editableTabsValue = newTabName;
        })
      } else if (action === 'remove') {
        const tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      }
    },
    async saveFigure () {
      console.log('saveFigure: ', this.idfigure)
      try {
        await axios.put('/api/figure/' + this.idfigure, {
          data: this.currentData,
          option: this.option,
          layout: this.layout,
          script: {
            language: "R",
            content: this.content
          },
          infos: this.postForm
        }, {
          headers: { 'Authorization': `Bearer ${this.accessToken}` }
        })
        this.$message({
          message: 'Your figure has been saved.',
          type: 'success',
          center: true,
          duration: 2000
        });
      } catch (e) {
        this.$message({
          message: 'An error occurred during the save of your figure.',
          type: 'error',
          center: true,
          duration: 2000
        });
      }
    },
    codemirrorOptions (elementId) {
      this.editor = CodeMirror.fromTextArea(document.getElementById(this.editableTabs[this.tabIndex - 1].name), {
        value: '',
        lineNumbers: true,
        styleActiveLine: true,
        matchBrackets: true,
        indentUnit: 4,
        smartIndentationFix: true,
        theme: 'one-dark',
        mode: "text/x-python",
        lineWrapping: true
      })
      this.editor.on('change', instance => {
        this.editableTabs[parseInt(elementId) - 1].content = instance.getDoc().getValue()
        if (!this.timer) {
          this.$emit('loading', true)
          this.timer = setTimeout(async () => {
            await this.execCode()
            this.timer = null
            this.$emit('loading', true)
          }, 3000)
        }
      })
      this.editor.refresh();
    },
    async fetchFigure (id) {
      const response = await axios.get('/api/figure/' + id, { headers: { 'Authorization': `Bearer ${this.accessToken}` } })
      if (response.data.script.content !== undefined && response.data.script.content.length !== 0) {
        this.currentData = response.data.data
        this.layout = response.data.layout
        this.option = response.data.option
        this.editableTabs = response.data.script.content
        this.editableTabsValue = '1'
        this.tabIndex = response.data.script.content.length
        for (let i = 0, len = this.tabIndex; i < len; ++i)
          this.codemirrorOptions(response.data.script.content[i].name)
        if (response.data.infos !== null)
          this.postForm = this.response.data.infos
      }
    },
    async execCode () {
      try {
        const done = await axios.post('/api/figure/python', {
          content: this.editableTabs,
          version: this.pythonVersion
        }, {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        })
        this.currentData = done.data.values.data
        this.layout.title = done.data.values.layout.title.text.toString()
        this.postForm.name = this.layout.title
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
        this.socket.emit('EXEC_CODE_PYTHON', {
          id: this.id
        });
      } catch (e) {
        this.$notify({
          title: 'Error during the script',
          type: 'error',
          message: e.response.data.message.traceback || this.$t('message.scriptFailure'),
          offset: 100,
          showClose: false
        })
      }
    },
    setVersion (version) {
      this.pythonVersion = version
    },
    setCodeMirror (tabClicked) {
      this.editableTabsValue = tabClicked.name;
    },
    handleFormUpdate () {
      if (!this.timer) {
        this.$emit('loading', true)
        this.timer = setTimeout(async () => {
          await this.saveFigure()
          this.timer = null
          this.$emit('loading', true)
        }, 500)
      }
    }
  }
}

</script>
<style lang="scss">

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }

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
