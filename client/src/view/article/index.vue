<template>
    <component :is="currentRole"/>
</template>

<script>
  import { mapGetters } from 'vuex'
  import editComponent from './edit'
  import readComponent from './read'
  import axios from 'axios'


  const debug = require('debug')('frontend')

const defaultForm = {
  status: 'draft',
  title: '',
  abstract: '',
  content: '',
  arr_content: [{
                  name:"titre_1",
                  title:"Titre 1",
                  title_placeholder:"Titre 1",
                  content:"Type the text",
                  display:true
                }],
  content_short: '',
  source_uri: '',
  image_uri: '',
  authors: '',
  display_time: undefined,
  id: undefined,
  platforms: ['a-platform'],
  comment_disabled: false,
  importance: 0
}

export default {
  name: 'Article',
  components: { editComponent, readComponent },
  data() {
    return {
      currentRole: 'editComponent',
      postForm: Object.assign({}, defaultForm),
    }
  },
  computed: {
    ...mapGetters([
      'userId',
      'accessToken'
    ])
  },
  created() {
      this.id = this.$route.params && this.$route.params.id
      debug("creation de la page")
  },
  methods: {
    fetchData(id) {
      axios.get('/api/articles/' + id , {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      }).then(response => {
        this.postForm = response.data
        // we check if article author is the current user to give him the righ to edit the document
        /*this.postForm.authors.forEach((item) => {
          if (item.author._id == this.userId) {
            this.currentRole = 'editComponent'
          }
        });*/

      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
