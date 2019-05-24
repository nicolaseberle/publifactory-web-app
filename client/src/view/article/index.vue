<template>
    <component :is="currentRole"/>
</template>

<script>
import { mapGetters } from 'vuex'
import editComponent from './edit'
import readComponent from './read'
import axios from 'axios'

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
      currentRole: 'readComponent',
      postForm: Object.assign({}, defaultForm),
    }
  },
  computed: {
    ...mapGetters([
      'userId',
      'roles',
      'accessToken'
    ])
  },
  created() {
    if (1) {
      const id = this.$route.params && this.$route.params.id
      this.id = id
      console.log("creation de la page")

      this.fetchData(id)
      //console.log(this.postForm.authors)

      //}
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
  },
  methods: {
    fetchData(id) {
      console.log(this.accessToken)
      axios.get('/api/articles/' + id , {
        headers: {'Authorization': `Bearer ${this.accessToken}`}
      }).then(response => {
        this.postForm = response.data
        var self = this;
        // we check if article author is the current user to give him the righ to edit the document
        this.postForm.authors.forEach(function(item) {
          if (item.author._id == self.userId) {
            self.currentRole = 'editComponent'
          }
        });

      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
