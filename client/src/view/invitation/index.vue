<template>
  <div class='app-container'>
    <el-row v-if="isData" style='padding: 20px; margin-bottom: 20px; font-family:DNLTPro-regular;'>
      <h2 style="font-family:DNLTPro-regular;">My Invitations</h2>
      <el-table
      ref="dataReq"
      highlight-current-row
      :data="mylistrequest"
      style="width: 100%"
      stripe
      @row-click="setSelectedRow">
      <el-table-column class-name="date-col" width="180px" label="Date">
        <template slot-scope="props">
          <span>{{ props.row.history[0].date | moment("DD/MM/YYYY") }}</span>
        </template>
      </el-table-column>
        <el-table-column
          label="Title"
          prop="title"
          >
          <template slot-scope="props">
            <p style="text-align:center;">{{ props.row.title }}</p>
          </template>
        </el-table-column>

        <el-table-column
          label="Publisher"
          prop="edi_name"
          width="120">
          <template slot-scope="props">
              <p style="text-align:center">{{ props.row.editor.journal }}</p>
          </template>
        </el-table-column>
          <el-table-column
            label="Reviewer Name"
            prop="rev_id"
            width="180">
            <template slot-scope="props">
                <p style="text-align:center; font-weight:bold;">{{ props.row.reviewer.name }}</p>
            </template>
        </el-table-column>

        <el-table-column
          label="Deadline"
          prop="date"
          width="120">
          <template slot-scope="props">
            <div style='text-align:center;'>
              <p>{{ remainingDay(props.row.deadline)}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="Status" prop="status" width="120">
          <template slot-scope="props">

            <el-tag v-if='props.row.history[props.row.history.length - 1].status=="pending"' class-name="el-tag-status"  :type="statusInvitationFilter(props.row.history[props.row.history.length - 1].status)" >sent</el-tag>
            <el-tag v-else-if='props.row.history[props.row.history.length - 1].status=="done"' class-name="el-tag-status"  :type="statusInvitationFilter(props.row.history[props.row.history.length - 2].status)" >{{ props.row.history[props.row.history.length - 2].status }}</el-tag>
            <el-tag v-else class-name="el-tag-status"  :type="statusInvitationFilter(props.row.history[props.row.history.length - 1].status)" >{{ props.row.history[props.row.history.length - 1].status }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>
<script>
import locales from 'locales/article'
import { mapGetters } from 'vuex'
import axios from 'axios'
import * as moment from 'moment';

export default{
  name: 'invitation',
  locales,
  component: {},
  computed: {
    ...mapGetters([
      'userId',
      'accessToken'
    ])
  },
  data () {
    return {
      isData: false,
      currentDate: "",
      mylistrequest: []
    }
  },
  mounted() {
    this.mylistrequest = this.getMyRequest()
    this.currentDate = moment()
  },
  methods: {
    remainingDay (deadline) {
      const rDay = moment().to(deadline);
      return `${rDay}`
    },
    setSelectedRow (row, event, column) {
        this.selectedRow = row
    },
    statusInvitationFilter (status) {
      const statusMap = {
        done: 'success',
        accepted: 'success',
        pending: 'primary',
        read:  'primary',
        sent: 'primary',
        bademail: 'warning',
        unsubscribed: 'warning',
        outfield: 'info',
        rejected: 'danger',
        removed: 'danger'
      }
      return statusMap[status]
    },
    getMyRequest(){
      axios.get('/api/requests/myRequest/'+this.userId+'?page=1&count=10',{
        headers: {'Authorization': `Bearer ${this.accessToken}`}
       })
      .then( async (res) => {
        this.mylistrequest = res.data.data;
        this.isData = true;
      })
    }
  }
}
</script>
<style>
.el-table th {
  border-bottom: 1px solid #EBEEF5;
}

.el-table__header-wrapper {
  font-size: 1.1rem;
}

tbody {
  font-size: 0.8rem;
}

.el-table p {
  margin: 5px 0!important;
}
.el-table .cell{
  text-align: center;
  word-break: normal;
}

.clearfix:before,
  .clearfix:after {
    background-color: white;
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .clearfix, .el-card .el-card__header{
    background-color: white;
    font-size: 1.2rem;
  }
  
</style>
