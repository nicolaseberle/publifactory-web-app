<template>
  <div class="dashboard-container">
    <component :is='currentComponent'/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import userlist from './UserList'

export default {
  data() {
    return {
      flagAdmin: false
    }
  },
  created () {
    if (this.roles.includes('admin')) {
      this.flagAdmin = true
      currentComponent = userlist
    } else {
      this.flagAdmin = false
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  }
}
</script>
