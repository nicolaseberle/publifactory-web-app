<template>
<transition name="content-loading">
    <div class="content-loading flex flex-main-center flex-cross-center" v-show="show">
      <div class="loader-inner">
        <div></div>
        <div></div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true
    }
  }
}
</script>
