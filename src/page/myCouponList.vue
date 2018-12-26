<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">

            <el-form :inline="true" :model="form" class="demo-form-inline">

                <el-form-item label="查询条件">
                    <el-col :span="22">
                        <el-form-item prop="date">
                            <el-checkbox v-model="form.showAll">是否查询作废折扣</el-checkbox>
                        </el-form-item>
                    </el-col>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
            </el-form>


            <el-table :data="tableData" highlight-current-row style="width: 100%">
                <el-table-column type="index" width="100"></el-table-column>
                <el-table-column property="couponName" label="红包名称" width="250"></el-table-column>
                <el-table-column property="amountOfMoney" label="红包金额" width="220"></el-table-column>
                <el-table-column property="requirementConsumption" label="满减金额" width="100"></el-table-column>
                <el-table-column property="type" label="红包类型" width="250"></el-table-column>
                <el-table-column property="picUrl" label="图片" width="120">
                    <template  slot-scope="scope">
                        <img :src="scope.row.picUrl" class="avator" style="margin-top: 8px"/>
                    </template>
                </el-table-column>
                <el-table-column property="expiryTimeAt" label="过期时间" width="120"></el-table-column>
                <el-table-column property="isAvailable" label="是否可用" width="120">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.showAll" type="primary">未过期</el-button>
                        <el-button v-else type="danger">已过期</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!--页数-->
            <div class="Pagination" style="text-align: left;margin-top: 10px;">
                <el-pagination background layout="total, prev, pager, next, sizes, jumper" :page-sizes="[10, 20, 25, 30]"
                                :page-size="limit"
                               :total="count"
                               :current-page="currentPage"
                               @current-change=""
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
                    showAll: true,
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
                    this.getGoodsList(this.currentPage, this.limit);
                } catch (err) {
                    console.log('获取数据失败', err);
                }
            },
            //更换每页大小
            handleSizeChange(val) {
                this.limit = val;
                this.getGoodsList(this.currentPage, this.limit, this.form.isAvailable);
            },

            // //更换页数
            // handleCurrentChange(val) {
            //     console.log("handleCurrentChange");
            //
            //     this.currentPage = val;
            //     this.getGoodsList(this.currentPage, this.limit);
            // },

            getGoodsList(page, size, showAll) {
                this.$axios({
                    method: 'GET',
                    url: baseUrl + "/baby/platform/discounts/available",
                    headers: {
                        'Authorization': 'Bearer ' + this.getToken()
                    },
                    params: {
                        page: page -1,
                        size: size,

                        showAll: showAll
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
                console.log("onSubmit");
                this.getGoodsList(this.currentPage, this.limit, this.form.showAll);
            },

            editGoodsInfo(){
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
