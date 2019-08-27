<template>
    <div>
    <el-form ref="queryForm" :model="queryForm" :rules="queryRules">
        <el-form-item prop="Query">
            <el-input id="queryInput" name="queryInput" v-model="queryForm.query" placeholder="Query (ex: SELECT * FROM column)"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button @click="query()" type="primary" round>Query</el-button>
        </el-form-item>
    </el-form>
    </div>
</template>

<script>
    import axios from 'axios';
    import {mapGetters} from "vuex";
    import CodeMirror from 'codemirror'
    import 'codemirror/mode/sql/sql.js'
    import '../../styles/one-dark.css'
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
        mounted () {
            this.editor = CodeMirror.fromTextArea(document.getElementById("queryInput"), {
                value: '',
                lineNumbers: false,
                styleActiveLine: true,
                matchBrackets: true,
                indentUnit: 4,
                smartIndentationFix: true,
                theme: 'one-dark',
                mode: "text/x-mysql",
                lineWrapping: true
            });
            this.editor.on('change', (cm) => {
               console.log(cm.getDoc().getValue())
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
                console.log(response.data);
            }
        }
    }
</script>

<style scoped>

</style>