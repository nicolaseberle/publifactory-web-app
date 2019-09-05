<template>
  <div style='width:100%'>
    <el-row>
      <el-col :span="11">
        <div style='width:100%'>
          <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit" @tab-click="setCodeMirror">
            <el-tab-pane
              v-for="(item, index) in editableTabs"
              :key="item.name"
              :label="item.title"
              :name="item.name"
              id="tabs">
              <label>
                <textarea :id="item.name" :name="item.name">{{item.content}}</textarea>
              </label>
            </el-tab-pane>
          </el-tabs>
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
  import {mapGetters} from 'vuex'
  import axios from 'axios'

  const debug = require('debug')('frontend');

  export default {
    name: 'ScriptR',
    locales,
    props: ["idfigure", "socket"],
    components: { VuePlotly },
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
          x: ['Sample A', 'Sample B', 'Sample C', 'Sample D'],
          y: [10, 16, 12, 13],
          type: 'bar',
          orientation: 'v'
        }],
        options: {},
        layout: {
          title: 'Distribution',
          showlegend: false
        },
        timer: null,
        editableTabsValue: '1',
        editableTabs: [{
          title: 'main.R',
          name: '1',
          content: this.$t('template.RFirst')
        }],
        tabIndex: 1,
      }
    },
    created () {
      this.id = this.$route.params && this.$route.params.id
    },
    computed: {
      ...mapGetters(['accessToken'])
    },
    async mounted () {
      /**
       * Socket instructions from API
       */
      this.socket.on('LOAD_CODE_R', async data => {
        await this.fetchData();
        await this.fetchFigure(data.id);
        await this.execCode()
      });

      await this.fetchData();
      await this.fetchFigure(this.idfigure);

      /*
      let y0 = []
      let y1 = []
      let y2 = []
      let y3 = []
      let i;
      for (i = 0; i < 50; i++) {
        y0[i] = Math.random() + 1.2;
        y1[i] = Math.random() + 1;
        y2[i] = Math.random() * 2;
        y3[i] = Math.random() * 0.8 + 1;
      }
      y0 = []
      y1 = []
      y2 = []
      y3 = []
      for (i = 0; i < 50; i++) {
        y0[i] = Math.random() + 1.2;
        y1[i] = Math.random() + 1;
        y2[i] = Math.random() * 2;
        y3[i] = Math.random() * 0.8 + 1;
      }

      const trace0 = {
        y: y0,
        type: 'box',
        name: 'sample A',
        marker: {
          color: 'rgb(9,56,125)'
        }
      }

      const trace1 = {
        y: y1,
        type: 'box',
        name: 'sample B',
        marker: {
          color: 'rgb(9,56,125)'
        }
      }

      const trace2 = {
        y: y2,
        type: 'box',
        name: 'sample C',
        marker: {
          color: 'rgb(9,56,125)'
        }
      }

      const trace3 = {
        y: y3,
        type: 'box',
        name: 'sample D',
        marker: {
          color: 'rgb(9,56,125)'
        }
      }
      this.currentData = [trace0, trace1, trace2, trace3]*/
    },
    watch: {
      currentData () {
        this.saveFigure()
      }
    },
    methods: {
      handleTabsEdit (targetName, action) {
        if (action === 'add') {
          let newTabName = ++this.tabIndex + '';
          let promptAnswer = prompt('Which name to add to this file ?')
          const regexp = /^.*?\.R$/;
          if (!regexp.test(promptAnswer))
            promptAnswer = promptAnswer + '.R'
          this.editableTabs.push({
            title: promptAnswer,
            name: newTabName,
            content: this.$t('template.RSecond')
          });
          this.$nextTick(() => {
            this.codemirrorOptions(newTabName)
            this.editableTabsValue = newTabName;
          })
        }
        if (action === 'remove') {
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
        try {
          await axios.put('/api/figure/' + this.idfigure, {
            data: this.currentData,
            option: this.options,
            layout: this.layout,
            script: {
              language: "R",
              content: this.editableTabs
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
          this.socket.emit('EXEC_CODE_R', {
            id: this.idfigure
          })
        } catch (e) {
          this.$message({
            message: 'An error occurred during the save of your figure.',
            type: 'error',
            center: true,
            duration: 2000
          });
        }
      },
      async fetchFigure (id) {
        const response = await axios.get('/api/figure/' + id, { headers: { 'Authorization': `Bearer ${this.accessToken}` } })
        if (response.data.script.content !== undefined && response.data.script.content.length !== 0) {
          this.currentData = response.data.data
          this.layout = response.data.layout
          this.options = response.data.option
          this.editableTabs = response.data.script.content
          this.editableTabsValue = '1'
          this.tabIndex = response.data.script.content !== undefined ? response.data.script.content.length : 1
          for (let i = 0, len = this.tabIndex; i < len; ++i)
              this.codemirrorOptions(response.data.script.content[i].name)
          if (response.data.infos !== null)
            this.postForm = this.response.data.infos
        } else {
          this.codemirrorOptions (1)
        }
      },
      async fetchData () {
        const datas = await axios.get('/api/data/' + this.id,
                { headers: { 'Authorization': `Bearer ${this.accessToken}` } });
        if (datas.data.length !== 0) {
          for (let object of datas.data) {
            let stringResult = '';
            for (let i = 0, len = object.header.length; i < len; ++i) {
              if (i === len - 1) stringResult = stringResult + object.header[i] + '\n';
              else stringResult = stringResult + object.header[i] + ', ';
            }
            for (let j = 0, len2 = object.content.length; j < len2; ++j) {
              for (let i = 0, len = object.header.length; i < len; ++i) {
                if (i === len - 1) stringResult = stringResult + object.content[j][object.header[i]] + '\n';
                else stringResult = stringResult + object.content[j][object.header[i]] + ', ';
              }
            }
            let newTabName = ++this.tabIndex + '';
            this.editableTabs.push({
              title: object.name,
              name: newTabName,
              content: stringResult
            });
          }
        }
      },
      async codemirrorOptions (elementId) {
        if (this.editor[elementId] instanceof CodeMirror) {
          this.editor[elementId].refresh();
          this.editor[elementId].focus();
          this.editor[elementId].setCursor(0, 0);
        }
        else {
          this.editor[elementId] = await CodeMirror.fromTextArea(document.getElementById(this.editableTabs[parseInt(elementId) - 1].name), {
            value: '',
            lineNumbers: true,
            styleActiveLine: true,
            matchBrackets: true,
            indentUnit: 4,
            smartIndentationFix: true,
            theme: "mdn-like",
            mime: "text/x-rsrc",
            lineWrapping: false
          })
          this.editor[elementId].on('change', instance => {
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
          this.execCode();
          this.editor[elementId].focus();
          this.editor[elementId].setCursor(0, 0);
        }
      },
      async execCode () {
        try {
          const done = await axios.post('/api/figure/r', {
            content: this.editableTabs
          }, {
            headers: {
              'Authorization': `Bearer ${this.accessToken}`
            }
          })
          this.currentData = done.data.values.data
          this.layout.title = done.data.values.layout.title
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
        } catch (e) {
          this.$notify({
            title: 'Error during the script.',
            type: 'error',
            message: e.response.data.message.traceback,
            offset: 100,
            showClose: false
          })
        }
      },
      setCodeMirror (tabClicked) {
        this.codemirrorOptions(tabClicked.name)
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
