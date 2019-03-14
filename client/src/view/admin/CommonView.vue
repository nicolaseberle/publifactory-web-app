<template>
  <div class="app-wrapper">
    <sidebar class="sidebar-container"/>
    <transition name="router" mode="out-in">
      <!--<router-view></router-view>-->
    </transition>
  </div>
</template>

<script>
import { Sidebar } from './layout/components'
import ResizeMixin from './layout/mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  computed: {
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>
<style lang="stylus" scoped>
.router-enter-active
.router-leave-active
  transition all .4s cubic-bezier(0, 0, 0, 1)
.router-enter
.router-leave-active
  opacity .1
.router-enter
  transform translate3D(100%, 0, 0)
.router-leave-active
  transform translate3D(-100%, 0, 0)
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "../styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>
