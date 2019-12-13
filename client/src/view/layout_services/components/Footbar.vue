<template>
  <div class="footbar" id="footbar" name="footbar">
    <el-footer>
      <div class="container-footer">
        <div class="art">
          <strong>Publifactory</strong>
          <p><b>PubliFactory</b> is a software company developing solutions for publishers.</p>
        </div>
        <div class="art">
          <strong>Products</strong>
          <p><a href="/">Reviewer Matcher</a></p>
          <p><a href="https://publifactory.co">Editorial Manager</a></p>
        </div>
        <div class="art">
          <strong>Usefull links</strong>
          <p><a href="/cgu_publifactory_v1">Terms of Use</a></p>
          <p><a href="/help_publifactory_v1">Help</a></p>
        </div>
        <div class="art">
          <strong>Contacts</strong>
          <p>Publifactory SAS,</p>
          <p> 181 rue de Charenton, 75012 Paris</p>
          <!--<p>contact@publifactory.co</p>-->
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
