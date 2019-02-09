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
          <generalMenu v-model="user"  v-if='visibleGeneralMenu'/>
          <tracesMenu v-if='visibleTracesMenu' />
          <styletracesMenu v-if='visibleStyleTracesMenu' />
        </transition>


      </el-col>
      <el-col :span="15">
        <el-row>
          <!--{{user}}-->
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

          <div id="tabFactory" style='margin-left: 20px, height:150px,width:1000px,display: flex '>
            <!--<hot-table :settings="settings"></hot-table>-->
          </div>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import locales from 'locales/charts'
import VuePlotly from '@statnett/vue-plotly'
import tracesMenu from '../../components/Charts/Menu/TracesMenu'
import generalMenu from '../../components/Charts/Menu/GeneralMenu'
import styletracesMenu from '../../components/Charts/Menu/StyleTracesMenu'
import axios from 'axios'

var Handsontable = require('handsontable');

export default {
  name: 'chartFactory',
  locales,
  components: {VuePlotly,tracesMenu,generalMenu,styletracesMenu},
  data () {
    return {
      editableTabsValue: '1',
        editableTabs: [{
          title: 'Tab 1',
          name: '1',
          content: "<p class='data-doi'>DOI : 10.1037/rmh0000108</p>"
        }],
      tabIndex: 1,
      user: 'Ary',
      options: {},
      layout: {
        title: 'Surname occurence',
        showlegend: false
      },
      currentData: [{
            x:['Marc', 'Henrietta', 'Jean', 'Claude', 'Jeffrey', 'Jonathan', 'Jennifer', 'Zacharias'],
            y: [90, 40, 60, 80, 75, 92, 87, 73],
            type: 'bar',
            orientation: 'v'
      }],
      visibleGeneralMenu: false,
      visibleTracesMenu: true,
      visibleStyleTracesMenu: false,
      settings: {
          data: [['Sample A','Sample B','Sample C','Sample D'],
                 [ 10, 9, 12, 13]
                ],
          colHeaders: true,
          // colWidths: [45, 80, 100, 60, 80, 80, 80 ,80],

          minCols: 18
        },
        id: '',
        keyCurrentTableData: [],
        tableData: [],
        tableFiles: [],
        tableHeader: []
    }
  },
  created() {
    this.id = this.$route.params && this.$route.params.id
    this.loadData()
  },
  mounted () {
    var data = function () {
      return Handsontable.helper.createSpreadsheetData(10, 10);
    };
    var container = document.getElementById('tabFactory');
    var settings3 = {
      data: this.settings.data,
      rowHeaders: true,
      colHeaders: this.settings.data[0],
      outsideClickDeselects: false,
      minCols: 20,
      contextMenu: {
            callback: function (key, selection, clickEvent) {
              // Common callback for all options
              console.log(key, selection, clickEvent);
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
                          console.log(arr_Cell[0])
                          vm.colHeaders = vm.getDataAtRow(arr_Cell[0][0])
                          console.log(vm.getDataAtRow(arr_Cell[0][0]))
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
          }
        };
    var hot = new Handsontable(container, settings3);
    let vm = this

    hot.addHook('afterChange', function(changes, src) {

        vm.currentData[0].y = this.getDataAtRow(0)
        console.log(changes, src)
        console.log(vm.currentData[0].y)
      });


  },
  methods: {
    loadData() {
      console.log(this.currentData)
      axios.get(`/api/data/${this.id}`)
      .then(response => {
        if(response.data.length!=0)
        {
          let vm = this
          this.keyCurrentTableData = 0
          this.tableData = new Array(JSON.parse(response.data[0].content))
          this.tableHeader = new Array(JSON.parse(response.data[0].header))
          this.currentData[0].x = this.tableHeader[0]
          this.currentData[0].y = [10, 6 , 4 ,5]
          // console.log(this.tableData[0].Date)
          response.data.forEach(function(el){
            vm.tableFiles.push( {file: JSON.parse(el.name)})
          })

          /*
          this.currentData[0].x.forEach(function(el)
          {console.log(el.Date )}
          )
          */
          //console.log(this.tableData)

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
    onSubmit (){}
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
