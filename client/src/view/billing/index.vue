<template>
<div class='app-container bill-page'>
  <el-row>
    <el-alert
      title="Choose between individual or publisher plan"
      type="info"
      description="With updating individual plan, you will be able to use the service even if the publisher has not activated his account. "
      show-icon>
    </el-alert>

  </el-row>
<h2 style='font-size:1.4rem;'>Individual Plan {{currentPlan}}</h2>
  <el-card style='margin-bottom:50px; margin-left:30px;'>
    <div class="clearfix one-bill">
    <el-row>
      <!--<el-col :span='6'>
        <h2 style='font-size:1.1rem;'>{{firstname}} {{lastname}} <!-- <span style='margin-left:20px;'><el-button  type="info" round size="mini" >USER</el-button></span>--><!--</h2>-->
      <!--</el-col >-->
      <el-col :span='24'>
        <div class="one-bill-content">
          <div v-show="currentPlan">
          <div v-if="currentPlan==='premium'" class='mv3 bg-lightest-green bl bw2 green' style='  width: 100%;display: table;'>
            <div class='flex-l items-center justify-between' style='display: table-cell;'>
              <div class='bill-title-free-plan'>Premium Plan</div>
              <div class='bill-content-free-plan'>You can use the tool as much as you like</div>
            </div>
            <div  style='display: table-cell;text-align:right;vertical-align: middle;'>
              <el-button v-on:click="downgrade()">Delete your individual plan</el-button>
            </div>
          </div>
          <div v-else-if="currentPlan==='freemium' & numberRequestTotal<10" class='mv3 bg-lightest-light-blue bl bw2 light-blue' style='  width: 100%;display: table;'>

            <div class='flex-l items-center justify-between' style='display: table-cell;'>
              <div class='bill-title-free-plan'>Free Plan</div>
              <div class='bill-content-free-plan'>Request {{ numberRequestTotal }} out of your 10 free requests</div>
            </div>
            <div  style='display: table-cell;text-align:right;vertical-align: middle;'>
              <el-button v-on:click="upgrade()">Upgrade to remove your individual limit</el-button>
            </div>
          </div>
          <div v-else class='mv3 bg-lightest-yellow bl bw2 yellow' style='  width: 100%;display: table;'>
            <div class='flex-l items-center justify-between' style='display: table-cell;'>
              <div class='bill-title-free-plan'>Free Plan</div>
              <div class='bill-content-free-plan'>You have reached the limit of free invitations</div>
            </div>
            <div  style='display: table-cell;text-align:right;vertical-align: middle;'>
              <el-button v-on:click="upgrade()">Upgrade to remove limit</el-button>
            </div>
          </div>
        </div>
          </div>
        </el-col>
      </el-row>
      <div style='text-align:right;margin-right:20px'>
        <a @click='invoice==false ? invoice=true: invoice=false' style='font-size:0.9rem;'><u>See detailed insights…</u></a>
      </div>

      <div v-if="invoice" class='bill-table' style='margin-top:50px;'>
        <h4>Current month's spending - From <!--{{beginMonth}} to {{endMonth}}--> {{ beginPeriod }} to {{ endPeriod }}</h4>
      <el-table
            :data="mySubscription"
            style="width: 100%">
            <el-table-column
              label="Title"
              >
              <template slot-scope="props">
                <p style="text-align:center;">INVITATION TO REVIEW </p>
              </template>
            </el-table-column>
            <el-table-column
              label="Price($/request)"
              width="200">
                <p style="text-align:center;">$1/request</p>
            </el-table-column>
            <el-table-column
              label="Usage(request) (*)"
              width="200">
              <template slot-scope="props">
                <p style="text-align:center;">{{ props.row.quantity}}</p>
              </template>
            </el-table-column>
            <el-table-column
              label="Total"
              width="200">
              <template slot-scope="props">
                <p style="text-align:center;">${{props.row.nextInvoice.amount_due / 100}}</p>
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
                  <p>${{mySubscription[0].nextInvoice.amount_due / 100}}</p>
              </div>
            </div>
          </div>
          <!--<div class='flex-subbill items-center mv1'>
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
          </div>-->
          <div class='flex-subbill items-center mv1'>
            <div class='w-50 w-75-ns'>
              <div class='f5 gray tr'>
                This month’s running total ( {{beginPeriod}} - Today)
              </div>
            </div>
            <div class='w-50 w-25-ns'>
              <div class='green-toto gray tr'>
                <p>${{mySubscription[0].nextInvoice.amount_due / 100}}</p>
              </div>
            </div>
          </div>
        </div>
        <div style='font-size:0.8rem;text-align:right;'>
        <p><i>*The invoice may show a discrepancy between the number of requests made and the number indicated. A delay of 24 hours regularizes the situation.</i></p>
        </div>
      </div>

    </div>
  </el-card>

  <h2 style='font-size:1.4rem;'>Publisher Plan</h2>
  <el-card v-for='publisher in myJournals' v-bind:key="publisher.id" class="box-card " style='margin-bottom:10px;margin-left:30px;'>
    <div class="clearfix one-bill">
      <el-row>
        <el-col :span='6'>
          <h2 style='font-size:1.1rem;'>{{publisher.name}}<!-- <span style='margin-left:20px;'><el-button  type="info" round size="mini" >PUBLISHER</el-button></span>--></h2>
        </el-col>
        <el-col :span='18'>
          <div class="one-bill-content">
            <div v-if="publisher.unlock" class='mv3 bg-lightest-green bl bw2 green' style='  width: 100%;display: table;'>
              <div class='flex-l items-center justify-between' style='display: table-cell;'>
                <div class='bill-title-free-plan'>Activated account</div>
                <div class='bill-content-free-plan' style='font-family: "DNLTPro-regular";font-weight:300;'>This publisher has subscribed to use the service. </div>
              </div>
            </div>
            <div v-else class='mv3 bg-lightest-yellow bl bw2 yellow' style='  width: 100%;display: table;'>
              <div class='flex-l items-center justify-between' style='display: table-cell;'>
                <div class='bill-title-free-plan'>Non-activated account</div>
                <div class='bill-content-free-plan' style='font-family: "DNLTPro-regular";font-weight:300;'>Please upgrade to continue using this publisher account</div>
              </div>
              <div  style='display: table-cell;text-align:right;vertical-align: middle;'>
                <el-button v-on:click="dialogSendEditorVisible=true">Request to the editor to upgrade the plan</el-button>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-card>
  <el-card style='margin-bottom:50px; margin-left:30px;'>
    <h2>Invite Publishers to use the service</h2>
    <el-form :model="form" ref="formInvitationPublisher" :rules="formInvitationPublisherRules" label-width="160px">
      <el-col :span='18'>
        <el-form-item label="Journal" prop="journal">
          <el-select
            v-model="formInvitationPublisher.journal"
            filterable
            remote
            placeholder="Enter your revue"
            :remote-method="remoteMethod"
            :loading="loading">
            <el-option
              v-for="item in listJournals"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Editor in Chief - Name" prop="nameEditorInChief">
          <el-input v-model="formInvitationPublisher.nameEditorInChief" ></el-input>
        </el-form-item>
        <el-form-item label="Editor in Chief - Email" prop="emailEditorInChief">
          <el-input v-model="formInvitationPublisher.emailEditorInChief" ></el-input>
        </el-form-item>
      </el-col>
    </el-form>
    <el-col :span='6'>
      <div style='width:100%;text-align:right'>
        <el-button type='primary' @click="sendRequest('formInvitationPublisher')" round>Send invitation</el-button>
      </div>
    </el-col>
  </el-card>

<el-dialog  custom-class='pricing-dialog-container' :visible.sync="visiblePricing" width="80%" top="10vh"  title="Pricing">
    <showPricing :currentPlan='currentPlan' @close="closeAndReload()" v-on:close-pricing="closeAndReload()"/>
</el-dialog>
<el-dialog :visible.sync="dialogSendEditorVisible" title="Invitation">
    <sendEditorInvitation @close="dialogSendEditorVisible=false"/>
</el-dialog>
</div>
</template>
<script>
import locales from 'locales/article'
import { mapGetters } from 'vuex'
import axios from 'axios'
import * as moment from 'moment';

import sendEditorInvitation from './sendRequestToEditor'
import showPricing from './showPricing'

export default{
  name: 'billing',
  locales,
  components: {sendEditorInvitation,showPricing},
  computed: {
    ...mapGetters([
      'userId',
      'accessToken'
    ])
  },
  data () {
    return {
      journal: ["Nature","Publiscience","the BMJ"],
      listJournals: [],
      formInvitationPublisher: {
        journal: '',
        emailEditorInChief: '',
        nameEditorInChief: ''
      },
      formInvitationPublisherRules: {
        journal: [
          {
            required: true,
            message: "You need to enter your journal",
            trigger: "blur"
          }
        ],
        nameEditorInChief: [
          {
            required: true,
            message: "You need to enter the name of the editor in chief",
            trigger: "blur"
          }
        ],
        emailEditorInChief: [
          {
            required: true,
            type: "email",
            message: "You need to enter the email of the editor in chief",
            trigger: "blur"
          }
        ],
      },
      invoice: false,
      formLabelWidth: '100px',
      dialogFormVisible: false,
      dialogSendEditorVisible: false,
      visibleDiagSubscription: false,
      visiblePricing: false,
      form: {name:''},
      isData: false,
      endMonth: "",
      selectedRow: "",
      numberTotal: 0,
      numberRequestTotal: 0,
      unitPrice: 1,
      amountTotal: 0,
      toto: 0,
      mybill: [],
      mylistrequest: [],
      tableData: [],
      listOfPublisher: [],
      firstname: '',
      lastname: '',
      currentPlan: null,
      billingId: null,
      mySubscription: null,
      myJournals: null,
      loading: false,
      beginPeriod: null,
      endPeriod: null
    }
  },
  async created () {
    await this.getSubscription()
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
      this.billingId = response.data.billing
      })
      this.getSubscription()
  },
  watch:{
    visiblePricing (val){
      if(val===false){
        this.reloadView()
        console.log("watch visiblePricing",val)
        console.log("currentPlan",this.currentPlan)
      }
    }
  },
  methods: {
    closeAndReload() {
      this.visiblePricing = false
      console.log("closeAndReload")

    },
    async reloadView () {
      this.getSubscription()
      this.$forceUpdate();
      console.log("$forceUpdate")
    },
    sendRequest (formInvitationPublisher) {
      this.$refs[formInvitationPublisher].validate(async (valid) => {
        if (valid) {

        }
      })
    },
    setSelectedRow (row, event, column) {
        this.selectedRow = row
    },
    upgrade () {
      this.visiblePricing = true
      //this.$router.push('/pricing')
    },
    downgrade () {
      this.$confirm("Are you sure to delete your individual plan ?", "Confirmation", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "success"
      }).then(async ()=>{
        this.unsubscribe()
        await this.reloadView()
      })
    },
    remoteMethod(query) {
			if (query !== '') {
				this.loading = true;
				setTimeout(() => {
					this.loading = false;
					this.listJournals = this.list.filter(item => {
						return item.label.toLowerCase()
							.indexOf(query.toLowerCase()) > -1;
					});
				}, 200);
			} else {
				this.listJournals = [];
			}
		},
    async getSubscription(){

        await axios.get('/api/billings/?page=1&count=1000&userId=true',{
          headers: {'Authorization': `Bearer ${this.accessToken}`}
        }).then((response)=>{
          //console.log(response)
          this.currentPlan = response.data.billing.plan
          if(response.data.billing){
            this.mySubscription = [response.data.billing.subscription]

            this.beginPeriod = moment.unix(this.mySubscription[0].current_period_start).format("DD/MM/YYYY");
            this.endPeriod = moment.unix(this.mySubscription[0].current_period_end).format("DD/MM/YYYY");

            this.numberRequestTotal = response.data.billing.requests.length
          }
          this.myJournals = response.data.journals
        }).catch(()=>{
          this.currentPlan = 'freemium'
          this.mySubscription = []
        })
    },
    async unsubscribe(){

        await axios.post('/api/billings/unsubscribe/' + this.userId + '/' + this.billingId, { billingId:this.billingId } ,{
          headers: {'Authorization': `Bearer ${this.accessToken}`}
        }).then((response)=>{
          this.getSubscription()
        })
    }

  }
}
</script>
<style>
.mv3{
  margin: 1rem 0;
  padding:  0.5rem 1rem ;
  border-radius: 5px;
}

.bw2 {
    border-width: 4px;
}

.light-blue {
    color: rgb(48, 65, 86);
}
.red {
    color:#ea261a;
}
.green{
    color: #458227;
}
.yellow{
  color: #DB9107;
}

.bg-lightest-light-blue {
    background-color: #F0F7FF;
}
.bg-lightest-red {
    background-color: #fdd;
}

.bg-lightest-green {
    background-color: rgb(225, 243, 216);
}

.bg-lightest-yellow {
    background-color: #FAF4D0;
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
  margin-left: 60px;
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

.green-toto{
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
  text-align: left;
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
