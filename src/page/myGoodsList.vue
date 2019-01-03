<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">

            <el-form :inline="true" :model="form" class="demo-form-inline">
                <el-form-item label="商品名称">
                    <el-input v-model="form.keyWord" placeholder="商品名"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
            </el-form>


            <el-table :data="tableData" highlight-current-row style="width: 100%">
                <el-table-column type="index"></el-table-column>
                <el-table-column property="name" label="商品名" width="400"></el-table-column>
                <el-table-column property="characteristic" label="描述" width="300"></el-table-column>
                <el-table-column property="numberFav" label="收藏数"></el-table-column>
                <el-table-column property="numberOrders" label="已购买数"></el-table-column>
                <el-table-column property="isSupportGroup" label="拼 团">
                    <template slot-scope="scope">
                        <el-switch @change="changeSupportGroup(scope.$index, scope.row.goodsId, scope.row.isSupportGroup)" v-model="scope.row.isSupportGroup" on-text="" off-text="" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                    </template>
                </el-table-column>

                <el-table-column property="isSales" label="在 售">
                    <template slot-scope="scope">
                        <el-switch @change="pullOnOff(scope.$index, scope.row.goodsId, scope.row.isSales)" v-model="scope.row.isSales" on-text="" off-text="" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button v-if="JSON.stringify(scope.row.price)==='{}'" type="danger" size="small" @click="preAddPrice(scope.row.goodsId)">添加价格</el-button>
                        <el-button v-else type="success" size="small" @click="showpriceList(scope.row.goodsId)">查看价格</el-button>
                        <el-button type="warning" size="small" @click="editGoodsInfo(scope.row.goodsId)">修改信息</el-button>
                    </template>
                </el-table-column>
            </el-table>


            <!--弹出框，查看价格-->
            <el-dialog title="查看价格" :visible.sync="showPriceVisible">
                <el-table :data="priceList" highlight-current-row style="width: 100%">
                    <el-table-column type="index" width="100"></el-table-column>
                    <el-table-column property="propertyName" label="类型名称" width="400"></el-table-column>
                    <el-table-column property="priceTypeValue" label="价格类型" width="200"></el-table-column>
                    <el-table-column property="price" label="价格" width="210">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.price" @blur="editPrice(scope.row.priceId, scope.row.price)"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </el-dialog>


            <!--弹出框，添加价格-->
            <el-dialog title="查看价格" :visible.sync="addPriceVisible">
                <el-table :data="priceProperty" highlight-current-row style="width: 100%">
                    <el-table-column type="index" width="100"></el-table-column>
                    <el-table-column property="propertyName" label="类型名称" width="400"></el-table-column>
                    <el-table-column property="priceTypeValue" label="价格类型" width="200"></el-table-column>
                    <el-table-column property="price" label="价格" width="210">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.price"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row style="float:right">
                    <el-button type="primary" round @click="subNewPrice">添加价格</el-button>
                </el-row>
            </el-dialog>

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

                showPriceVisible: false,
                addPriceVisible: false,
                currentRow: null,
                offset: 0,
                limit: 10,
                count: 0,//总数目
                currentPage: 1,

                localdate: '',
                form: {
                    keyWord: ''
                },

                priceList: [],
                priceProperty:[],
                tableData: [],
            }
        },
        components: {
            headTop,
        },
        created() {
            this.initData();
        },

        mounted(){
            this.initMap();
        },

        methods: {
            ...mapGetters(['getToken']),

            initMap(){
                this.map = new Map();
                this.map.set("aa:bb",12.6);
                this.map.set("aa:cc",13.8);
            },

            initData() {
                try {
                    this.getGoodsList(this.currentPage, this.limit, this.form.keyWord);
                } catch (err) {
                    console.log('获取数据失败', err);
                }
            },
            //更换每页大小
            handleSizeChange(val) {
                this.limit = val;
                this.getGoodsList(this.currentPage, this.limit, this.form.keyWord);
            },
            //更换页数
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getGoodsList(this.currentPage, this.limit, this.form.keyWord);
            },

            /**
             * 查找商品列表
             * @param page
             * @param size
             * @param keyWord
             */
            getGoodsList(page, size, keyWord) {
                this.$axios({
                    method: 'GET',
                    url: baseUrl + "/baby/shop/goods/platform/search",
                    headers: {
                        //'Authorization': 'Bearer ' + this.getToken()
                    },
                    params: {
                        page: page -1,
                        size: size,

                        keyWord: keyWord,
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
                this.getGoodsList(this.currentPage, this.limit, this.form.keyWord);
            },

            editGoodsInfo(){
                console.log("获取用户详细信息！！！");
            },

            /**
             * 更改商品是否拼团
             * @param index
             * @param goodsId
             * @param grouping
             */
            changeSupportGroup(index, goodsId, grouping){
                this.$axios({
                    method: 'PUT',
                    url: baseUrl + "/baby/shop/goods/platform/pull-on-off-grouping",
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': 'Bearer ' + this.getToken()
                    },
                    data: {
                        goodsId: goodsId,
                        grouping: grouping
                    }
                }).then((res) => {
                    if (res.status === 204) {
                        this.$message({
                            type: 'success',
                            message: '修改成功'
                        });
                    }else{
                        this.$message({
                            type: 'error',
                            message: '修改数据失败'
                        });
                    }
                }).catch((res) => {
                    this.$message({
                        type: 'error',
                        message: '修改数据失败'
                    });
                    console.log(res);
                });
            },

            /**
             * 展示商品是否出售
             * @param index
             * @param goodsId
             * @param status
             */
            pullOnOff(index, goodsId, status){
                this.$axios({
                    method: 'PUT',
                    url: baseUrl + "/baby/shop/goods/platform/pull-on-off",
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': 'Bearer ' + this.getToken()
                    },
                    data: {
                        goodsId: goodsId,
                        status: status
                    }
                }).then((res) => {
                    if (res.status === 204) {
                        this.$message({
                            type: 'success',
                            message: '修改成功'
                        });
                    }else{
                        this.$message({
                            type: 'error',
                            message: '修改失败'
                        });
                    }
                }).catch((res) => {
                    this.$message({
                        type: 'error',
                        message: '修改数据失败'
                    });
                    console.log(res);
                });
            },

            /**
             * 查询商品的价格
             */
            showpriceList(goodsId){
                this.showPriceVisible = true;
                this.$axios({
                    method: 'GET',
                    url: baseUrl + "/baby/shop/goods/platform/price",
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': 'Bearer ' + this.getToken()
                    },
                    params: {
                        goodsId: goodsId
                    }
                }).then((res) => {
                    if (res.status === 200) {
                        this.priceList = res.data;
                    }else{
                        this.$message({
                            type: 'error',
                            message: '获取价格失败'
                        });
                    }
                }).catch((res) => {
                    this.$message({
                        type: 'error',
                        message: '修改数据失败'
                    });
                    console.log(res);
                });
            },

            /**
             * 修改某个价格
             * @param priceId
             * @param price
             */
            editPrice(priceId, price){
                this.$axios({
                    method: 'PUT',
                    url: baseUrl + "/baby/shop/goods/platform/price",
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': 'Bearer ' + this.getToken()
                    },
                    data: {
                        priceId: priceId,
                        price: price
                    }
                }).then((res) => {
                    if (res.status === 204) {
                        this.$message({
                            type: 'success',
                            message: '修改成功'
                        });
                    }else{
                        this.$message({
                            type: 'error',
                            message: '修改失败'
                        });
                    }
                }).catch((res) => {
                    this.$message({
                        type: 'error',
                        message: '修改数据失败'
                    });
                    console.log(res);
                });
            },


            /**
             * 准备添加新价格
             * @param goodsId
             */
            preAddPrice(goodsId){
                this.addPriceVisible = true;
                this.$axios({
                    method: 'GET',
                    url: baseUrl + "/baby/shop/goods/platform/new-price-property",
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': 'Bearer ' + this.getToken()
                    },
                    params: {
                        goodsId: goodsId
                    }
                }).then((res) => {
                    if (res.status === 200) {
                        this.priceProperty = res.data;
                    }else{
                        this.$message({
                            type: 'error',
                            message: '获取价格失败'
                        });
                    }
                }).catch((res) => {
                    this.$message({
                        type: 'error',
                        message: '获取价格失败'
                    });
                    console.log(res);
                });
            },

            /**
             * 添加价格
             * @param goodsId
             */
            subNewPrice(goodsId){
                this.$axios({
                    method: 'POST',
                    url: baseUrl + "/baby/shop/goods/platform/price",
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': 'Bearer ' + this.getToken()
                    },
                    data: JSON.stringify(this.priceProperty)
                }).then((res) => {
                    if (res.status === 204) {
                        this.$message({
                            type: 'success',
                            message: '修改成功'
                        });
                        this.getGoodsList(this.currentPage, this.limit, this.form.keyWord);
                        this.addPriceVisible = false;
                    }else{
                        this.$message({
                            type: 'error',
                            message: '修改失败'
                        });
                    }
                }).catch((res) => {
                    this.$message({
                        type: 'error',
                        message: '修改数据失败'
                    });
                    console.log(res);
                });
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
