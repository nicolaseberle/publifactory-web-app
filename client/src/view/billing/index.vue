<template>
<div class='app-container'>
  <div class='mv3 bg-lightest-purple bl bw2 purple' style='  width: 100%;display: table;'>
    <div class='flex-l items-center justify-between' style='display: table-cell;'>
      <div class='bill-title-free-plan'>Free Plan</div>
      <div class='bill-content-free-plan'>Your credit refills with $30 every month</div>
    </div>
    <div  style='display: table-cell;text-align:right;vertical-align: middle;'>
      <el-button v-on:click="upgrade()">Upgrade to remove limit</el-button>
    </div>
  </div>
  <div class='bill-table'>
    <h4>Current month's spending - From {{beginMonth}} to {{endMonth}}</h4>

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
          label="Usage(request)"
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
      <div class="pv2 ">
        <div class='flex-subbill items-center mv1'>
        <div class='w-50 w-75-ns'>
          <div class='f5 gray tr'>
            Subtotal
          </div>
        </div>
        <div class='w-50 w-25-ns'>
          <div class='gray tr'>
            ${{amountTotal}}
          </div>
        </div>
      </div>
      <div class='flex-subbill items-center mv1'>
        <div class='w-50 w-75-ns'>
          <div class='f5 gray tr'>
            Free monthly credit
          </div>
        </div>
        <div class='w-50 w-25-ns'>
          <div class='gray tr'>
            -$30
          </div>
        </div>
      </div>
      <div class='flex-subbill items-center mv2'>
        <div class='w-50 w-75-ns'>
          <div class='f5 gray tr'>
            This month’s running total ({{beginMonth}} - Today)
          </div>
        </div>
        <div class='w-50 w-25-ns'>
          <div class='gray tr'>
            <div class="f0 f00-l green tnum">${{toto}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>

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
      endMonth: "",
      selectedRow: "",
      numberTotal: 0,
      unitPrice: 3,
      amountTotal: 0,
      toto: 0,
      mybill: [],
      mylistrequest: [],
      tableData: []
    }
  },
  created () {
    //this.currentMonth = moment().format('M')
    this.beginMonth    = moment().startOf('M').format('DD/MM');
    this.endMonth    = moment().endOf('M').format('DD/MM');
  },
  mounted () {

    this.mylistrequest = this.getMyRequest()
  },
  methods: {
    setSelectedRow (row, event, column) {
        this.selectedRow = row
    },
    upgrade () {

    },
    getMyRequest(){
      axios.get('/api/requests/myRequest/'+this.userId+'?page=1&count=1000',{
        headers: {'Authorization': `Bearer ${this.accessToken}`}
       })
      .then( async (res) => {
        this.numberTotal = res.data.data.length;
        this.amountTotal = this.unitPrice * this.numberTotal;
        if ((this.amountTotal - this.unitPrice*10)<=0){
          this.toto = 0
        }
        else{
          this.toto = this.amountTotal - this.unitPrice*10
        }
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
.bill-table .el-table th{
  background-color: #FFF;
  color: #333;
  font-size:1rem;
}
.bill-table{
  margin-top:50px;
}
.bill-table .el-table__header{
  background-color: #FFF;
}

.pv2{
  padding-top: .5rem;
  padding-bottom: .5rem;
}
.mv1{
  margin-right:90px;
  margin-top: .25rem;
  margin-bottom: .25rem;
}
.mv2{
  margin-right:90px;
  margin-top: .5rem;
  margin-bottom: .5rem;
}
h4{
  font-family: "DNLTPro-bold";
  line-height: 1.5;
  font-size: 1.2rem;
}

.green{
  font-size: 2.25rem;
}
.w-25-ns{
      width: 25%;
}
.w-50-ns{
      width: 50%;
}
.w-75-ns{
      width: 75%;
}
.tr{
      text-align: right;
}
.flex-subbill {
    display: -ms-flexbox;
    display: flex;
}
.gray{
  color:#667679;
}
.f5 {
  font-size: .875rem;
}
</style>
