<template>
	<div class="app-container">
		<content-module name="articles">
			<div class="dashboard-tab">
				<div style="margin-top:20px;z-index:1000;">
					<el-tabs v-model="activeName">
						<el-tab-pane label="All" name="first">
								<!-- desiredstatus="All" -->
							<dataTableStatus
								:articles="articles"
							/>
						</el-tab-pane>
						<!-- <el-tab-pane label="Submited" name="second"> -->
							<!-- <span slot="label">
								Submited
								<el-badge
									v-if="notifications.submited > 0"
									:value="notifications.submited"
									lass="mark"
								/>
							</span> -->
								<!-- desiredstatus="submit" -->
							<!-- <dataTableStatus
								:articles="articles"
								v-on:assignReviewer="assignReviewer"
								v-on:assignAE="assignAE"
							>
								<template v-slot:actionButton>
									<div>toto</div>
								</template>
							</dataTableStatus> -->
						<!-- </el-tab-pane> -->
						<!-- <el-tab-pane label="in Reviewing" name="third"> -->
							<!-- <span slot="label">
								Review
								<el-badge
									v-if="notifications.review > 0"
									:value="notifications.review"
									lass="mark"
								/>
							</span>
							<dataTableStatus
								desiredstatus="Reviewing"
								v-on:assignReviewer="assignReviewer"
								v-on:assignAE="assignAE"
							/> -->
						<!-- </el-tab-pane> -->
						<!-- <el-tab-pane label="Published" name="fourth"> -->
							<!-- <span slot="label">
								Published
								<el-badge
									v-if="notifications.published > 0"
									:value="notifications.published"
									lass="mark"
								/>
							</span>
							<dataTableStatus
								desiredstatus="Published"
								v-on:assignReviewer="assignReviewer"
								v-on:assignAE="assignAE"
							/> -->
						<!-- </el-tab-pane> -->
					</el-tabs>
				</div>
			</div>
			<el-dialog
				title="Add Reviewer"
				:visible.sync="flagAddReviewer"
				width="70%"
			>
				<addReviewer
					v-if="flagAddReviewer"
					:idarticle="selectedArticleId"
					v-on:close="flagAddReviewer = false"
				/>
			</el-dialog>
			<el-dialog
				title="Add Associate Editor"
				:visible.sync="flagAddAE"
				width="70%"
			>
				<addAE
					v-if="flagAddAE"
					:idarticle="selectedArticleId"
					v-on:close="flagAddAE = false"
				/>
			</el-dialog>
		</content-module>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import locales from '../../../locales/article';
import axios from 'axios';
import addReviewer from '../../../components/Reviewer';
import addAE from '../../../components/AE';
import dataTableStatus from './DataTableStatus';

const debug = require('debug')('frontend');
var uuidv4 = require('uuid/v4');

export default {
	locales,
	data() {
		return {
			flagVisibleAddReviewer: false,
			flagAddAE: false,
			activeName: 'first',
			options: {
				value: 'option 1',
				lable: 'option 1'
			},
			search: {},
			form: {
				title: ''
			},
			rules: {
				title: [
					{
						required: true,
						message: this.$t('article.rules.title'),
						trigger: 'blur'
					}
				],
				abstract: [
					{
						required: true,
						message: this.$t('article.rules.abstract'),
						trigger: 'blur'
					}
				]
			},
			notifications: { review: 0, submited: 0, published: 0 },
			articles: [
				{
					id: '',
					creationDate: '',
					title: '',
					address: '',
					status: '',
					authors: '',
					reviewers: ''
				}
			],
			flagAddReviewer: false,
			selectedArticleId: ''
		};
	},
	computed: {
		...mapGetters(['userId', 'accessToken'])
	},
	components: {
		dataTableStatus,
		addReviewer,
		addAE
	},
	methods: {
		async fetchArticles() {
			await axios
				.get('/api/articles/', {
					headers: { Authorization: `Bearer ${this.accessToken}` }
				})
				.then(list => {
					this.articles = list.data.articles.filter(d => d.status !== 'draft');
					this.articles.forEach(el => {
						if (el.status === 'submit') {
							this.notifications.submited++;
						}
						if (el.status === 'review') {
							this.notifications.review++;
						}
						if (el.status === 'publish') {
							this.notifications.published++;
						}
					});
				})
				.catch(err => {
					console.error(err);
				});
		},
		assignReviewer(selectedArticleId) {
			console.log('assign reviewer');
			this.flagAddReviewer = true;
			this.selectedArticleId = selectedArticleId;
		},
		assignAE(selectedArticleId) {
			this.flagAddAE = true;
			this.selectedArticleId = selectedArticleId;
		},
		async fetchArticlesInPreprint() {
      const response = await axios.get(
        '/api/journals/preprint/',
        {
          headers: { Authorization: `Bearer ${this.accessToken}` }
        },
        {
          params: {
            page: 1,
            count: 2
          }
        }
      );
        this.articles = response.data.content.map(article => article.reference);
    },
	},
	async mounted() {
		await this.fetchArticlesInPreprint()
		console.log('index=>', this.articles)
		// this.fetchArticles();
	}
};
</script>
<style>
.dashboard-tab {
	padding-top: 20px;
}

.tabs,
.el-tabs__nav {
	padding-top: 10px;
}
.el-table__header-wrapper {
	white-space: pre-line;
}
.el-tabs__item {
	width: 120px;
}
</style>
