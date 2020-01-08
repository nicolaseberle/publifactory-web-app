<template>
<div class="app-container">
  <div class="components-container-dashboard">
    <content-module name="listinvitation">
      <data-table ref="listinvitation" :page="page" @page-change="nextPage">
        <el-table :data="listinvitation" @row-click="setSelectedRow" fit highlight-current-row style="width: 100%">
          <el-table-column class-name="date-col" width="180px" label="Date">
            <template slot-scope="scope">
              <span>{{ scope.row.creationDate | moment("DD/MM/YYYY, h:mm:ss a") }}</span>
            </template>
          </el-table-column>
          <el-table-column property="title" label="Title"  min-width="200"></el-table-column>
          <el-table-column property="fields" label="Fields" width="140px"></el-table-column>
          <el-table-column :label="$t('operation.operation')" align="center" width="140px">
            <template slot-scope="scope">
                <el-dropdown trigger="click" class="international" @command="actionHandleCommand">
                  <div>
                    <el-button class="el-button-action" icon="el-icon-more" circle>
                    </el-button>
                  </div>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item  command="open">open</el-dropdown-item>
                    <el-dropdown-item  command="remove"><div style="color:'red'">Remove user</div></el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </data-table>
    </content-module>
  </div>
</div>
</template>
<script>
import { mapGetters } from 'vuex'
import DataTable from '../../components/DataTable'
import locales from '../../locales/users'
import axios from 'axios'

export default {
  locales,
  name: 'requestList',
  components: {DataTable},
  data () {
    return {
      listinvitation: [],
      selectedRow: '',
      selectedUserId: '',
      page:{current: 1,total:0}
    }
  },
  created () {

  },
  mounted () {
    this.getTotalRequest()
    this.getInvitations(1)
  },
  methods:{
    nextPage(val){
      this.page.current = val
      this.getInvitations(this.page.current)
    },
    actionHandleCommand (action) {
      if(action=='nothing'){
      }else if(action=='remove'){
      }
    },
    setSelectedRow (row, event, column) {
        this.selectedRow = row
        this.selectedUserId = row._id
    },
    getTotalRequest () {
      axios.get('/api/activity/totalRequest')
      .then( async (res) => {
        this.page.total = res.data.data;
      }).catch((e)=>{console.log(e)})
    },
    getInvitations(page = 1){
      axios.get('/api/activity?page='+page+'&count=10')
      .then( async (res) => {
        this.listinvitation = res.data.data;

      })
    }

  }
}
</script>
