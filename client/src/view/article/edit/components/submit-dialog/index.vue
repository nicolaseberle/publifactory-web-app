<template>
  <el-dialog
    :visible.sync="show"
    v-on:update:visible="updateShowDialog"
    title="Submission process"
    width="50%"
    append-to-body
  >
    <el-alert title="You are about to submit your article" type="warning" show-icon></el-alert>
    <el-form :model="form" :rules="rule" ref="form" label-position="top">
      <el-row style="margin-top:20px; ">
        <el-form-item label="Have you uploaded your article to a preprint server?">
          <el-col :span="22" :offset="1">
            <el-col :span="10" :offset="1">
              <el-radio v-model="form.preprint" label="yes">Yes</el-radio>
              <el-radio v-model="form.preprint" label="no">No</el-radio>
            </el-col>
            <el-col :span="12">
              <el-input
                placeholder="Please enter the DOI"
                v-model="form.doi"
                :disabled="form.preprint === 'no'"
              >
                <template slot="prepend">DOI</template>
              </el-input>
            </el-col>
          </el-col>
        </el-form-item>
      </el-row>
      <el-row style="margin-top:10px">
        <el-form-item
          label="Would you like us to handle the request for a DOI?"
          :disabled="form.preprint === 'yes'"
        >
          <el-col :span="22" :offset="1">
            <el-radio v-model="form.wishDOI" label="yes" :disabled="form.preprint === 'yes'">Yes</el-radio>
            <el-radio v-model="form.wishDOI" label="no" :disabled="form.preprint === 'yes'">No</el-radio>
          </el-col>
        </el-form-item>
      </el-row>
      <el-row style="margin-top:10px">
        <el-form-item label="Which Peer reviewing do you want?" label-width="200px">
          <el-col :span="11" :offset="1">
            <el-radio v-model="form.options" label="classic">Classic peer-reviewing</el-radio>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-radio v-model="form.options" label="open">Open peer-reviewing</el-radio>
          </el-col>
        </el-form-item>
      </el-row>
      <el-row style="margin-top:10px">
        <el-form-item label="Journal" label-width="200px" prop="journal">
          <el-col :span="23">
            <el-select
              default-first-option
              v-model="form.journal"
              placeholder="Please select the journal"
              style="width:100%"
            >
              <el-option
                v-if="status === 'draft'"
                style="background-color: #b3cce6"
                label="Preprint Collection"
                value="preprint"
              ></el-option>
              <div v-for="(journal, index) in journalList" :key="index">
                <el-option :label="journal.title" :value="journal._id"></el-option>
              </div>
            </el-select>
          </el-col>
        </el-form-item>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:showDialog', false);">Cancel</el-button>
      <el-button type="primary" @click="submitForm('form')">Submit</el-button>
    </span>
  </el-dialog>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';
import genericDialog from '../dialog';

export default {
  name: 'submitDialog',
  components: {
    genericDialog
  },
  props: {
    showDialog: Boolean,
    status: String
  },
  data() {
    return {
      show: this.showDialog,
      form: {
        journal: '',
        options: 'open',
        preprint: 'no',
        wishDOI: 'yes'
      },
      journalList: [],
      rule: {
        journal: [
          {
            required: true,
            message: 'No collection selected',
            trigger: ['change']
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(['accessToken', 'userId'])
  },
  async mounted() {
    const journalList = await this.getJournalList();
    this.journalList = journalList.filter(
      journal => journal.title !== 'Preprint Collection'
    );
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('onSubmit', this.form);
          this.$emit('update:showDialog', false);
        } else {
          return false;
        }
      });
    },
    updateShowDialog(isVisible) {
      if (isVisible) return false;
      this.$emit('update:showDialog', false);
    },
    async getJournalList() {
      try {
        const response = await axios.get('/api/journals/', {
          headers: { Authorization: `Bearer ${this.accessToken}` }
        });
        return response.data.journals;
      } catch (e) {
        throw e;
      }
    }
  }
};
</script>

<style scoped>
.el-form-item__error {
  position: inherit;
}
</style>