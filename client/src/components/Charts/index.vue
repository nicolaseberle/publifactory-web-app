<template>
  <div>
    <el-row :gutter='12'>
      <el-col :span="3">
        <el-menu
        default-active="1-1"
        background-color="rgb(240, 240, 240)"
        class="el-menu-vertical-demo"
        default-openeds='["1","2","3"]'>
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
              <el-menu-item index="2-1">Traces</el-menu-item>
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
      <el-col :span="4">
        <transition name="slide-fade">
          <generalMenu  v-if='visibleGeneralMenu'/>
          <tracesMenu v-if='visibleTracesMenu' />
        </transition>


      </el-col>
      <el-col :span="15">
        <vue-plotly :data="data" :layout="layout" :options="options"/>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import locales from 'locales/charts'
import VuePlotly from '@statnett/vue-plotly'
import tracesMenu from '../../components/Charts/Menu/TracesMenu'
import generalMenu from '../../components/Charts/Menu/GeneralMenu'

export default {
  name: 'chartFactory',
  locales,
  components: {VuePlotly,tracesMenu,generalMenu},
  data () {
    return {
      options: {},
      layout: {
        title: 'Surname occurence',
        showlegend: false
      },
      data: [{
            x:['Marc', 'Henrietta', 'Jean', 'Claude', 'Jeffrey', 'Jonathan', 'Jennifer', 'Zacharias'],
            y: [90, 40, 60, 80, 75, 92, 87, 73],
            type: 'bar',
            orientation: 'v'
      }],
      visibleGeneralMenu : false,
      visibleTracesMenu : false
    }
  },
  methods: {
    handleClick (activeItem){
      if(activeItem=='general'){
        this.visibleTracesMenu = false
        this.visibleGeneralMenu = true
      }
      else if (activeItem=='traces') {
        this.visibleTracesMenu = true
        this.visibleGeneralMenu = false
      }
    },
    onSubmit (){}
  }
}
</script>
<style>
.slide-fade-enter-active {
  transition: all 2s ease;
}
.slide-fade-leave-active {
  transition: all .3s ease;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
