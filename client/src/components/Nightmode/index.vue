<template>

    <div class="nightmode-svg">
      <a @click='click'><svg-icon icon-class='moon' /></a>
    </div>

</template>
<script>
export default {
  name: 'NightmodeComponent',
  data () {
    return {
      isNightmode: false
    }
  },
  methods: {
    click() {
        this.$message({
          message: 'Work in progress for nightmode',
          type: 'warning'
        })
    }
  }
}
</script>
