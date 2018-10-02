<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">

            <el-table :data="tableData" highlight-current-row style="width: 100%">
                <el-table-column type="index" width="100"></el-table-column>
                <el-table-column property="registe_time" label="注册日期" width="220"></el-table-column>
                <el-table-column property="username" label="用户姓名" width="220"></el-table-column>
                <el-table-column property="city" label="注册地址"></el-table-column>
                <el-table-column property="city1" label="注册地址"></el-table-column>
            </el-table>

            <!--页数-->
            <div class="Pagination" style="text-align: left;margin-top: 10px;">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="20"
                    layout="total, prev, pager, next"
                    :total="count">
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
                limit: 20,
                count: 0,
                currentPage: 1,
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
                    this.$axios({
                        url: baseUrl + "/baby/user/list",
                        data: {
                            page: 0,
                            size: 20
                        },
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer ' + this.getToken()
                        }
                    }).then((res) => {
                        this.tableData = res.data.content;
                        this.offset = res.data.size * res.data.numberOfElements;
                        this.limit = res.data.size;
                        this.count = res.data.number;
                        this.currentPage = res.data.number;

                    }).catch((res) => {
                        console.log(res)
                    });

                    // if (countData.status === 1) {
                    //     this.count = countData.count;
                    // } else {
                    //     throw new Error('获取数据失败');
                    // }
                    // this.getUsers();

                } catch (err) {
                    console.log('获取数据失败', err);
                }
            },

            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
            },

            handleCurrentChange(val) {
                this.currentPage = val;
                this.offset = (val - 1) * this.limit;
                this.getUsers()
            },

            async getUsers() {
                const Users = await getUserList({offset: this.offset, limit: this.limit});
                this.tableData = [];
                Users.forEach(item => {
                    const tableData = {};
                    tableData.username = item.username;
                    tableData.registe_time = item.registe_time;
                    tableData.city = item.city;
                    tableData.city1 = item.city1;

                    this.tableData.push(tableData);
                })
            },


        },
    }
</script>

<style lang="less">
    @import '../style/mixin';

    .table_container {
        padding: 20px;
    }
</style>
