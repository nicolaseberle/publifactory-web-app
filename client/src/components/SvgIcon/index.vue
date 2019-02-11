<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName"/>
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    iconName() {
      console.log( this.iconClass )
      return `#icon-${this.iconClass}`
    },
    svgClass() {
      console.log( this.className )
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1.1em;
  height: 1.1em;
  vertical-align: -0.20em;
  fill: currentColor;
  overflow: hidden;
}
</style>
