<template>
  <div>
    <el-row :gutter='10'>
      <el-col :span="3">
        <el-menu
        default-active="1-2"
        background-color="rgb(240, 240, 240)"
        class="col-main-menu-chart"
        :default-openeds="['1','2']"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>Charts</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="1-1" @click="handleClick('general')">General</el-menu-item>
              <el-menu-item index="1-2" @click="handleClick('traces')">Traces</el-menu-item>
              <el-menu-item index="1-3">Filter</el-menu-item>
              <el-menu-item index="1-4">Group</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>Styles</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="2-1" @click="handleClick('styleTraces')">Traces</el-menu-item>
              <el-menu-item index="2-2">Layout</el-menu-item>
              <el-menu-item index="2-3">Notes</el-menu-item>
              <el-menu-item index="2-4">Axes</el-menu-item>
              <el-menu-item index="2-5">Legend</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-sort"></i>
              <span>Export</span>
            </template>
          </el-submenu>
        </el-menu>

      </el-col>
      <el-col :span="6">
        <transition name="slide-fade">
          <generalMenu v-model="parentTitleChart"  v-if='visibleGeneralMenu'/>
          <tracesMenu v-model="parentFigureType" v-if='visibleTracesMenu' />
          <styletracesMenu v-if='visibleStyleTracesMenu' />
        </transition>
      </el-col>
      <el-col :span="15">
        <el-row>
          <vue-plotly :data="currentData" :layout="layout" :options="options"/>
        </el-row>
        <el-row>
          <el-tabs v-model="editableTabsValue" type="card" editable @edit="handleTabsEdit">
            <el-tab-pane
              v-for="(item, index) in editableTabs"
              :key="item.name"
              :label="item.title"
              :name="item.name"
            >
              <span v-html="item.content"></span>
            </el-tab-pane>
          </el-tabs>
          <hot-table ref="hotTableComponent" :settings="settings3"></hot-table>
          <!--<div id="tabFactory" style='margin-left: 20px, height:150px,width:1000px,display: flex '></div>-->
          <!--<hot-table :settings="settings"></hot-table>-->
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import Vue from 'vue';
import locales from 'locales/charts'
import VuePlotly from '@statnett/vue-plotly'
import tracesMenu from '../../components/Charts/Menu/TracesMenu'
import generalMenu from '../../components/Charts/Menu/GeneralMenu'
import styletracesMenu from '../../components/Charts/Menu/StyleTracesMenu'
import { HotTable } from '@handsontable/vue';
import { mapGetters } from 'vuex'

import axios from 'axios'
const debug = require('debug')('frontend');
//var Handsontable = require('handsontable');

export default {
  name: 'chartFactory',
  locales,
  components: {VuePlotly,tracesMenu,generalMenu,styletracesMenu,HotTable},
  props: ['idfigure'],
  data () {
    return {
      editableTabsValue: '1',
        editableTabs: [{
          title: 'Sample 1',
          name: '1',
          content: "<p class='data-doi'>DOI : 10.1037/rmh0000108</p>"
        },
        {
          title: 'Sample 2',
          name: '2',
          content: "<p class='data-doi'>DOI : 10.1037/rmh0000109</p>"
        }],
      tabIndex: 1,
      parentTitleChart: 'Title',
      parentFigureType: 'bar',
      options: {},
      layout: {
        title: 'Title',
        showlegend: false
      },
      settings3: {
          data: [
            ["Ford", "Volvo", "Toyota", "Honda"],
            [10, 11, 12, 13]
          ],
          colHeaders: true,
          rowHeaders: true,
          contextMenu: true,
          minCols: 20,
          afterChange: () => {
            debug("afterChange")
            if (this.hotRef) {
              var __data = this.hotRef.getSourceData()
              debug(__data)
              debug(__data[0])
              debug(__data[1].map(Number))

              this.currentData[0].x = __data[0]
              if (this.parentFigureType == 'bar'){
                this.currentData[0].y = __data[1].map(Number)
              }
              if (this.parentFigureType == 'box'){

                //this.currentData[0].y = __data[1].map(Number)
                var y0 = [];
                var y1 = [];
                var y2 = [];
                for (var i = 0; i < 50; i ++) {
                	y0[i] = Math.random();
                  y1[i] = Math.random() + 1;
                  y2[i] = Math.random()*3 ;
                }
                this.currentData[0].x = '';
                this.currentData[0].y = y0;
                this.currentData[1].x = '';
                this.currentData[1].y = y1;
                this.currentData[2].x = '';
                this.currentData[2].y = y2;
                this.settings3.data = new Array(this.currentData[0].x,this.currentData[0].y)
              }
              this.saveFigure()
            }
          }
        },
      currentData: [{
            x: ['Sample A','Sample B','Sample C','Sample D'],
            y: [ 10, 9, 12, 13],
            type: 'bar',
            orientation: 'v'
      }],
      visibleGeneralMenu: false,
      visibleTracesMenu: true,
      visibleStyleTracesMenu: false,
      settings: {
          data: [['Sample A','Sample B','Sample C','Sample D'],
                 [ 1, 2, 3, 4]]
      },
      id: '',
      keyCurrentTableData: [],
      tableData: [],
      tableFiles: [],
      tableHeader: [],
      hotRef: null
    }
  },
  computed: {
    ...mapGetters(['accessToken'])
  },
  created() {
    this.id = this.$route.params && this.$route.params.id
    this.loadData()
  },
  mounted() {
        this.hotRef = this.$refs.hotTableComponent.hotInstance;
        debug("mounted:: ",this.idfigure)


    // var container = document.getElementById('tabFactory');
    /*
    this.settings3 = {
      data: this.settings.data,
      rowHeaders: true,
      colHeaders: this.settings.data[0],
      outsideClickDeselects: false,
      minCols: 20,
      contextMenu: true
    };*/
    /*,
      contextMenu: {
            callback: function (key, selection, clickEvent) {
              // Common callback for all options
              debug(key, selection, clickEvent);
            },
            items: {
              "newtrace": { // Own custom option
                name: 'Create new trace from selection', // Name can contain HTML
                callback: function(key, selection, clickEvent) { // Callback for specific option
                  setTimeout(function() {
                    alert('Hello world!'); // Fire alert after menu close (with timeout)
                  }, 0);
                }
              },
              "headers": { // Own custom option
                name: 'Headers',
                submenu: {
                  // Custom option with submenu of items
                  items: [
                    {
                      // Key must be in the form "parent_key:child_key"
                      key: 'headers:newcolheader',
                      name: 'Use row as Headers',
                      hidden: function () {
                        let arr_Cell = this.getSelected()
                          if((arr_Cell[0][1]==0 && arr_Cell[0][2]-arr_Cell[0][0])==0 && (arr_Cell[0][3]-arr_Cell[0][1]+1)==this.countCols() )
                          {
                            return false
                          }
                        return true
                      },
                      callback: function(key, selection, clickEvent) {
                        let vm = this
                        setTimeout(function() {
                          let arr_Cell = vm.getSelected()
                          debug(arr_Cell[0])
                          vm.colHeaders = vm.getDataAtRow(arr_Cell[0][0])
                          debug(vm.getDataAtRow(arr_Cell[0][0]))
                        }, 0);

                          // alert('You select this row to be header!');

                      }
                    },
                    { key: 'headers:newrowheader',
                      name: 'User col as Headers',
                      hidden: function () {
                        let arr_Cell = this.getSelected()
                          if((arr_Cell[0][0]==0 && arr_Cell[0][3]-arr_Cell[0][1])==0 && (arr_Cell[0][2]-arr_Cell[0][0]+1)==this.countRows() )
                          {
                            return false
                          }
                        return true
                      },
                      callback: function(key, selection, clickEvent) {
                        setTimeout(function() {
                          alert('You select this col to be header!');
                        }, 0);
                      }
                    },
                    { key: 'headers:rename',
                      name: 'Rename header',
                      hidden: function () {
                        let arr_Cell = this.getSelected()
                          if((arr_Cell[0][1]==0 && arr_Cell[0][2]-arr_Cell[0][0])==0 && (arr_Cell[0][3]-arr_Cell[0][1]+1)==this.countCols() )
                          {
                            return false
                          }
                        return true
                      },
                      callback: function(key, selection, clickEvent) {
                        setTimeout(function() {
                          alert('Rename Header!');
                        }, 0);
                     }
                   }
                  ]
                }
              },
              "row_above": {
                disabled: function () { // `disabled` can be a boolean or a function
                  // Disable option when first row was clicked
                  return this.getSelectedLast()[0] === 0; // `this` === hot3
                }
              },
              "row_below": {
                name: 'Click to add row below' // Set custom text for predefined option
              }
            }
          }*/
      //};
    // this.hot = new Handsontable(container, settings3);


/*
    hot.addHook('afterInit', function(changes, src) {
        this.loadData(new Array([this.tableHeader[0],this.tableData]))
        debug('afterInit')

        debug(this.tableHeader[0])
        /*this.colHeaders = this.tableHeader
        vm.currentData[0].x = this.tableHeader[0]
        vm.currentData[0].y = [10, 6 , 4 ,5]*/

  //    });
    /*this.hot.addHook('afterChange', function(changes, src) {
        /*vm.currentData[0].x = this.getDataAtRow(0)
        vm.currentData[0].y = this.getDataAtRow(1)*/
      //});


  },
  watch:{
    parentTitleChart (newVal) {
      this.layout = {'title': this.parentTitleChart}
      this.saveFigure ()
    },
    parentFigureType (newVal) {
      // WARNING [0] for Trace 1 [1] for Trace 2...
      debug("parentFigureType change : ", this.parentFigureType)
      this.currentData[0] = {'type': this.parentFigureType}
      if (this.parentFigureType == 'box'){
        this.currentData = [{
          'y': this.currentData.y,
          'type': 'box',
          'name': 'Sample A'
        },
        {
          'y': this.currentData.y,
          'type': 'box',
          'name': 'Sample B'
        },
        {
          'y': this.currentData.y,
          'type': 'box',
          'name': 'Sample C'
        }]
      }else {
        this.currentData = [{
              x: ['Sample A','Sample B','Sample C','Sample D'],
              y: [ 10, 9, 12, 13],
              type: 'bar',
              orientation: 'v'
        }]
      }
      this.saveFigure ()
    },
    settings3 (newVal) {
      debug(this.settings3)
    }
  },
  methods: {
    saveFigure () {
      debug("saveFigure ", this.currentData.y)
      axios.put('http://localhost:4000/api/figure/'  + this.idfigure, {
        data: this.currentData,
        option:this.option,
        layout: this.layout,
        script: {
          language: "Light",
          content: null
        }
      }, {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      })
      .then(response => {
        debug("figure saved")
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
    loadData() {
      axios.get(`/api/data/${this.id}`, {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      })
      .then(response => {
        if(response.data.length!=0)
        {
          let vm = this
          this.keyCurrentTableData = 0
          this.tableData = new Array(JSON.parse(response.data[0].content))
          this.tableHeader = new Array(JSON.parse(response.data[0].header))
          this.currentData[0].x = this.tableHeader[0]
          debug("loadData")
          debug(this.currentData[0].x)
          this.currentData[0].y = [10, 6 , 4]
          debug(this.currentData[0].y)
          this.settings.data = new Array(this.currentData[0].x,this.currentData[0].y)
          this.settings3.data = new Array(this.currentData[0].x,this.currentData[0].y)

          response.data.forEach(function(el){
            vm.tableFiles.push( {file: JSON.parse(el.name)})
          })
          return this.tableData
        }
      })
      .catch(e => {
        console.log(e)
      })

    },
    handleClick (activeItem){
      if(activeItem=='general'){
        this.visibleTracesMenu = false
        this.visibleGeneralMenu = true
        this.visibleStyleTracesMenu = false
      }
      else if (activeItem=='traces') {
        this.visibleTracesMenu = true
        this.visibleGeneralMenu = false
        this.visibleStyleTracesMenu = false
      }else if (activeItem=='styleTraces') {
          this.visibleTracesMenu = false
          this.visibleGeneralMenu = false
          this.visibleStyleTracesMenu = true
      }
    },
    save () {
        JSON.stringify({data: this.getData()})
    },
    onSubmit (){},
    handleTabsEdit(targetName, action) {
        if (action === 'add') {
          let newTabName = ++this.tabIndex + '';
          this.editableTabs.push({
            title: 'New Tab',
            name: newTabName,
            content: 'New Tab content'
          });
          this.editableTabsValue = newTabName;
        }
        if (action === 'remove') {
          let tabs = this.editableTabs;
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
      }
  }
}
</script>
<style>
@import "../../../../node_modules/handsontable/dist/handsontable.full.css";

.col-main-menu-chart{
  height:100%;
  background-color: rgb(240, 240, 240);
}

.slide-fade-enter-active {
  transition: all 2s ease;
}
.slide-fade-leave-active {
  transition: all .3s ease;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(-20px);
  opacity: 0;
}

.data-doi{

}
.htMenu{
z-index: 214748364 !important;
}
</style>
