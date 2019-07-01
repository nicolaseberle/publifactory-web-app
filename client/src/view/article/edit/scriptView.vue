<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="6">

      </el-col>

<!--
        <no-ssr placeholder="Codemirror Loading...">
            <codemirror ref="myCm"
                        :value="code"
                        :options="cmOptions"
                        @ready="onCmReady"
                        @focus="onCmFocus"
                        @input="onCmCodeChange">
            </codemirror>
          </no-ssr>
-->

  </el-row>
  </div>
</template>

<script>
  // require component
  import { codemirror } from 'vue-codemirror'
  // require styles
  import 'codemirror/lib/codemirror.css'
  import 'codemirror/theme/base16-dark.css'
  import 'codemirror/theme/monokai.css'

  // require more codemirror resource...

export default {
  components: { codemirror },
  data () {
    return {
      code: '<ul><li>\nItem 1</li><li>\nItem 2</li><li>\nItem 3</li></ul>',
      cmOptions: {
        // codemirror options
        tabSize: 4,
        mode:  "htmlmixed",
        autoCloseTags: true,
        theme: 'monokai',//'base16-dark',
        lineNumbers: true,
        line: true
      }
    }
  },
  methods: {
    onCmReady(cm) {
      console.log('the editor is readied!', cm)
    },
    onCmFocus(cm) {
      console.log('the editor is focus!', cm)
    },
    onCmCodeChange(newCode) {
      console.log('this is new code', newCode)
      this.code = newCode
    }
  },
  computed: {
    codemirror() {
      return this.$refs.myCm.codemirror
    }
  },
  mounted() {
    console.log('this is current codemirror object', this.codemirror)
    this.codemirror.focus()
    // you can use this.codemirror to do something...
  }
}

</script>
