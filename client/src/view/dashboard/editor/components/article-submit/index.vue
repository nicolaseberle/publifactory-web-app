<template></template>

<script>
import dataTableStatus from '../../DataTableStatus';

export default {
  name: 'article-submit',
  components: {
    dataTableStatus
  },
  props: {
    submited: Number
  },
  created() {
    console.log('child', JSON.stringify(this.submited));
  },
  methods: {}
};
</script>

<style scoped>
</style>