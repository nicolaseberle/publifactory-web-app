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
          <p><a href="/services/reviewermatcher">Reviewer Matcher</a></p>
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

footer.el-footer {
  background-color: #2F4155;
  color: white;
  height: auto!important;
  padding-top: 20px!important;
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
  font-size: 1rem;
  border-bottom: 1px solid white;
  padding-bottom: 5px;
  margin-bottom: 30px;
}

.art p {
  font-size: 0.8rem;
  margin: 10px 0;
}

.art a:hover {
  text-decoration: underline;
  color:white;
}

</style>
