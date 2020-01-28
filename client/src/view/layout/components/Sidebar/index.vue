<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <div class="logo-wrapper">
      <transition name="fade">
         <router-link v-if="!isCollapse" to="/" exact>PubliFactory <el-tag style='transform:translate(8px,-8px)' color='#EE8E4A' effect="dark" type='warning' size="mini">Alpha</el-tag></router-link>
      </transition>
         <router-link v-if="isCollapse" to="/" exact><div class='filter-logo' >P</div></router-link>
    </div>
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      :default-openeds="['/dashboard/home']"
    >
      <sidebar-item v-for="route in permissionrouters" :key="route.name" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import SidebarItem from './SidebarItem'
  import locales from '../../../../locales/menu'
  import axios from 'axios'

  export default {
  locales,
  components: { SidebarItem },
  data(){
    return {
      followedJournals : []
    }
  },
  computed: {
    ...mapGetters([
      'permissionrouters',
      'sidebar',
      'roles',
      'accessToken'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  mounted (){
    this.findFollowedJournals()
  },
  methods:{
    ...mapActions(['updateRoutes']),
    findFollowedJournals () {
      axios.get('/api/journals/followed/all', {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      }).then(list => {
        this.followedJournals = list.data.journals
        this.updateRoutes({'roles':this.roles,  'followedJournals': this.followedJournals})
      }).catch(err => {
        console.error(err)
      })
    }
  }
}
</script>
<style>
.filter-logo {
  position: absolute;
  left:8px;
  top: 0;
  padding-top: 10px;
  font-size: 2rem;
}
/*
.scrollbar-wrapper:after{
  content: "beta";
  position: fixed;
  width: 80px;
  height: 25px;
  background: #EE8E4A;
  top: 7px;
  left: -20px;
  text-align: center;
  font-size: 13px;
  font-family: sans-serif;
  text-transform: uppercase;
  font-weight: bold;
  color: #fff;
  line-height: 27px;
  -ms-transform:rotate(-45deg);
  -webkit-transform:rotate(-45deg);
  transform:rotate(-45deg);
  z-index:1000;
}*/
.logo-wrapper{
  /*margin-top:20px;*/
}
</style>
