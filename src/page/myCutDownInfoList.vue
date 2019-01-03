<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">

            <el-form :inline="true" :model="form" class="demo-form-inline">

                <el-form-item label="查询条件">
                    <el-col :span="22">
                        <el-form-item prop="date">
                            <el-input v-model="form.name">商品名</el-input>
                        </el-form-item>
                    </el-col>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
            </el-form>


            <el-table :data="tableData" highlight-current-row style="width: 100%">
                <el-table-column type="index" width="100"></el-table-column>
                <el-table-column property="goodsName" label="商品名称" width="220"></el-table-column>
                <el-table-column property="maxAmountPerCut" label="每次最对砍价" width="220"></el-table-column>
                <el-table-column property="minAmountPerCut" label="每次最少砍价" width="100"></el-table-column>
                <el-table-column property="effectiveTime" label="有效小时数" width="250"></el-table-column>
                <el-table-column property="maxCutDown" label="最多砍价总和" width="120"></el-table-column>
                <el-table-column property="maxHelper" label="最多帮砍人数" width="120"></el-table-column>
                <el-table-column property="status" label="状态" width="120">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status === 'INIT' " type="danger" @click="perAddCutDownInfo(scope.row.goodsId)">
                            未设置
                        </el-button>
                        <el-button v-else type="primary">已设置</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!--页数-->
            <div class="Pagination" style="text-align: left;margin-top: 10px;">
                <el-pagination background layout="total, prev, pager, next, sizes, jumper"
                               :page-sizes="[10, 20, 25, 30]"
                               :page-size="limit"
                               :total="count"
                               :current-page="currentPage"
                               @current-change=""
                               @size-change="handleSizeChange">
                </el-pagination>
            </div>


            <!--弹出框，添加规格-->
            <el-dialog title="添加规格" v-model="dialogFormVisible">
                <el-form :rules="formrules" :model="specsForm">

                    <el-form-item label="每次最多砍价" label-width="100px" prop="name">
                        <el-input v-model="specsForm.maxAmountPerCut"></el-input>
                    </el-form-item>

                    <el-form-item label="每次最少砍价" label-width="100px" prop="name">
                        <el-input v-model="specsForm.minAmountPerCut"></el-input>
                    </el-form-item>

                    <el-form-item label="有效小时数" label-width="100px" prop="name">
                        <el-input v-model="specsForm.effectiveTime"></el-input>
                    </el-form-item>

                    <el-form-item label="最多砍价总和" label-width="100px" prop="name">
                        <el-input v-model="specsForm.maxCutDown"></el-input>
                    </el-form-item>

                    <el-form-item label="最多帮砍人数" label-width="100px" prop="name">
                        <el-input v-model="specsForm.maxHelper"></el-input>
                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addCutDownInfo">确 定</el-button>
                </div>
            </el-dialog>


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

                dialogFormVisible: false,

                form: {
                    name: '',
                },
                specsForm: {
                    goodsId: '',
                    maxAmountPerCut: 0,
                    minAmountPerCut: 0,
                    effectiveTime: 0,
                    maxCutDown: 0,
                    maxHelper: 0,
                },

                formrules: {
                    maxAmountPerCut: [
                        {required: true, message: '输入内容不能为空', trigger: 'blur'},
                    ],
                    minAmountPerCut: [
                        {required: true, message: '输入内容不能为空', trigger: 'blur'},
                    ],
                    effectiveTime: [
                        {required: true, message: '输入内容不能为空', trigger: 'blur'},
                    ],
                    maxCutDown: [
                        {required: true, message: '输入内容不能为空', trigger: 'blur'},
                    ],
                    maxHelper: [
                        {required: true, message: '输入内容不能为空', trigger: 'blur'},
                    ]
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
                    this.getCutDownList(this.currentPage, this.limit, '');
                } catch (err) {
                    console.log('获取数据失败', err);
                }
            },
            //更换每页大小
            handleSizeChange(val) {
                this.limit = val;
                this.getCutDownList(this.currentPage, this.limit, this.form.name);
            },

            // //更换页数
            // handleCurrentChange(val) {
            //     console.log("handleCurrentChange");
            //
            //     this.currentPage = val;
            //     this.getGoodsList(this.currentPage, this.limit);
            // },

            getCutDownList(page, size, name) {
                this.$axios({
                    method: 'GET',
                    url: baseUrl + "/baby/shop/goods/platform/cut-down-infos",
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': 'Bearer ' + this.getToken()
                    },
                    params: {
                        page: page - 1,
                        size: size,

                        name: name
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

            changeDate(val) {
                this.localdate = val;
            },

            onSubmit() {
                this.getCutDownList(this.currentPage, this.limit, this.form.name);
            },

            perAddCutDownInfo(goodsId){
                this.specsForm.goodsId = goodsId;
                this.dialogFormVisible = true;
            },

            addCutDownInfo() {
                this.$axios({
                    method: 'PUT',
                    url: baseUrl + "/baby/shop/goods/platform/cut-down-infos",
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': 'Bearer ' + this.getToken()
                    },
                    data: JSON.stringify(this.specsForm)
                }).then((res) => {
                    if (res.status === 204) {
                        this.$message({
                            type: 'success',
                            message: '修改成功'
                        });
                        //重置弹出框表单
                        this.specsForm.goodsId = '';
                        this.specsForm.maxAmountPerCut = 0;
                        this.specsForm.minAmountPerCut = 0;
                        this.specsForm.effectiveTime = 0;
                        this.specsForm.maxCutDown = 0;
                        this.specsForm.maxHelper = 0;

                        this.getCutDownList(this.currentPage, this.limit, this.form.name);
                        this.dialogFormVisible = false;
                    } else {
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
