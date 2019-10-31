<template>
  <div class="footbar" id="footbar" name="footbar">
    <el-footer>
      <div class="container-footer">
        <div class="art">
          <strong>Compagny</strong>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis consectetur massa, eu malesuada magna laoreet sit amet. Pellentesque sit amet dui orci. </p>
        </div>
        <div class="art">
          <strong>Products</strong>
          <p><a href="#">Reviewer Matcher</a></p>
          <p><a href="#">Summarizer</a></p>
          <p><a href="#">Preprint Search</a></p>
        </div>
        <div class="art">
          <strong>Usefull links</strong>
          <p><a href="#">Your account</a></p>
          <p><a href="#">Pricing</a></p>
          <p><a href="#">GCU</a></p>
          <p><a href="#">Help</a></p>
        </div>
        <div class="art">
          <strong>Contacts</strong>
          <p>Addr : 5 rue des fleurs, 75005 Paris</p>
          <p>Mail : publifactory@example.com</p>
          <p>Tel : 0102030405</p>
        </div>
      </div>
    </el-footer>
  </div>
</template>

<script>

export default {
  name: 'Footbar',
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style>

.el-footer {
  background-color: #2F4155;
  color: white;
  height: auto!important;
  padding-top: 25px!important;
  padding-bottom: 20px!important;
}

.container-footer {
  max-width: 1140px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}

.art {
  width: 23%;
}

.art strong {
  font-size: 1.2rem;
  border-bottom: 1px solid white;
  padding-bottom: 10px;
  margin-bottom: 30px;
}

.art p {
  margin: 10px 0;
}

.art a:hover {
  text-decoration: underline;
  color:white;
}

</style>
