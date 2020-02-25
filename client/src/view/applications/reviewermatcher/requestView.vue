<template>
	<div>
		<el-form
			label-width="240px"
			:model="formMail"
			:rules="mailRules"
			ref="formMail"
			style="text-align :left; padding-bottom:20px;"
		>
			<el-form-item label="Your email" prop="mailDest">
				<el-input v-model="formMail.mailDest"></el-input>
			</el-form-item>
			<el-form-item label="Firstname" prop="firstname">
				<el-input v-model="formMail.firstname"></el-input>
			</el-form-item>
			<el-form-item label="Lastname" prop="lastname">
				<el-input v-model="formMail.lastname"></el-input>
			</el-form-item>
			<!--
			<el-form-item label="Journal requesting the reviewing" prop="journal">
				<el-input v-model="formMail.journal"></el-input>
			</el-form-item>-->
			<!-- <el-form-item label="Journal issn" prop="issn">
      <el-input v-model="formMail.issn"></el-input>
    </el-form-item> -->
			<el-form-item label="Object" prop="object">
				<el-input v-model="formMail.object"></el-input>
			</el-form-item>
			<el-form-item label="Message" prop="message">
				<!--<el-input
        type="textarea"
        :autosize="{ minRows: 10, maxRows: 30}"
        v-model="formMail.message">
      </el-input>-->
				<div v-bind:id="idToolBar" style="z-index=1000;">
					<span class="ql-formats">
						<button class="ql-bold"></button>
						<button class="ql-italic"></button>
						<button class="ql-underline"></button>
					</span>
					<span class="ql-formats">
						<button class="ql-blockquote"></button>
					</span>
					<span class="ql-formats">
						<button class="ql-list" value="bullet"></button>
						<button class="ql-indent" value="-1"></button>
						<button class="ql-indent" value="+1"></button>
					</span>
					<span class="ql-formats">
						<button class="ql-link"></button>
					</span>
				</div>
				<div v-bind:id="idEditor">
					<span class="p-span" v-html="formMail.message"></span>
				</div>
			</el-form-item>
			<el-form-item label="Review due by" prop="deadline">
				<el-date-picker
					type="date"
					placeholder="Deadline"
					v-model="formMail.deadline"
				></el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-switch
				  v-model="editorialUse"
				  active-text="Editorial use"
				  inactive-text="Personal use">
				</el-switch>
				<el-tag type="warning" v-if="editorialUse" style="margin-bottom:28px;width:100%">We will send a link to the publisher to activate the journal account.<br> The invitation will be sent after his/her confirmation and a email will inform you about it.</el-tag>
				<el-form-item  label="Journal requesting the reviewing" prop="journal">
					<el-select
						v-model="currentJournal"
						filterable
						remote
						placeholder="Enter your revue"
						:remote-method="remoteMethod"
						:loading="loading"
						:disabled="editorialUse===false">
						<el-option
							v-for="item in listJournals"
							:key="item.value"
							:label="item.label"
							:value="item.value"
							:disabled="editorialUse===false">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="Editor in Chief to contact" >
					<el-form-item label="Name" prop="nameEditorInChief">
	    			<el-input v-model="formMail.nameEditorInChief" :disabled="editorialUse===false"></el-input>
	  			</el-form-item>
					<el-form-item label="Email" prop="emailEditorInChief">
	    			<el-input v-model="formMail.emailEditorInChief" :disabled="editorialUse===false"></el-input>
	  			</el-form-item>
				</el-form-item>
			</el-form-item>
			<el-form-item label="CGU" prop="type">
				<el-checkbox-group v-model="formMail.type">
					<el-checkbox label="I accept the Term of Use (CGU)" name="type"></el-checkbox>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item class="flex_items">
				<el-button v-on:click="$emit('close')">Cancel</el-button>
				<el-button type="primary" @click="sendRequestRev('formMail')" style="margin-left:10px!important"
					>Send</el-button>
					<currentPlanBox :maxInvitation='maxInvitation' :currentPlan='currentPlan'/>
			</el-form-item>
		</el-form>

    <el-dialog class='login-modal'
		:visible.sync="modalLoginVisible"
		width="30%"
		top="20vh"
		:close-on-click-modal='false'
		:close-on-press-escape='false'
		append-to-body>
      <modalLogin v-on:close='modalLoginVisible=false'/>
    </el-dialog>

	</div>
</template>
<script>
import axios from "axios";
import "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import currentPlanBox from "./components/plan";
import { mapGetters } from "vuex";
import modalLogin from './components/modalLogin'

var Quill = require("quill");

export default {
	props: ["formPost", "formMail", "rowInfos","billingId"],
	components:{currentPlanBox,modalLogin},
	data() {
		return {
			modalLoginVisible: false,
			currentJournal: null,
			editorialUse: false,
			list: [],
			editor: {},
			idEditor: this.setIdEditor(),
			idToolBar: this.setIdToolBar(),
			confirmationOfSending: false,
			requestInfos: {},
			dialogVisible: false,
			maxInvitation: 0,
			currentPlan: null,
			journal: ["Nature","Publiscience","the BMJ"],
			listJournals: [],
			value: [],
			loading: false,
			options: [
				{
					value: "1x1week",
					label: "Once a week"
				},
				{
					value: "2x1month",
					label: "2 times each month"
				},
				{
					value: "1x1month",
					label: "Once a month"
				},
				{
					value: "1x2month",
					label: "Once every 2 month"
				}
			],
			mailRules: {
				message: [
					{
						required: true,
						message: "Please input enter a message for your email",
						trigger: "blur"
					}
				],
				object: [
					{
						required: true,
						message: "A email needs an object",
						trigger: "blur"
					}
				],
				deadline: [
					{
						required: true,
						message: "You need to pick a deadline",
						trigger: "blur"
					}
				],
				mailDest: [
					{
						required: true,
						type: "email",
						message: "You need to enter your email",
						trigger: "blur"
					}
				],
				journal: [
					{
						required: false,
						message: "You need to enter your journal",
						trigger: "blur"
					}
				],
				nameEditorInChief: [
					{
						required: false,
						message: "You need to enter the name of the editor in chief",
						trigger: "blur"
					}
				],
				emailEditorInChief: [
					{
						required: false,
						type: "email",
						message: "You need to enter the email of the editor in chief",
						trigger: "blur"
					}
				],
				firstname: [
					{
						required: true,
						message: "You need to enter your name",
						trigger: "blur"
					}
				],
				lastname: [
					{
						required: true,
						message: "You need to enter your name",
						trigger: "blur"
					}
				],
				type: [
					{
						type: "array",
						required: true,
						message: "You need to accept the CGU",
						trigger: "blur"
					}
				]
			},
			receiveCopy: false
		};
	},
	computed: {
		...mapGetters(["loggedIn","accessToken"])
	},
	watch: {
		modalLoginVisible (val){
			if(val==false){
				if(this.loggedIn) {
		      axios.get('/api/users/me',{headers: {
		        'Authorization': `Bearer ${this.accessToken}`}
		      }).then(response => {
		        this.formMail.mailDest = response.data.email
		        this.formMail.name = response.data.firstname + ' ' +  response.data.lastname
		        this.formMail.firstname = response.data.firstname
		        this.formMail.lastname =  response.data.lastname
						this.billingId = response.data.billing
						this.getSubscription()
		        })

		    }
			}
		},
		editorialUse (val) {
			if(val) {
				this.currentJournal = ''
				this.formMail.journal = ''
				this.mailRules.journal = [
					{
						required: true,
						message: "You need to enter your journal",
						trigger: "blur"
					}
				]
				this.mailRules.nameEditorInChief = [
					{
						required: true,
						message: "You need to enter the name of the editor in chief",
						trigger: "blur"
					}
				]
				this.mailRules.emailEditorInChief = [
					{
						required: true,
						message: "You need to enter the email of the editor in chief",
						trigger: "blur"
					}
				]
			}
			else {
				this.currentJournal = 'None'
				this.formMail.journal = 'None'
				this.formMail.nameEditorInChief = ''
				this.formMail.emailEditorInChief = ''
				this.mailRules.nameEditorInChief = [
					{
						required: false,
						message: "You need to enter the name of the editor in chief",
						trigger: "blur"
					}
				]
				this.mailRules.emailEditorInChief= [
					{
						required: false,
						message: "You need to enter the email of the editor in chief",
						trigger: "blur"
					}
				]
				this.mailRules.journal = [
					{
						required: false,
						message: "You need to enter your journal",
						trigger: "blur"
					}
				]
				// update the personnal plan to check permission
				this.getSubscription()
			}
		},
		currentJournal(val){
			this.formMail.journal = val
			if(val!=='' && val!=='None'){
				console.log("watch currentJournal:: ")
				this.checkJournalSubscription ()
			}
		},
	},
	async created () {
		await this.getSubscription()
	},
	mounted() {
		if(this.loggedIn) {
			this.modalLoginVisible = false
		} else{
			this.modalLoginVisible = true
		}

		var quill = new Quill("#" + this.idEditor, {
			modules: {
				toolbar: "#" + this.idToolBar
			},
			theme: "snow"
		});
		this.editor = quill;
		this.editor.root.innerHTML = this.formMail.message;
		this.editor.on("text-change", (delta, oldDelta, source) => {
			this.formMail.message = this.editor.root.innerHTML;
		});
		/*this.maxInvitation = parseInt(this.$cookie.get("maxInvitation"), 10);
		if (Number.isNaN(this.maxInvitation)) {
			this.$cookie.set("maxInvitation",0);
			this.maxInvitation = parseInt(this.$cookie.get("maxInvitation"), 10);
		}*/

		this.getListJournal()
	},
	methods: {
		async checkJournalSubscription () {
			/*const response = await axios.get('/api/billings/?page=1&count=1000&userId=true',{
				headers: {'Authorization': `Bearer ${this.accessToken}`}
			})*/
			this.currentPlan = 'nonActivated'
			//this.currentPlan = response.data.billing ? 'Activated' : 'Non-activated'
		},
		async getListJournal() {
			/*await axios.get('/api/journal/list').then((res)=>{
				this.journal = res.data
				this.list = this.journal.map(item => {
	        return { value: `value:${item}`, label: `label:${item}` };
	      });
			})*/
			this.list = this.journal.map(item => {
				return { value: `${item}`, label: `${item}` };
			});
		},
		async getSubscription(){
			try{
				if(this.loggedIn){
					await axios.get('/api/billings/?page=1&count=1000&userId=true',{
						headers: {'Authorization': `Bearer ${this.accessToken}`}
					}).then((response)=>{
						this.currentPlan = response.data.billing.plan
						if(response.data.billing){
							this.mySubscription = [response.data.billing.subscription]
							this.maxInvitation = response.data.billing.requests.length
						}
						this.myJournals = response.data.journals
						//console.log(this.myJournals

					})
				}
			} catch(err){
				this.currentPlan="freemium"
			}
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
		async addRequest(dataJson) {
			const response = await axios({
				method: "post",
				url: "/api/requests/" + this.billingId,
				validateStatus: undefined,
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${this.accessToken}`
				},
				data: dataJson
			});
			if (response.status !== 200) {
				console.log("Failed");
			} else {
				console.log(response);
			}
		},
		updateDataJson() {
			let dataJson = {
				title: this.requestInfos["title"],
				abstract: this.requestInfos["abstract"],
				deadline: this.requestInfos["deadline"].toUTCString(),
				object: this.requestInfos["object"],
				content: this.requestInfos["content"],
				remind: this.requestInfos["remind"],
				reviewer: {
					semanticScholarId: this.requestInfos["rev_id"],
					email: this.requestInfos["rev_mail"],
					name: this.requestInfos["rev_name"]
				},
				editor: {
					name: this.requestInfos["pub_name"],
					email: this.requestInfos["pub_mail"],
					journal: this.requestInfos["pub_journal"]
				}
			};
			return dataJson;
		},
		setIdEditor() {
			return "editor-container";
		},
		setIdToolBar() {
			return "toolbar-container";
		},
		showPromptUserConnected() {
			if(this.currentPlan==="premium" | (this.currentPlan==="freemium" & this.maxInvitation<10)){
			this.$confirm("Are you sure to invite this reviewer ?", "Confirmation", {
				confirmButtonText: "OK",
				cancelButtonText: "Cancel",
				type: "success"
			})
				.then(this.handlePromptSuccess)
				.catch(this.handlePromptFailure);
			} else {
				this.$confirm("You have reached your quota of free requests", "Blocked account", {
					confirmButtonText: "OK",
					type: "error"
				})
					.then(this.handlePromptUpdgrade)
					.catch(this.handlePromptFailure);
			}
		},
		showPromptUserDisconnected() {
			const createElement = this.$createElement;
			//this.maxInvitation = parseInt(this.$cookie.get("maxInvitation"), 10);

			this.$confirm("Are you sure to invite this reviewer ?", "Confirmation", {
				confirmButtonText: "OK",
				cancelButtonText: "Cancel",
				type: "success"
			})
				.then(this.handlePromptSuccess)
				.catch(this.handlePromptFailure);
		},
		async handlePromptSuccess() {
			this.$emit("close");
			let dataJson = this.updateDataJson();
			this.confirmationOfSending = true;
			if (this.loggedIn)  {
				await this.addRequest(dataJson)
				this.$message({
					type: "success",
					message: "Invitation sent"
				});
			} else {
				this.confirmationOfSending = false;
				this.$message({
					type: "info",
					message: "Invitation canceled"
				});
			}


		},
		handlePromptUpdgrade() {
			this.confirmationOfSending = false;
			this.$emit("close");
			this.$message({
				type: "info",
				message: "Invitation canceled"
			});
			this.$router.push('/billing')
		},
		handlePromptFailure() {
			this.confirmationOfSending = false;
			this.$emit("close");
			this.$message({
				type: "info",
				message: "Invitation canceled"
			});
		},
		 createGuestAccount(formMail) {
			this.$refs[formMail].validate(async (valid) => {
				if (valid) {
					await axios.post("/api/users/create-guest/",
					{
					  "email": this.formMail["mailDest"],
					  "firstName": this.formMail["firstname"],
					  "lastName": this.formMail["lastname"]
					}).then((res)=>{
						//if(res.=="USER_ALREADY_EXIST")
						console.log(res.data)
						console.log(res.statusText)
					}).catch((err)=>{
						console.log("need to sign up or to create an account")
						this.modalLoginVisible = true
					})
				}
			})
		},
		sendRequestRev(formMail) {
			if(!this.loggedIn) {
				this.createGuestAccount(formMail)
			}
			if(this.loggedIn) {
				this.confirmationOfSending = false;
				this.$refs[formMail].validate(valid => {
					if (valid) {
						this.requestInfos["title"] = this.formPost["title"];
						this.requestInfos["abstract"] = this.formPost["abstract"];
						this.requestInfos["rev_id"] = this.rowInfos["id"];
						this.requestInfos["rev_name"] = this.rowInfos["name"];
						this.requestInfos["deadline"] = this.formMail["deadline"];
						this.requestInfos["object"] = this.formMail["object"];
						this.requestInfos["remind"] = this.formMail["relaunch"];
						if(this.formMail["journal"]!=='None'){
							this.requestInfos["content"] =
								"<p class='h2'>Invitation to review in <i>" +
								this.formMail["journal"] +
								"</i></p>" +
								this.formMail["message"];
						}else{
							this.requestInfos["content"] = this.formMail["message"];
						}
						this.requestInfos["pub_mail"] = this.formMail["mailDest"];
						this.requestInfos["pub_journal"] = this.formMail["journal"]!=='None'?this.formMail["journal"]:null;
						this.requestInfos["pub_name"] = this.formMail["firstname"] + " " + this.formMail["lastname"];
						console.log(this.requestInfos);
						new Promise((resolve, reject) => {
							axios.get(
									"https://service.publifactory.co/api/get_mail_id?id=" +
										this.requestInfos.rev_id
								)
								.then(async res => {
									if (res) {
										this.requestInfos["rev_mail"] = "";
										/*this.requestInfos["rev_mail"] =
											res["data"][0]["_source"]["mail"];*/
									} else {
										this.requestInfos["rev_mail"] = "";
									}
									this.loggedIn
										? this.showPromptUserConnected()
										: this.showPromptUserDisconnected();
								});
						});
					}
				});
			}
		}
	}
};
</script>
<style>
.flex_items > .el-form-item__content {
  display: flex;
  justify-content: left;
  align-items: center;
}
</style>
