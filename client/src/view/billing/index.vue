<template>
<div class='app-container bill-page'>
<h2 style='font-size:1.7rem;'>Billing</h2>
  <el-card style='margin-bottom:30px;'>
    <div slot="header" class="clearfix one-bill">
    <h2>{{firstname}} {{lastname}}<span style='font-size:0.8rem;float:right;margin-right:20px;'>USER</span></h2>
    </div>
    <div class="one-bill-content">
      <div v-if="numberTotal<=10" class='mv3 bg-lightest-purple bl bw2 purple' style='  width: 100%;display: table;'>
        <div class='flex-l items-center justify-between' style='display: table-cell;'>
          <div class='bill-title-free-plan'>Free Plan</div>
          <div class='bill-content-free-plan'>Your made {{numberTotal}} requests</div>
        </div>
        <div  style='display: table-cell;text-align:right;vertical-align: middle;'>
          <el-button v-on:click="upgrade()">Upgrade to remove limit</el-button>
        </div>
      </div>
      <div v-else class='mv3 bg-lightest-red bl bw2 red' style='  width: 100%;display: table;'>
        <div class='flex-l items-center justify-between' style='display: table-cell;'>
          <div class='bill-title-free-plan'>Pipelines disabled</div>
          <div class='bill-content-free-plan'>Please upgrade to continue using this publisher account</div>
        </div>
        <div  style='display: table-cell;text-align:right;vertical-align: middle;'>
          <el-button v-on:click="upgrade()">Upgrade to remove limit</el-button>
        </div>
      </div>
      <div style='text-align:right;margin-right:20px'>
        <a @click='publisher.hidden==false ? publisher.hidden=true: publisher.hidden=false'><u>See detailed insights…</u></a>
      </div>
    </div>
  </el-card>
  <el-card v-for='publisher in listOfPublisher' class="box-card" style='margin-bottom:10px;'>
    <div slot="header" class="clearfix one-bill">
    <h2>{{publisher.name}}<span style='font-size:0.8rem;float:right;margin-right:20px;'>PUBLISHER</span></h2>
    </div>
    <div class="one-bill-content">
      <div v-if="publisher.nb<=10" class='mv3 bg-lightest-purple bl bw2 purple' style='  width: 100%;display: table;'>
        <div class='flex-l items-center justify-between' style='display: table-cell;'>
          <div class='bill-title-free-plan'>Free Plan</div>
          <div class='bill-content-free-plan'>This publisher doesn't have any subscription to use the service. </div>
        </div>
        <div  style='display: table-cell;text-align:right;vertical-align: middle;'>
          <el-button v-on:click="upgrade()">Request to the publisher to Upgrade the Plan</el-button>
        </div>
      </div>
      <div v-else class='mv3 bg-lightest-red bl bw2 red' style='  width: 100%;display: table;'>
        <div class='flex-l items-center justify-between' style='display: table-cell;'>
          <div class='bill-title-free-plan'>Pipelines disabled</div>
          <div class='bill-content-free-plan'>Please upgrade to continue using this publisher account</div>
        </div>
        <div  style='display: table-cell;text-align:right;vertical-align: middle;'>
          <el-button v-on:click="upgrade()">Upgrade to remove limit</el-button>
        </div>
      </div>
      <div style='text-align:right;;margin-right:20px'>
        <a @click='publisher.hidden==false ? publisher.hidden=true: publisher.hidden=false'><u>See detailed insights…</u></a>
      </div>
    </div>
  <div v-if="publisher.hidden===false" class='bill-table' style='margin-top:50px;'>
    <h4>Current month's spending - From {{beginMonth}} to {{endMonth}}</h4>

  <el-table
        :data="listOfPublisher"
        style="width: 100%">
        <el-table-column
          label="Title"
          >
          <template slot-scope="props">
            <p style="text-align:center;">Titre de l'article</p>
          </template>
        </el-table-column>
        <el-table-column
          label="Price($/request)"
          width="200">
          <template slot-scope="props">
            <p style="text-align:center;">${{unitPrice }}/request</p>
          </template>
        </el-table-column>
        <el-table-column
          label="Usage(request)"
          width="200">
          <template slot-scope="props">
            <p style="text-align:center;">{{ props.row.nb }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="Total"
          width="200">
          <template slot-scope="props">
            <p style="text-align:center;"></p>
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


</el-card>
<!--<div class='mv3 bg-lightest-purple bl bw2 purple' style='  width: 100%;display: table;'>
  <div class='flex-l items-center justify-between' style='display: table-cell;'>
    <div class='bill-title-free-plan'>Free Plan</div>
    <div class='bill-content-free-plan'>Your credit refills with $30 every month</div>
  </div>
  <div  style='display: table-cell;text-align:right;vertical-align: middle;'>
    <el-button v-on:click="upgrade()">upgrade to remove the limit</el-button>
  </div>
</div>-->

<!--
<el-dialog title="Activation" :visible.sync="dialogFormVisible" width="75%">

  <div style="display:flex; justify-content:space-between">
    <div class="text_block">
      <h2>Activate the account yourself</h2>
      <p>"A pay as you go" means we will recieve the bill at the end of the month. You can stop using the service when you want</p>
      <div style="display: block; padding: 10px 10px;">
        <el-form :model="form">
          <el-form-item label="Firstname" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="Lastname" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="Email" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="Address" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer" style='text-align:center'>
        <el-button type="primary" @click="dialogFormVisible = false">Update</el-button>
      </span>
    </div>
    or
    <div class="text_block">
      <div style="display: block; padding: 10px 10px;">
        <h2>Send activation to the publisher</h2>
        <p>We will send a link to the publisher to activate the journal account.</p>
        <el-form :model="form">
          <el-form-item label="Publisher" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="Firsname" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="Lastname" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="Email" :label-width="formLabelWidth">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" style='text-align:center'>
        <el-button type="primary" @click="dialogFormVisible = false">Send the request to the publisher</el-button>
      </span>
      </div></div>
  </div>
</el-dialog>-->

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
      formLabelWidth: '100px',
      dialogFormVisible: false,
      form: {name:''},
      isData: false,
      endMonth: "",
      selectedRow: "",
      numberTotal: 0,
      unitPrice: 3,
      amountTotal: 0,
      toto: 0,
      mybill: [],
      mylistrequest: [],
      tableData: [],
      listOfPublisher: [],
      firstname: '',
      lastname: ''
    }
  },
  created () {
    //this.currentMonth = moment().format('M')
    this.beginMonth    = moment().startOf('M').format('DD/MM');
    this.endMonth    = moment().endOf('M').format('DD/MM');
  },
  async mounted () {
    await axios.get('/api/users/me',{headers: {
      'Authorization': `Bearer ${this.accessToken}`}
    }).then(response => {
      this.firstname = response.data.firstname
      this.lastname = response.data.lastname
      })
    this.mylistrequest = this.getMyRequest()
  },
  methods: {
    setSelectedRow (row, event, column) {
        this.selectedRow = row
    },
    upgrade () {
      this.$router.push('/pricing')
    },
    getMyRequest(){
      axios.get('/api/requests/?page=1&count=1000&userId=true',{
        headers: {'Authorization': `Bearer ${this.accessToken}`}
       })
      .then( async (res) => {
        var outJSON = res.data.data.map(item=>{return {journal:item.editor.journal}})

        var groupBy = function(xs, key) {
          return xs.reduce(function(rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
          }, {});
        };
        var groubedByPublisher = groupBy(outJSON, 'journal')
        //this.listOfPublisher = Object.keys(groubedByPublisher)
        Object.keys(groubedByPublisher).forEach((category)=>{
          console.log(category,groubedByPublisher[category].length)
          this.listOfPublisher.push({'name':category,'nb':groubedByPublisher[category].length,'hidden':true})
        });
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
.red {
    color:#ea261a;
}
.bg-lightest-purple {
    background-color: #F0F7FF;
}
.bg-lightest-red {
    background-color: #fdd;
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
.one-bill h2{
    font-family: "DNLTPro-bold";
    text-align:left;
    font-size:1.2rem;
  }
  .bill-page h2{
    font-family: "DNLTPro-bold";
    text-align:left;
    font-size:1.4rem;
  }

.one-bill-content{
  margin-left:5px;
}
.el-card__header {
    padding: 0px 20px;
    border-bottom: 1px solid #EBEEF5;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .el-card .el-card__header {
    background-color: #FFF;
    color: #333333;
    font-size: 1rem;
    text-align: center;
    font-weight: bold;
}
.text_block {
  text-align:justify;
  line-height: 24px;
  display:block;
  width:48%;
  text-align:justify;
  text-align-last:center;
  padding: 10px 10px 10px 10px;
  background-color: #f1f1f1;
  border-radius: 5px;
}
</style>
