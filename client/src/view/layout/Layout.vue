<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
    <sidebar class="sidebar-container"/>
    <div class="main-container">
      <navbar v-model="flag_user"/>

      <app-main :flagUser="flag_user"/>
    </div>
  </div>
</template>

<script>
  import { AppMain, Navbar, Sidebar } from './components'
  import ResizeMixin from './mixin/ResizeHandler'

  export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  data () {return {
    flag_user : false
  }},
  watch: {
    flag_user() {
      console.log("Layout.vue - ça bouge en dessous")
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
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
