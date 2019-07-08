<template></template>
<script>
  import Vue from 'vue'
  import nprogress from 'nprogress'
  import { mapGetters } from 'vuex'
  import 'nprogress/nprogress.css'
  import { Loading } from 'element-ui';

  export default {
  props: {
    parent: String
  },
  data: {
    loadingInstance: Object
  },
  computed: {
    ...mapGetters(['loggedIn'])
  },
  created () {
    console.log("nprogress :: ", this.parent)
    if(this.loggedIn === true)
    if (this.parent) {
      //nprogress.configure({ parent: this.parent })
    }

    console.log("nprogress :: ",nprogress)
    this.$router.beforeEach((to, from, next) => {
      this.loadingInstance = Loading.service({ target: '#app-main' });
      //nprogress.start()
      next()
    })
    this.$router.afterEach(() => {
      //nprogress.done()
      if(this.loadingInstance!=undefined)
        this.loadingInstance.close();
    })/*
    Vue.http.interceptors.push((request, next) => {
      nprogress.start()
      next(response => {
        nprogress.done()
        return response
      })
    })*/
  }
}
</script>
<style>

</style>
