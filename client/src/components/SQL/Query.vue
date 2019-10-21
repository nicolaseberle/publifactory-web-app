<template>
    <div>
    <el-form ref="queryForm" :model="queryForm" :rules="queryRules">
        <el-form-item prop="Query">
            <el-input style="text-align: left" id="queryInput" name="queryInput" v-model="queryForm.query" placeholder="Query (ex: SELECT * FROM column)"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button-group>
                <el-button @click="query()" type="primary" autofocus round>Query</el-button>
                <el-button @click="$emit('disconnect', 'SqlConnection')" type="primary" round>Disconnect</el-button>
            </el-button-group>
        </el-form-item>
    </el-form>
    </div>
</template>

<script>
    import axios from 'axios';
    import {mapGetters} from "vuex";
    import CodeMirror from 'codemirror'
    import 'codemirror/mode/sql/sql.js'
    import 'codemirror/mode/javascript/javascript'
    import 'codemirror/theme/base16-light.css'
    import 'codemirror/lib/codemirror.css'

    export default {
        name: "Query",
        props: [
            'sqlForm',
            'sqlRules'
        ],
        data () {
          return {
              queryForm: {
                  query: ''
              },
              queryRules: {
                  query: [{required: true}]
              },
              editor: {},
              content: ''
          }
        },
        created () {
            if (this.sqlForm.type === "mongodb")
                this.queryForm.query = `{
  "collection": "",
  "query": {

  }
}`;
        },
        mounted () {
            if (this.sqlForm.type === "mongodb")
                this.editor = CodeMirror.fromTextArea(document.getElementById("queryInput"), {
                    value: '',
                    styleActiveLine: true,
                    matchBrackets: true,
                    indentUnit: 4,
                    autoCloseBrackets: true,
                    theme: 'base16-light',
                    mode: "application/json",
                    lineWrapping: true,
                    lineNumbers: true
                });
            else
                this.editor = CodeMirror.fromTextArea(document.getElementById("queryInput"), {
                    value: '',
                    styleActiveLine: true,
                    matchBrackets: true,
                    indentUnit: 4,
                    theme: 'base16-light',
                    mode: "text/x-mysql",
                    lineNumbers: true,
                    lineWrapping: true
                });
            this.editor.on('change', (cm) => {
               this.queryForm.query = cm.getDoc().getValue();
            });
            this.editor.refresh();
        },
        computed: {
            ...mapGetters(['accessToken'])
        },
        methods: {
            async query () {
                const response = await axios.post('/api/data/sql/query', {
                    ...this.sqlForm,
                    ...this.queryForm
                }, {
                    headers: {'Authorization': `Bearer ${this.accessToken}`}
                });
                this.$emit('queryresult', response.data.result);
            }
        }
    }
</script>

<style lang="scss">
    .CodeMirror {
        border: 1px solid silver;
        margin-bottom: 1em;
    }
</style>