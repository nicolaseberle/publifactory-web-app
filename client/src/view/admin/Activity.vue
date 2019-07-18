<template>
  <div class="app-container">
    <chart/>
  </div>
</template>
<script>
  import locales from 'locales/article'
  import chart from '../../components/Charts/echart/evolChart'
  export default {
  locales,
  data () {
    return {
    }
  },
  components: {
    chart
  },
  methods: {
  },
  mounted () {

  }
}
</script>
