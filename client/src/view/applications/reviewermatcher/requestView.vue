<template>
	<div>
		<el-form
			label-width="200px"
			:model="formMail"
			:rules="mailRules"
			ref="formMail"
			style="text-align :left; padding-bottom:20px;"
		>
			<el-form-item label="Your email" prop="mailDest">
				<el-input v-model="formMail.mailDest"></el-input>
			</el-form-item>
			<el-form-item label="Your name" prop="name">
				<el-input v-model="formMail.name"></el-input>
			</el-form-item>
			<el-form-item label="Journal requesting the reviewing" prop="journal">
				<el-input v-model="formMail.journal"></el-input>
			</el-form-item>
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
						<!--<input  class="ql-input" name="title" type="text"></input>-->
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
			<!--
    <el-form-item label="Relaunch" prop="relaunch">
      <el-select v-model="formMail.relaunch">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
  -->
			<!--
    <el-form-item label="Option">
      <el-checkbox v-model="receiveCopy">I would like to receive a copy of the present email</el-checkbox>
    </el-form-item>
  -->
			<el-form-item label="CGU" prop="type">
				<el-checkbox-group v-model="formMail.type">
					<el-checkbox label="I accept the CGU" name="type"></el-checkbox>
				</el-checkbox-group>
				<!--<el-checkbox v-model="formMail.cgu" name='type'>-->
				<!--  I accept the-->
				<!--<el-tooltip class="item" effect="dark" content="Lorem ipsum dolor sit amet" placement="top">-->
				<!--<a><router-link :to="'/cgu_publifactory_v1'">CGU</router-link></a>-->
				<!--</el-tooltip>-->
				<!--</el-checkbox>-->
			</el-form-item>
			<el-form-item>
				<el-button v-on:click="$emit('close')">Cancel</el-button>
				<el-button type="primary" @click="sendRequestRev('formMail')"
					>Send</el-button
				>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
import axios from "axios";
import "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import freePlanStatusBar from "./components/free-plan-status-bar";
import { mapGetters } from "vuex";

var Quill = require("quill");

export default {
	props: ["formPost", "formMail", "rowInfos"],
	data() {
		return {
			editor: {},
			idEditor: this.setIdEditor(),
			idToolBar: this.setIdToolBar(),
			confirmationOfSending: false,
			requestInfos: {},
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
						message: "You need to enter your email",
						trigger: "blur"
					}
				],
				journal: [
					{
						required: true,
						message: "You need to enter your journal",
						trigger: "blur"
					}
				],
				name: [
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
				// ,issn: [
				//   {required: true, message: 'You need to enter the issn of your journal', trigger: 'blur'}
				// ]
			},
			receiveCopy: false
		};
	},
	computed: {
		...mapGetters(["loggedIn"])
	},
	mounted() {
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
		// console.log("===>", document, document.cookie);
		console.log(this.$cookie);
		console.log(this.$cookie.get("maxInvitation"));
	},
	methods: {
		async addRequest(dataJson) {
			const response = await axios({
				method: "post",
				url: "/api/requests",
				validateStatus: undefined,
				headers: {
					"Content-Type": "application/json"
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
			this.$confirm("Are you sure to invite this reviewer ?", "Confirmation", {
				confirmButtonText: "OK",
				cancelButtonText: "Cancel",
				type: "success"
			})
				.then(this.handlePromptSuccess)
				.catch(this.handlePromptFailure);
		},
		showPromptUserDisconnected() {
			const createElement = this.$createElement;
			const maxInvitation = parseInt(this.$cookie.get("maxInvitation"), 10);
			console.log(
				maxInvitation,
				typeof maxInvitation,
				this.$cookie.get("maxInvitation")
			);
			this.$msgbox({
				title: "Are you sure to invite this reviewer ?",
				message: createElement(freePlanStatusBar, {
					props: { maxInvitation }
				}),
				confirmButtonText: "OK",
				cancelButtonText: "Cancel",
				showCancelButton: true
			})
				.then(this.handlePromptSuccess)
				.catch(this.handlePromptFailure);
		},
		handlePromptSuccess() {
			this.$emit("close");
			let dataJson = this.updateDataJson();
			this.confirmationOfSending = true;
			this.addRequest(dataJson);
			this.$message({
				type: "success",
				message: "Invitation sent"
			});
		},
		handlePromptFailure() {
			this.confirmationOfSending = false;
			this.$emit("close");
			this.$message({
				type: "info",
				message: "Invitation canceled"
			});
		},
		sendRequestRev(formMail) {
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
					this.requestInfos["content"] =
						"<p class='h2'>Invitation to review in <i>" +
						this.formMail["journal"] +
						"</i></p>" +
						this.formMail["message"];
					this.requestInfos["pub_mail"] = this.formMail["mailDest"];
					this.requestInfos["pub_journal"] = this.formMail["journal"];
					this.requestInfos["pub_name"] = this.formMail["name"];
					console.log(this.requestInfos);
					new Promise((resolve, reject) => {
						axios
							.get(
								"https://service.publifactory.co/api/get_mail_id?id=" +
									this.requestInfos.rev_id
							)
							.then(async res => {
								if (res) {
									this.requestInfos["rev_mail"] =
										res["data"][0]["_source"]["mail"];
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
};
</script>
