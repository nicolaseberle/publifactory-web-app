<template>
  <div class="app-wrapper">
    <transition name="router" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
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
  @import "src/styles/mixin.scss";
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
