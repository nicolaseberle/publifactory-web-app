<template>
<div class='app-container'>
  <div class='mv3 bg-lightest-purple bl bw2 purple'>
    <div class='flex-l items-center justify-between'>
      <div class='bill-title-free-plan'>Free Plan</div>
      <div class='bill-content-free-plan'>Your credit refills with $30 every month</div>
    </div>
  </div>
  <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="Publisher"
          >
          <template slot-scope="props">
            <p style="text-align:center;">{{ props.row.user }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="Price($/request)"
          width="200">
          <template slot-scope="props">
            <p style="text-align:center;">${{props.row.unitPrice }}/request</p>
          </template>
        </el-table-column>
        <el-table-column
          label="Usage (Number of request)"
          width="200">
          <template slot-scope="props">
            <p style="text-align:center;">{{ props.row.numberTotal }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="Total"
          width="200">
          <template slot-scope="props">
            <p style="text-align:center;">${{ props.row.amountTotal }}</p>
          </template>
        </el-table-column>
      </el-table>

</div>
</template>
<script>
import locales from 'locales/article'
import { mapGetters } from 'vuex'
import axios from 'axios'
import * as moment from 'moment';

export default{
  name: 'billing',
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
      selectedRow: "",
      numberTotal: 0,
      unitPrice: 3,
      amountTotal: 0,
      mybill: [],
      mylistrequest: [],
      tableData: []
    }
  },
  mounted () {
    this.mylistrequest = this.getMyRequest()
  },
  methods: {
    setSelectedRow (row, event, column) {
        this.selectedRow = row
    },
    getMyRequest(){
      axios.get('/api/requests/myRequest/'+this.userId+'?page=1&count=10',{
        headers: {'Authorization': `Bearer ${this.accessToken}`}
       })
      .then( async (res) => {
        this.numberTotal = res.data.data.length;
        this.amountTotal = this.unitPrice * this.numberTotal;
        this.isData = true;

        this.tableData= [{
            user: this.userId,
           numberTotal: this.numberTotal,
           amountTotal: this.amountTotal,
           unitPrice: this.unitPrice
         }]


      })
    }
  }
}
</script>
<style>
.mv3{
  margin: 1rem 0;
  padding:  0.5rem 1rem ;
}

.bw2 {
    border-width: 4px;
}

.purple {
    color: rgb(48, 65, 86);
}

.bg-lightest-purple {
    background-color: #F0F7FF;
}

.bl{
  border-left-style: solid;
}

.items-center {
    -ms-flex-align: center;
    align-items: center;

}

@media screen and (min-width: 60em)
.flex-l {
    display: -ms-flexbox;
    display: flex;
}

.justify-between {
    -ms-flex-pack: justify;
    justify-content: space-between;
}

.bill-title-free-plan{
  font-size: 1.125rem;
  display: block;
  font-family: "DNLTPro-bold";
  line-height: 1.5;
}

.bill-content-free-plan{
  font-size: 1rem;
  display: block;
  font-family: "DNLTPro-regular";
  line-height: 1.5;
}
.el-table th{
  background-color: #FFF;
  color: #333;
}
.el-table__header{
  background-color: #FFF;
}

</style>
