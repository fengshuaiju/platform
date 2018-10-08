<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">

            <el-form :inline="true" :model="form" class="demo-form-inline">
                <el-form-item label="手机号">
                    <el-input v-model="form.phone" placeholder="手机号"></el-input>
                </el-form-item>

                <el-form-item label="注册日期">
                    <el-col :span="22">
                        <el-form-item prop="date">
                            <el-date-picker type="date" placeholder="选择日期" @change="changeDate" value-format="yyyy-MM-dd" format="yyyy-MM-dd" v-model="form.date" style="width: 100%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
            </el-form>


            <el-table :data="tableData" highlight-current-row style="width: 100%">
                <el-table-column type="index" width="100"></el-table-column>
                <el-table-column property="createdAt" label="注册日期" width="250"></el-table-column>
                <el-table-column property="nickName" label="用户昵称" width="220"></el-table-column>
                <el-table-column property="gender" label="性别" width="100"></el-table-column>
                <el-table-column property="cellphone" label="电话" width="250"></el-table-column>
                <el-table-column property="avatarUrl" label="头像" width="120">
                    <template  slot-scope="scope">
                        <img :src="scope.row.avatarUrl" class="avator" style="margin-top: 8px"/>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="middle" @click="handleInfo(scope.row.wechatOpenId)">详细信息</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!--页数-->
            <div class="Pagination" style="text-align: left;margin-top: 10px;">
                <el-pagination background layout="total, prev, pager, next, sizes, jumper" :page-sizes="[10, 20, 25, 30]"
                                :page-size="limit"
                               :total="count"
                               :current-page="currentPage"
                               @current-change="handleCurrentChange"
                               @size-change="handleSizeChange">
                </el-pagination>
            </div>

        </div>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {baseUrl} from '../config/env'
    import {mapGetters} from 'vuex'

    export default {
        data() {
            return {
                tableData: [],
                currentRow: null,
                offset: 0,
                limit: 10,
                count: 0,//总数目
                currentPage: 1,

                localdate: '',
                form: {
                    phone: '',
                    date: ''
                },

            }
        },
        components: {
            headTop,
        },
        created() {
            this.initData();
        },
        methods: {
            ...mapGetters(['getToken']),
            initData() {
                try {
                    this.getUserList(this.currentPage, this.limit);
                } catch (err) {
                    console.log('获取数据失败', err);
                }
            },
            //更换每页大小
            handleSizeChange(val) {
                this.limit = val;
                this.getUserList(this.currentPage, this.limit, this.localdate, this.form.phone);
            },
            //更换页数
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getUserList(this.currentPage, this.limit);
            },

            getUserList(page, size, date, phone) {
                this.$axios({
                    method: 'GET',
                    url: baseUrl + "/baby/user/list",
                    headers: {
                        'Authorization': 'Bearer ' + this.getToken()
                    },
                    params: {
                        page: page -1,
                        size: size,

                        date: date,
                        phone: phone
                    }
                }).then((res) => {
                    this.tableData = res.data.content;
                    this.offset = res.data.size * res.data.numberOfElements;
                    this.limit = res.data.size;
                    this.count = res.data.totalElements;
                    this.currentPage = res.data.number + 1;
                }).catch((res) => {
                    console.log(res)
                });
            },

            changeDate(val){
                this.localdate = val;
            },

            onSubmit() {
                this.getUserList(this.currentPage, this.limit, this.localdate, this.form.phone);
            },

            handleInfo(){
                console.log("获取用户详细信息！！！");
            }

        },
    }
</script>

<style lang="less">
    @import '../style/mixin';

    .table_container {
        padding: 20px;
    }
</style>
