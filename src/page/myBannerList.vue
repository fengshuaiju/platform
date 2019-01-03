<template>
    <div class="fillcontain">
        <head-top></head-top>
        <div class="table_container">

            <el-form :inline="true" class="demo-form-inline">
                <el-form-item>
                    <el-button type="primary" @click="showAddBanner = true">+新增</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="bannerList" highlight-current-row style="width: 100%">
                <el-table-column type="index"></el-table-column>
                <el-table-column property="goodsName" label="商品名" width="400"></el-table-column>
                <el-table-column property="type" label="类型" width="300"></el-table-column>
                <el-table-column property="picUrl" label="图片">
                    <template  slot-scope="scope">
                        <el-popover placement="right" title="" trigger="hover">
                            <img :src="scope.row.picUrl"/>
                            <img slot="reference" :src="scope.row.picUrl" :alt="scope.row.picUrl" style="max-height: 50px;max-width: 130px">
                        </el-popover>
                    </template>
                </el-table-column>
            </el-table>

            <!--弹出框，添加规格-->
            <el-dialog title="添加规格" v-model="showAddBanner">
                <el-form :rules="formrules" :model="bannerForm">

                    <el-form-item label="选择商品" label-width="100px" prop="name">
                        <el-select v-model="bannerForm.goodsId" filterable placeholder="请选择">
                            <el-option
                                v-for="item in goodsNames"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="上传商品图片">
                        <el-upload
                            class="avatar-uploader"
                            :action="uploadUrl()"
                            :show-file-list="false"
                            :on-success="uploadImgSuccess"
                            :before-upload="beforeImgUpload">
                            <img v-if="bannerForm.picUrl" :src="bannerForm.picUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>


                    <el-form-item label="选择商品" label-width="100px" prop="name">
                        <el-select v-model="bannerForm.slideType" filterable placeholder="请选择">
                            <el-option
                                v-for="item in slideType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="showAddBanner = false">取 消</el-button>
                    <el-button type="primary" @click="addBannerInfo">确 定</el-button>
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
                showAddBanner: false,
                bannerList: [],
                bannerForm:{
                    goodsId:"",
                    picUrl:"",
                    slideType:"",
                },

                goodsNames: [],

                slideType: [{
                    value: 'HOME',
                    label: '主  页'
                }, {
                    value: 'MENU',
                    label: '类型页'
                }],

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
                    this.getBannerList();
                    this.getGoodsNames();
                } catch (err) {
                    console.log('获取数据失败', err);
                }
            },

            /**
             * 查找轮播图列表
             */
            getBannerList() {
                this.$axios({
                    method: 'GET',
                    url: baseUrl + "/baby/platform/banner",
                    headers: {
                        //'Authorization': 'Bearer ' + this.getToken()
                    },
                }).then((res) => {
                    this.bannerList = res.data;
                }).catch((res) => {
                    console.log(res)
                });
            },

            /**
             * 查询商品名字
             */
            getGoodsNames(){
                this.$axios({
                    method: 'GET',
                    url: baseUrl + "/baby/shop/goods/platform/goodsNames",
                    headers: {
                        //'Authorization': 'Bearer ' + this.getToken()
                    },
                }).then((res) => {
                    this.goodsNames = res.data;
                }).catch((res) => {
                    console.log(res)
                });
            },

            uploadUrl(){
                return baseUrl + "/baby/open/file"
            },

            uploadImgSuccess(res, file) {
                this.bannerForm.picUrl = res.basePath + "/" +res.picUrl;
            },

            beforeImgUpload(file) {
                const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/png');
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isRightType) {
                    this.$message.error('上传图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 2MB!');
                }
                return isRightType && isLt2M;
            },

            addBannerInfo(){
                this.$axios({
                    method: 'POST',
                    url: baseUrl + "/baby/platform/banner",
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': 'Bearer ' + this.getToken()
                    },
                    data: JSON.stringify(this.bannerForm)
                }).then((res) => {
                    if (res.status === 201) {
                        this.$message({
                            type: 'success',
                            message: '添加成功'
                        });
                        this.bannerForm = {
                            goodsId:"",
                            picUrl:"",
                            slideType:"",
                        };
                        this.getBannerList();
                        this.showAddBanner = false;
                    }else{
                        this.$message({
                            type: 'error',
                            message: '添加数据失败'
                        });
                    }

                }).catch((res) => {
                    console.log(res)
                });
            }

        },
    }
</script>

<style lang="less">
    @import '../style/mixin';

    .table_container {
        padding: 20px;
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
    }
    .avatar {
        width: 120px;
        height: 120px;
        display: block;
    }

</style>
