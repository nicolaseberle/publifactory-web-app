<template>
  <div>
    toto est vivant, et il a un nom : {{ name}}
  </div>
</template>
<script>
import locales from 'locales/article'

export default{
  data () {
    return {
      name: 'Vincent'
    }
  }
}
</script>
