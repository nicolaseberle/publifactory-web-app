<template>
  <div>
    <div class="components-container-article">
      <el-row
        type="flex"
        class="row-bg"
        justify="space-between"
        style="margin-bottom:20px;background-color:white"
        :gutter="40"
      >
        <el-col :span="10">
          <el-button-group>
            <el-button
              v-if="valueTypeEditor==1"
              type="primary"
              round
              size="medium"
              @click="changeEditor('LightEditor')"
            >Light Editor</el-button>
            <el-button
              v-if="valueTypeEditor!=1"
              type
              round
              size="medium"
              @click="changeEditor('LightEditor')"
            >Light Editor</el-button>
            <!--<el-button v-if="valueTypeEditor==2" type="primary" round @click="changeEditor('MarkdownEditor')">Markdown</el-button>
            <el-button v-if="valueTypeEditor!=2" type="" round @click="changeEditor('MarkdownEditor')">Markdown</el-button>-->
            <el-button
              v-if="valueTypeEditor==3"
              type="primary"
              round
              size="medium"
              @click="changeEditor('LatexEditor')"
            >Latex</el-button>
            <el-button
              v-if="valueTypeEditor!=3"
              type
              round
              size="medium"
              @click="changeEditor('LatexEditor')"
            >Latex</el-button>
          </el-button-group>
          <el-dropdown
            trigger="click"
            class="international"
            size="medium"
            @command="actionHandleCommand"
          >
            <div>
              <el-button class="el-button-action" size="medium" round>
                Version
                <i class="el-icon-arrow-down" style="margin-left:10px" />
              </el-button>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="item in articleInfo.version"
                :command="item"
                v-bind:key="item.name"
              >{{item.name}} - {{item.date}}</el-dropdown-item>
              <el-dropdown-item command="new">
                <i class="el-icon-plus">
                  <span style="font-family: 'DNLTPro-medium'">Create version</span>
                </i>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
        <el-col :span="4">
          <el-button
            class="el-button-action"
            size="medium"
            @click="importDialogVisible=true"
            round
          >Import data</el-button>
        </el-col>
        <el-col :span="6">
          <el-button-group>
            <el-button
              v-if="this.articleInfo.status === 'submit' && commentStateVector.nbSolved !== 0"
              alt="Number of comments"
              type="info"
              size="medium"
              @click="showCOmmentReviewPanel"
              round
            >
              <svg-icon icon-class="black-bubble-speech" />
              {{commentStateVector.nbComment}}
            </el-button>
            <el-button
              v-if="this.articleInfo.status === 'submit' && commentStateVector.nbSolved == 0"
              alt="Number of resolved reviews"
              type="success"
              size="medium"
              icon="el-icon-success"
              @click="showCOmmentReviewPanel"
              round
            >{{commentStateVector.nbResolved}}</el-button>
            <el-button
              v-if="this.articleInfo.status === 'submit' && commentStateVector.nbWarning !== 0"
              alt="Number of minor reviews"
              type="warning"
              size="medium"
              icon="el-icon-warning"
              @click="showCOmmentReviewPanel"
              round
            >{{commentStateVector.nbWarning}}</el-button>
            <el-button
              v-if="this.articleInfo.status === 'submit' && commentStateVector.nbWarning == 0"
              alt="Number of minor reviews"
              type
              size="medium"
              icon="el-icon-warning"
              @click="showCOmmentReviewPanel"
              round
            >{{commentStateVector.nbWarning}}</el-button>

            <el-button
              v-if="this.articleInfo.status === 'submit' && commentStateVector.nbDanger !== 0"
              alt="Number of major reviews"
              type="danger"
              size="medium"
              icon="el-icon-remove"
              @click="showCOmmentReviewPanel"
              round
            >{{commentStateVector.nbDanger}}</el-button>
            <el-button
              v-if="this.articleInfo.status === 'submit' && commentStateVector.nbDanger == 0"
              alt="Number of major reviews"
              type
              size="medium"
              icon="el-icon-remove"
              @click="showCOmmentReviewPanel"
              round
            >{{commentStateVector.nbDanger}}</el-button>
          </el-button-group>
        </el-col>
        <el-col :span="10">
          <div style="text-align:right">
            <el-button-group>
              <!--<el-button v-if="(valueTypeEditor==2 || valueTypeEditor==3) && flagHidePDF==0" type="" @click="handleHidePDF()"  round>Hide PDF</el-button>
              <el-button v-if="(valueTypeEditor==2 || valueTypeEditor==3) && flagHidePDF==1" type="" @click="handleHidePDF()"  round>Hide PDF</el-button>-->
              <!--<el-button type="" v-on:click="handleDownload()" round icon='el-icon-download' ></el-button>-->
              <el-button type v-on:click="handleDownload()" size="medium" round>Download</el-button>
              <el-button
                :disabled="!isLead"
                v-if="this.articleInfo.status === 'draft' || this.articleInfo.status === 'preprint'"
                type
                @click="visibleSubmitDialog=true"
                size="medium"
                round
              >Submit your article</el-button>
              <el-button
                v-if="  this.articleInfo.status === 'submit' "
                type
                @click="changeStatus()"
                round
                size="medium"
                disabled
              >Submitted</el-button>
              <el-button
                v-if="  this.articleInfo.status === 'review' "
                type
                @click="changeStatus()"
                round
                size="medium"
              >Validate the article</el-button>
            </el-button-group>
          </div>
        </el-col>
        <!--<el-col v-if="postForm.status == 'Reviewing'" :span="4" :offset="18"><el-button type="warning">Edit this version</el-button></el-col>-->
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-alert
            v-if="  this.articleInfo.status === 'submit' "
            title="Article Submitted"
            type="success"
            description="The article is being processed by the publisher. A notification will be sent to you to keep you informed of the evolution of the peer-reviewing."
            show-icon
          ></el-alert>
        </el-col>
      </el-row>
    </div>
    <div>
      <component
        v-bind:is="currentEditor"
        :socket="socket"
        :wssdb="wssdb"
        :hidePDF="flagHidePDF"
        v-on:changecomment="onChangeComment"
      />
    </div>
    <submit-dialog
      :status="articleInfo.status"
      v-on:onSubmit="onSubmit"
      v-if="visibleSubmitDialog"
      :show-dialog.sync="visibleSubmitDialog"
    ></submit-dialog>

    <el-dialog title="Insert data" :visible.sync="importDialogVisible" width="80%" top="0">
      <ImportData :socket="socket" ref="importDataDialog"></ImportData>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import lightEditorComponent from './LightEditor';
import markdownEditorComponent from './MarkdownEditorComponent';
import latexEditorComponent from './LatexEditorComponent';
import ImportData from '../../../components/ImportData/index';
import axios from 'axios';
import wsShareDBClient from '../../../utils/js/ws-sharedb-client/';
import io from 'socket.io-client';
import submitDialog from './components/submit-dialog';
const printJS = require('print-js');

export default {
  name: 'ArticleDetail',
  components: {
    ImportData,
    lightEditorComponent,
    markdownEditorComponent,
    latexEditorComponent,
    submitDialog
  },
  data() {
    return {
      // postForm: Object.assign({}, defaultForm),
      currentEditor: 'lightEditorComponent',
      valueTypeEditor: 1,
      flagHidePDF: 1,
      editorType: false,
      id: '',
      importDialogVisible: false,
      articleInfo: {
        status: ''
      },
      commentStateVector: {
        nbComment: 0,
        nbWarning: 0,
        nbDanger: 0,
        nbSolved: 0
      },
      socket: '',
      wssdb: '',
      visibleSubmitDialog: false,
      isLead: false
    };
  },

  computed: {
    ...mapGetters(['accessToken', 'userId'])
  },
  created() {
    this.id = this.$route.params && this.$route.params.id;
    this.currentEditor = 'lightEditorComponent';
    this.getStatus().then(() => {
      console.log('####', this.articleInfo.authors);
      this.isLead = this.articleInfo.authors.reduce((acc, author) => {
        if (
          this.userId === author.author._id &&
          author.rank === 1 &&
          author.role === 'Lead'
        )
          return true;
        return acc;
      }, false);
    });

    const socketOptions = {
      transports: ['polling'],
      reconnect: true,
      rejectUnauthorized: false,
      query: {
        id_article: this.id,
        id_user: this.userId
      }
    };
    this.socket = io('/', socketOptions);

    this.wssdb = new wsShareDBClient(this.userId, this.id);
  },
  beforeDestroy() {
    this.wssdb.close();
    this.socket.close();
  },
  async mounted() {
    /**
     * Socket instructions from API
     */

    this.socket.on('MODIFY_STATUS', () => {
      // this.getStatus();
      // this.$router.push('/');
    });

    this.socket.on('MODIFY_VERSION', data => {
      this.articleInfo.title = data.title;
      this.articleInfo.abstract = data.abstract;
      this.articleInfo.arr_content = data.arr_content;
    });

    this.socket.on('ADD_VERSION', data => {
      this.articleInfo.version.push(data);
      this.$forceUpdate();
    });
  },
  methods: {
    setVersion(item) {
      this.socket.emit('UPDATE_VERSION', item);
    },
    async createVersion() {
      const promptName = prompt('Which name would you like for this version?');
      try {
        const body = {
          name: promptName,
          title: this.articleInfo.title,
          abstract: this.articleInfo.abstract,
          arr_content: this.articleInfo.arr_content,
          date: new Date()
        };
        await axios.post(`/api/articles/${this.id}/version`, body, {
          headers: { Authorization: 'Bearer ' + this.accessToken }
        });
        this.socket.emit('NEW_VERSION', body);
        this.articleInfo.version.push(body);
        this.$forceUpdate();
      } catch (e) {
        this.$message({
          message: 'Something went wrong when creating your version.',
          type: 'Error',
          center: true,
          duration: 2000
        });
      }
    },
    showCOmmentReviewPanel() {
      $('aside.content-comments-reviews').css('display', 'block');
    },
    async actionHandleCommand(action) {
      await this.getStatus();
      if (action === 'new') {
        await this.createVersion();
      } else {
        this.setVersion(action);
      }
    },
    async handleDownload() {
      // this.socket.emit('EXEC_PDF', {});
      /*
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(window.location.href, {waitUntil: 'networkidle2'});
      // page.pdf() is currently supported only in headless mode.
      // @see https://bugs.chromium.org/p/chromium/issues/detail?id=753118
      await page.pdf({
        path: 'hn.pdf',
        format: 'letter'
      });

      await browser.close();*/
      // Get HTML to print from element
      /*const prtHtml = document.getElementById('article-page').innerHTML;

        // Get all stylesheets HTML
        let stylesHtml = '';
        for (const node of [...document.querySelectorAll('link[rel="stylesheet"], style')]) {
          stylesHtml += node.outerHTML;
        }

        console.log(stylesHtml)

        // Open the print window
        const WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');

        WinPrint.document.write(`<!DOCTYPE html>
        <html>
          <head>
            ${stylesHtml}
          </head>
          <body>
            ${prtHtml}
          </body>
        </html>`);

        WinPrint.document.close();
        WinPrint.focus();
        WinPrint.print();
        WinPrint.close();
        */
      /*
		    const filename  = 'ThisIsYourPDFFilename.pdf';

  		html2canvas(document.querySelector('#article-page')).then(canvas => {
  			let pdf = new jsPDF('p', 'mm', 'a4');
  			pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 298);
  			pdf.save(filename);
  		});*/

      printJS({
        printable: 'article-page',
        header: '',
        type: 'html',
        css: '/dist/css/test.css',
        targetStyles: '*',
        documentTitle: 'New doc',
        scanStyles: false
      });
    },
    handleHidePDF() {
      if (this.flagHidePDF == 1) {
        this.flagHidePDF = 0;
        console.log(this.flagHidePDF);
      } else {
        this.flagHidePDF = 1;
        console.log(this.flagHidePDF);
      }
    },
    changeEditor(newValue) {
      if (newValue == 'LightEditor') {
        this.currentEditor = 'lightEditorComponent';
        this.valueTypeEditor = 1;
      } else {
        if (newValue == 'MarkdownEditor') {
          this.currentEditor = 'markdownEditorComponent';
          this.valueTypeEditor = 2;
        } else {
          this.currentEditor = 'latexEditorComponent';
          this.valueTypeEditor = 3;
        }
      }
    },
    async onSubmit(form) {
      if (form.journal === '') return;
      // this.socket.emit('UPDATE_STATUS', {});
      if (form.journal === 'preprint') {
        const response = await axios.post(
          `/api/journals/preprint/${this.id}`,
          {},
          { headers: { Authorization: `Bearer ${this.accessToken}` } }
        );
        this.articleInfo = response.data;
      } else {
        const response = await axios.post(
          `/api/journals/submit/${form.journal}/${this.id}`,
          {},
          { headers: { Authorization: `Bearer ${this.accessToken}` } }
        );
        this.articleInfo = response.data;
      }
      // this.$router.push(this.$route.query.redirect || '/');
      this.sendNotificationByMail();
    },
    async getStatus() {
      const response = await axios.get('/api/articles/' + this.id, {
        headers: { Authorization: 'Bearer ' + this.accessToken }
      });
      this.articleInfo = response.data;
    },

    onChangeComment(commentStateVector) {
      this.commentStateVector = commentStateVector;
    },
    sendNotificationByMail() {
      //send a notification to authors
      //send notification to editor/publisher/associate editor
    }
  }
};
</script>
