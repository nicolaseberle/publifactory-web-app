<template >
  <div>
      <div class='paginated-list-item publication-list-item'>
        <div v-for="article in author.article" class="container article-container">
              <div class='publication-list-item-details'>
                <div class='publication-list-item-title-publication margin-bottom-sm'>
                  <a class='publication-list-item-title very-dark-gray-link' style="font-size:18px!important; cursor:text; line-height:20px;">
                    {{ article.title }}
                  </a>
                </div>
                <div>
                  <div class='publication-list-item-journal-copy'>
                    <div v-if='article.fields && article.fields != "-1"' style="display:flex; justify-content:start; margin:10px 0;">
                      <el-tooltip class="item" effect="light" placement="top" v-bind:key="field" v-for="field in article.fields">
                        <div slot="content">
                          <ul style="list-style-type:none; padding-left:0;">
                            <li v-for="cat in article.sub_cat" v-if="assoc_cat[field].map(function(x){ return x.toLowerCase()}).includes(cat.toLowerCase())">
                              {{ cat[0].toUpperCase() + cat.replace(/_/gi, ' ').slice(1) }}
                            </li>
                          </ul>
                        </div>
                        <el-tag size="small" style="margin-bottom:5px">
                          {{ field[0].toUpperCase() + field.replace(/_/gi, ' ').slice(1) }}
                        </el-tag>
                      </el-tooltip>
                    </div>
                    <p class='publication-list-item-journal-published-copy' style="display:inline-block; margin-bottom:5px;">
                    Authors: <a v-for="(auth, index) in author.list_auth" style="display:inline; cursor:text;">
                        <strong v-if="author.pos == index" style="display:inline">{{ auth.name }}<span v-if="index < author.list_auth.length -1">, </span></strong>
                        <span v-else style="display:inline">{{ auth.name }}<span v-if="index < author.list_auth.length -1">, </span></span>
                      </a>
                    </p>
                    <p class='publication-list-item-journal-published-copy' style="display:block; margin-bottom:5px;" v-if='article.journal'>
                    Published: <a class='very-dark-gray-link' style="cursor:text;">{{ article.year }}</a>
                    , IN: <a class='very-dark-gray-link' style="cursor:text;">{{ article.journal }}</a>
                    </p>
                  </div>
                  <div v-if='article.doi'>
                    <p class='publication-list-item-journal-published-copy' style="display:block; margin-bottom:5px;">
                      DOI: <a class='very-dark-gray-link' target="new" :href="article.doi">{{ article.doi }}</a>
                    </p>
                  </div>
                  <div v-else >
                    <p class='publication-list-item-journal-published-copy' style="display:block; margin-bottom:5px;">
                      DOI: <a class='very-dark-gray-link'> Unknown</a>
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
      <div class='pertinence'>
        <p>Pertinence:
          <span v-if="typeof list.list_failed[index] != 'undefined'" style="color:#F56C6C">No</span>
          <span v-else style="color:#67C23A">Yes</span>
        </p>
      </div>
      <div class='publication-list-item-citations'>
        <el-popover
          ref="popcheck"
          placement="top"
          v-model="visibleB">
          <p>Are you sure you want to validate this author?</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visibleB = false">Cancel</el-button>
            <el-button type="primary" size="mini" v-on:click="$emit('validate')">Confirm</el-button>
          </div>
        </el-popover>
        <el-tooltip class="item" effect="dark" content="The author does not match" placement="top">
          <el-button
            type="success"
            size="mini"
            plain
            icon="el-icon-check"
            circle
            v-popover:popcheck>
          </el-button>
        </el-tooltip>

        <el-popover
          ref="popdel"
          placement="top"
          v-model="visible">
          <p>Are you sure you want to unmatch this author?</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible = false">Cancel</el-button>
            <el-button type="primary" size="mini" v-on:click="$emit('close')">Confirm</el-button>
          </div>
        </el-popover>
        <el-tooltip class="item" effect="dark" content="The author does not match" placement="top">
          <el-button
            type="info"
            size="mini"
            plain
            icon="el-icon-close"
            circle
            v-popover:popdel>
          </el-button>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["author", "index", "list"],
  data () {
    return {
      visible: false,
      visibleB: false
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
.article-container {
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
