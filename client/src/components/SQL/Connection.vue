<template>
    <el-form ref="sqlForm" :model="sqlForm" :rules="sqlRules">
        <el-form-item prop="type">
            <el-radio v-model="sqlForm.type" label="1">MySQL</el-radio>
            <el-radio v-model="sqlForm.type" label="2">PostgreSQL</el-radio>
            <el-radio v-model="sqlForm.type" label="3">MongoDB</el-radio>
        </el-form-item>
        <el-form-item prop="Host">
            <el-input v-model="sqlForm.host" placeholder="Host"></el-input>
        </el-form-item>
        <el-form-item prop="Port">
            <el-input v-model="sqlForm.port" placeholder="Port"></el-input>
        </el-form-item>
        <el-form-item prop="User">
            <el-input v-model="sqlForm.user" placeholder="Username"></el-input>
        </el-form-item>
        <el-form-item prop="Password">
            <el-input type="password" v-model="sqlForm.password" placeholder="Password"></el-input>
        </el-form-item>
        <el-form-item prop="Database">
            <el-input v-model="sqlForm.database" placeholder="Database"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button @click="connectDatabase()" type="primary" round>Connect</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import axios from 'axios';
    import {mapGetters} from "vuex";
    export default {
        name: "Connection",
        props: [
          'sqlForm',
          'sqlRules'
        ],
        computed: {
            ...mapGetters(['accessToken'])
        },
        methods: {
            async connectDatabase () {
                if (this.sqlForm.type === "1")
                    this.sqlForm.type = "mysql";
                else if (this.sqlForm.type === "2")
                    this.sqlForm.type = "pg";
                else
                    this.sqlForm.type = "mongodb";
                const response = await axios.post('/api/data/sql/connect', this.sqlForm, {
                    headers: {'Authorization': `Bearer ${this.accessToken}`}
                });
                this.$emit('connectdatabase', response.data.success)
            }
        }
    }
</script>

<style scoped>

</style>