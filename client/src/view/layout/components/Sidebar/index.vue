<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <div class="logo-wrapper">
      <transition name="fade">
         <router-link v-if="!isCollapse" to="/" exact>PubliFactory</router-link>
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
    >
      <sidebar-item v-for="route in permissionrouters" :key="route.name" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  data(){
    return {
      followedJournals : [{'id': '5d0264a4d0738816c96658ca', 'title':'Genetics'},
      {'id':'5d0264a4d0738816c96658c9','title':'Dev Biology'}]
    }
  },
  computed: {
    ...mapGetters([
      'permissionrouters',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  mounted (){
    //this.updateJournalRouter()
    this.updateRoutes(this.permissionrouters)
  },
  methods:{
    ...mapActions(['updateRoutes'])/*,
    updateJournalRouter() {
      this.permissionrouters.forEach((parentRoute)=>{
        if(parentRoute.path==='/feeds'){

          parentRoute.children = [
            {
              'path': 'feeds',
              'hidden': 'true',
              'component': "() => import('../view/journals/index.vue')"
            }]
            for (let i = 0; i < this.followedJournals.length; i++){
              let componentRoute = '../view/journals/' + this.followedJournals[i].id
              let _route = {
                'path': '/journals/' + this.followedJournals[i].id,
                'name':  this.followedJournals[i].title,
                'meta': { 'title': this.followedJournals[i].title, 'icon': 'book', 'noCache': 'true' },
              }
              parentRoute.children.push(_route)
            }
            //we add a route to add other journals

            const journal = () => import('../../../../view/journals/index.vue')
            parentRoute.children.push(
            {
              'path': '/journal',
              'name': 'Add Journals',
              'meta': { 'title': 'Add Journals', 'icon': 'plus', 'noCache': 'true' },
              "component": journal
            })

        }

      })
    }*/
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
</style>
