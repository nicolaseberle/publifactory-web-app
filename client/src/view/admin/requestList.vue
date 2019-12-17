<template>
<div class="app-container">
  <div class="components-container-dashboard">
    <content-module name="data">
      <data-table ref="data">
        <el-table :data="data" @row-click="setSelectedRow" fit highlight-current-row style="width: 100%">
          <el-table-column class-name="date-col" width="140px" label="Date">
            <template slot-scope="scope">
              <span>{{ scope.row.creationDate | moment("DD/MM/YYYY") }}</span>
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
import DataTable from '../../components/DataTable'
import locales from '../../locales/users'

export default {
  locales,
  name: 'requestList',
  props:["data"],
  components: {DataTable},
  data () {
    return {}
  },
  created () {

  },
  mounted () {

  },
  methods:{
    actionHandleCommand (action) {
      if(action=='nothing'){
      }else if(action=='remove'){
      }
    },
    setSelectedRow (row, event, column) {
        this.selectedRow = row
        this.selectedUserId = row._id
    },
  }
}
</script>
