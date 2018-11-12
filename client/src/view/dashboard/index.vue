<template>
  <div class="dashboard-container">
    <component :is="currentRole"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'
import userDashboard from './user'

export default {
  name: 'Dashboard',
  components: { adminDashboard, userDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (this.roles.includes('editor')) {
      this.currentRole = 'editorDashboard'
    }
    if (this.roles.includes('user')) {
      this.currentRole = 'userDashboard'
    }
  }
}
</script>
