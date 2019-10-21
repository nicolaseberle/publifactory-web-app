<template>
  <section class="app-main" id="app-main">
    <transition name="fade-transform" mode="out-in">
        <router-view :flagUser="flagUser" :key="key"/>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  props: {
    flagUser : false
  },
  watch: {
    flagUser (change) {
      console.log("changement de role")
    }
  },
  computed: {
    key() {
      return this.$route.fullPath
    }
  }
}
</script>
