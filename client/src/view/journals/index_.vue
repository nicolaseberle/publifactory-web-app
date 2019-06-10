<template>
  <div>
    {{test}} {{journalId}}
  </div>
</template>
<script>
export default {
  data () {
    return {
      test : 'on est sur la page du journal',
      journalId: ''
    }
  },
  created (){
    this.journalId = this.$route.params && this.$route.params.id
  }
}
</script>
