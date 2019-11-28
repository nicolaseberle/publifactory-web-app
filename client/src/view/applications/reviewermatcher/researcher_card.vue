<template >
  <div>
      <div class='paginated-list-item publication-list-item'>
      <article v-for="article in author.article" class="container">
            <div class='publication-list-item-details'>
              <div class='publication-list-item-title-publication margin-bottom-sm'>
                <a :href="article.doi" class='publication-list-item-title very-dark-gray-link'>
                  {{ article.title }}
                </a>
              </div>
              <div>
                <div class='publication-list-item-journal-copy'>
                  <p class='publication-list-item-journal-published-copy'>
                    <el-tooltip class="item" effect="dark" :content="article.abstract" placement="right">
                      <a class='very-dark-gray-link'>View abstract</a>
                    </el-tooltip>
                  </p>
                  <!-- <p class='publication-list-item-journal-published-copy'>
                  Role:  <a class='very-dark-gray-link'>{{ article.co_auth }}</a>
                  </p> -->
                  <p class='publication-list-item-journal-published-copy' style="display:inline">
                  Authors: <a v-for="(auth, index) in author.list_auth" style="display:inline">
                      <strong v-if="author.pos == index" style="display:inline">{{ auth.name }}<span v-if="index < author.list_auth.length -1">, </span></strong>
                      <span v-else style="display:inline">{{ auth.name }}<span v-if="index < author.list_auth.length -1">, </span></span>
                    </a>
                  </p>
                  <div v-if='article.fields'>
                    <p class='publication-list-item-journal-published-copy'>
                      Field: <a class='very-dark-gray-link' v-for="field, index in article.fields">
                      {{ field }}<span v-if="index != article.fields.length - 1">, </span>
                      </a>
                      <span v-if='article.sub_cat'>
                        (<a class='very-dark-gray-link' v-for="cat, index in article.sub_cat">
                          {{ cat }}<span v-if="index != article.sub_cat.length - 1">, </span>
                        </a>)
                      </span>
                    </p>
                  </div>
                  <p class='publication-list-item-journal-published-copy'>
                  Published: <a class='very-dark-gray-link'>{{ article.year }}</a>
                  , IN: <a class='very-dark-gray-link' v-if='article.journal'>{{ article.journal }}</a><a class='very-dark-gray-link' v-else>Unknown</a>
                  </p>
                  <div v-if='article.doi'>
                    <p class='publication-list-item-journal-published-copy'>
                      DOI: <a class='very-dark-gray-link' target="new" :href="article.doi">{{ article.doi }}</a>
                    </p>
                  </div>
                  <div v-else >
                    <p class='publication-list-item-journal-published-copy'>
                    DOI:<a class='very-dark-gray-link'> Unknown</a>
                    </p>
                  </div>
                  <div v-if='article.inCitations'>
                    <p class='publication-list-item-journal-published-copy'>
                      Citations: <a class='very-dark-gray-link'>{{ article.inCitations }}+</a>
                    </p>
                  </div>
                  <div v-else >
                    <p class='publication-list-item-journal-published-copy'>
                    Citations:<a class='very-dark-gray-link'> Unknown</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
      </article>
    </div>
  </div>
</template>
<script>
export default {
  props: ["author", "index", "list"],
  data () {
    return {

    }
  },
  created() {

  },
  mounted () {

  },
  methods: {

  }
}
</script>
<style>
ul {
  font-family: 'DNLTPro-regular';
}
.container {
   /* display: grid;
   grid-template-columns: 4fr 10px 1fr;
   grid-template-areas: "title   .      citations"; */
}
.paginated-list .paginated-list-item {
    padding: 20px 10px;
    border-bottom: 1px solid #ddd;
}
.publication-list-item {
    /* display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center; */
    font-family: 'DNLTPro-regular';
}
.margin-bottom-sm {
    margin-bottom: 10px!important;
}
.publication-list-item a {
    color: #111;
}
a.very-dark-gray-link {
    color: #111;
}
.publication-list-item .publication-list-item-date, .publication-list-item .publication-list-item-journal {
    /*grid-area: journal;*/
    font-size: 12px!important;
    font-weight: 200;
}
.publication-list-item .publication-list-item-cached-journal {
    display: grid;
    grid-column-gap: 2px;
    grid-template-columns: 1fr 21fr;
}
.publication-list-item .publication-list-item-cached-journal .publication-list-item-journal-copy {
    line-height: 9px;
    font-size: 12px;
    font-weight: 300;
}
.publication-list-item .publication-list-item-journal-published-copy {
    margin-bottom: 0;
    color: #999;
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
    font: inherit;
    vertical-align: top;
    -webkit-font-smoothing: antialiased;
}
.publication-list-item-journal-published-copy p {
    margin-bottom: 20px;
    line-height: 100%;
    max-width: 720px;
}
.publication-list-item a {
    color: #111;
}
.publication-list-item-details {
    grid-area: title;
    -webkit-box-flex: 1;
    -ms-flex-positive: 1;
    flex-grow: 1;
    overflow: hidden;
    padding-top: 5px;
    padding-right: 10px;
    font-size: 12px;
    line-height: 14px;

}
.publication-list-item-citations {
    /* grid-area: citations;
    -webkit-box-flex: 2;
    -ms-flex-positive: 2;
    flex-grow: 2;
    overflow: hidden;
    padding-right: 10px;
    font-size: 24px; */
    text-align: right;
    margin-top: -45px;
}
article {
  margin-bottom: 15px!important;
  padding-left: 30px;
  border-left: 1px solid lightgrey;
  width: 100%;
}
.publication-list-item-title{
  color: #999;
  font-size: 16px!important;
}
.publication-list-item .publication-list-item-date, .publication-list-item .publication-list-item-journal {
    /*grid-area: journal;*/
    font-size: 12px!important;
    font-weight: 200;
}

.el-tooltip__popper.is-dark{
  max-width: 400px;
}

</style>
