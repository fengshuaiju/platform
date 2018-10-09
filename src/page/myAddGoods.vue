<template>
    <div>
        <head-top></head-top>
        <el-row style="margin-top: 20px;">
            <el-col :span="14" :offset="4">
                <header class="form_header">选择商品种类</header>
                <el-form :model="categoryForm" ref="categoryForm" label-width="110px" class="form">

                    <el-row class="category_select">
                        <el-form-item label="商品种类">
                            <el-select v-model="categoryForm.categorySelect" :placeholder="selectValue"  style="width:100%;">
                                <el-option
                                    v-for="item in categoryForm.categoryList"
                                    :key="item.categoryId"
                                    :label="item.name"
                                    :value="item.categoryId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-row>

                    <el-row class="add_category_row" :class="showAddCategory? 'showEdit': ''">
                        <div class="add_category">
                            <el-form-item label="商品种类" prop="name">
                                <el-input v-model="categoryForm.name"></el-input>
                            </el-form-item>
                            <el-form-item label="商品描述" prop="characteristic">
                                <el-input v-model="categoryForm.characteristic"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitcategoryForm('categoryForm')">提交</el-button>
                            </el-form-item>
                        </div>
                    </el-row>

                    <div class="add_category_button" @click="addCategoryFun">
                        <i class="el-icon-caret-top edit_icon" v-if="showAddCategory"></i>
                        <i class="el-icon-caret-bottom edit_icon" v-else slot="icon"></i>
                        <span>添商品种类</span>
                    </div>
                </el-form>


                <header class="form_header">添加详情</header>
                <el-form :model="goodsForm" :rules="goodsrules" ref="goodsForm" label-width="110px" class="form food_form">
                    <el-form-item label="商品名称" prop="name">
                        <el-input v-model="goodsForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品简介" prop="characteristic">
                        <el-input v-model="goodsForm.characteristic"></el-input>
                    </el-form-item>

                    <el-form-item label="店铺特点" style="white-space: nowrap;">
                        <span>支持拼团</span>
                        <el-switch on-text="" off-text="" v-model="goodsForm.isSupportGroup"></el-switch>
                        <span>支持砍价</span>
                        <el-switch on-text="" off-text="" v-model="goodsForm.isSupportCutDown"></el-switch>
                    </el-form-item>


                    <el-form-item label="上传商品图片">
                        <el-upload
                            class="avatar-uploader"
                            :action="uploadUrl()"
                            :show-file-list="false"
                            :on-success="uploadImgSuccess"
                            :before-upload="beforeImgUpload">
                            <img v-if="goodsForm.imagePath" :src="goodsForm.imagePath" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>

                    <el-form-item label="商品备注" prop="remark">
                        <el-input v-model="goodsForm.remark"></el-input>
                    </el-form-item>

                    <el-row style="overflow: auto; text-align: center;">
                        <el-button type="primary" @click="dialogFormVisible = true" style="margin-bottom: 10px;">添加规格</el-button>
                        <el-table :data="goodsForm.properties" style="margin-bottom: 20px;" :row-class-name="tableRowClassName">
                            <el-table-column prop="name" label="规格名称"></el-table-column>
                            <el-table-column prop="label" label="下级规格">
                                <template slot-scope="scope">
                                    <el-tag v-for="tag in goodsForm.properties[scope.$index].label">
                                        {{tag}}
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" >
                                <template slot-scope="scope">
                                    <el-button size="small" type="danger" @click="handleDelete(scope.$index)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-row>

                    <!--弹出框，添加规格-->
                    <el-dialog title="添加规格" v-model="dialogFormVisible">
                        <el-form :rules="specsFormrules" :model="specsForm">
                            <el-form-item label="规格名称" label-width="100px" prop="name">
                                <el-input v-model="specsForm.name" auto-complete="off"></el-input>
                            </el-form-item>

                            <el-form-item label="下级规格" label-width="100px">
                                <el-tag :key="tag" v-for="tag in specsForm.label"
                                        closable :disable-transitions="false" @close="handleClose(tag)">
                                    {{tag}}
                                </el-tag>
                                <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue"
                                          ref="saveTagInput" size="small"
                                          @keyup.enter.native="handleInputConfirm"
                                          @blur="handleInputConfirm"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                            </el-form-item>

                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="dialogFormVisible = false">取 消</el-button>
                            <el-button type="primary" @click="addspecs">确 定</el-button>
                        </div>
                    </el-dialog>


                    <!--富文本框-->
                    <el-row v-show="!dialogFormVisible" style="overflow: auto; text-align: center;">
                        <header class="form_header">商品介绍</header>
                        <div id="editorElem" style="text-align:left"></div>
                        <!--<button v-on:click="getContent">查看内容</button>-->
                    </el-row>


                    <el-row style="overflow: auto; text-align: center; margin-top: 10px">
                        <el-button type="primary" @click="addGoods('goodsForm')">确认添加商品</el-button>
                    </el-row>
                </el-form>


            </el-col>
        </el-row>
    </div>

</template>

<script>
    import headTop from '../components/headTop'
    import {baseUrl} from '../config/env'
    import {mapGetters} from 'vuex'
    import E from 'wangeditor'

    export default {
        name: 'editor',
        data(){
            return {
                editor: null,
                editorImgUrl: '',
                editorContent: '',
                baseUrl:'',
                restaurant_id: 1,
                categoryForm: {
                    categoryList: [],
                    categorySelect: '',
                    name: '',
                    characteristic: '',
                },
                goodsForm: {
                    categoryId: '',
                    isSupportGroup: false,
                    isSupportCutDown: false,
                    name: '',
                    remark:'',
                    content:'',
                    characteristic: '',
                    imagePath: '',
                    properties: [],
                },

                specsForm: {
                    name: '',
                    label: [],
                },
                specsFormrules: {
                    name: [
                        { required: true, message: '请输入规格名称', trigger: 'blur' },
                    ],
                    label: [
                        { required: true, message: '请输入下级规格', trigger: 'blur' },
                    ],
                },

                goodsrules: {
                    name: [
                        { required: true, message: '请输入食品名称', trigger: 'blur' },
                    ],
                    categoryId: [
                        { required: true, message: '请选择商品类型', trigger: 'blur' },
                    ],
                },

                showAddCategory: false,
                dialogFormVisible: false,

                inputVisible: false,
                inputValue: ''
            }
        },
        components: {
            headTop,
        },
        mounted: function(){
            this.editor = new E('#editorElem');
            this.editor.customConfig.onchange = (html) => {
                this.editorContent = html;
                this.goodsForm.content = html;
            };
            this.editor.customConfig.uploadImgServer = '/upload'; // 上传图片到服务器
            this.editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;//限制图片大小

            //函数内不能直接使用this. 此处转换一下
            let uploadImage = this.uploadImage;

            this.editor.customConfig.customUploadImg = function (files, insert) {
                // files 是 input 中选中的文件列表
                // insert 是获取图片 url 后，插入到编辑器的方法

                uploadImage(files[0], function (data) {
                    // 上传代码返回结果之后，将图片插入到编辑器中
                    insert(data);
                });
            };

            this.editor.create();
        },
        created(){
            this.initCategory();
        },
        computed: {
            selectValue: function (){
                return this.goodsForm.categoryId = this.categoryForm.categorySelect
            }
        },
        methods: {
            ...mapGetters(['getToken']),

            getContent: function () {
                alert(this.editorContent);
            },

            uploadUrl(){
                return baseUrl + "/baby/open/file"
            },

            initCategory(){
                this.$axios({
                    method: 'GET',
                    url: baseUrl + "/baby/category/all",
                    // headers: {
                    //     'Authorization': 'Bearer ' + this.getToken()
                    // },
                    params: {}
                }).then((res) => {
                    this.categoryForm.categoryList = res.data;
                }).catch((res) => {
                    console.log(res)
                });
            },

            addCategoryFun(){
                this.showAddCategory = !this.showAddCategory;
            },

            submitcategoryForm(categoryForm) {
                this.$refs[categoryForm].validate(async (valid) => {
                    if (valid) {
                        const params = {
                            name: this.categoryForm.name,
                            characteristic: this.categoryForm.characteristic,
                            restaurant_id: this.restaurant_id,
                        };
                        try{
                            const result = await addCategory(params);
                            if (result.status === 1) {
                                this.initData();
                                this.categoryForm.name = '';
                                this.categoryForm.characteristic = '';
                                this.showAddCategory = false;
                                this.$message({
                                    type: 'success',
                                    message: '添加成功'
                                });
                            }
                        }catch(err){
                            console.log(err)
                        }
                    } else {
                        this.$notify.error({
                            title: '错误',
                            message: '请检查输入是否正确',
                            offset: 100
                        });
                        return false;
                    }
                });
            },
            uploadImgSuccess(res, file) {
                this.goodsForm.imagePath = res.basePath + "/" +res.picUrl;
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

            addspecs(){
                this.goodsForm.properties.push({...this.specsForm});

                this.specsForm.name = '';
                this.specsForm.label = [];
                this.dialogFormVisible = false;
            },

            handleDelete(index){
                this.goodsForm.properties.splice(index, 1);
            },
            tableRowClassName(row, index) {
                if (index === 1) {
                    return 'info-row';
                } else if (index === 3) {
                    return 'positive-row';
                }
                return '';
            },

            addGoods(goodsForm){

                this.$refs[goodsForm].validate(async (valid) => {
                    if (valid) {
                        try{
                            this.$axios({
                                method: 'POST',
                                url: baseUrl + "/baby/shop/goods",
                                headers: {
                                    'Content-Type': 'application/json',
                                    // 'Authorization': 'Bearer ' + this.getToken()
                                },
                                data: JSON.stringify(this.goodsForm)
                            }).then((res) => {
                                if (res.status === 201) {
                                    this.$message({
                                        type: 'success',
                                        message: '添加成功'
                                    });
                                    this.goodsForm = {
                                        name: '',
                                        isSupportGroup: false,
                                        isSupportCutDown: false,
                                        characteristic: '',
                                        imagePath: '',
                                        attributes: [],
                                        remark:'',
                                        content:'',
                                    };
                                    this.editor.txt.clear();
                                    this.categoryForm.categorySelect = '';
                                }else{
                                    this.$message({
                                        type: 'error',
                                        message: '添加数据失败'
                                    });
                                }

                            }).catch((res) => {
                                console.log(res)
                            });

                        }catch(err){
                            console.log(err)
                        }
                    } else {
                        this.$notify.error({
                            title: '错误',
                            message: '请检查输入是否正确',
                            offset: 100
                        });
                        return false;
                    }
                });
            },


            uploadImage(file, callback){
                let formData = new FormData();
                formData.append("file", file);
                let headers = {headers: {"Content-Type": "multipart/form-data"}};
                this.$axios.post(baseUrl  + "/baby/open/file", formData, headers).then((res) => {
                    if (res.status === 200) {
                        this.editorImgUrl = res.data.basePath + "/" +res.data.picUrl;
                        callback(this.editorImgUrl);
                    }else{
                        this.$message({
                            type: 'error',
                            message: '添加数据失败'
                        });
                    }
                }).catch((res) => {
                    console.log(res)
                });
            },

            handleClose(tag) {
                this.specsForm.label.splice(this.specsForm.label.indexOf(tag), 1);
            },

            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },

            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                    this.specsForm.label.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = '';
            }

        }
    }
</script>

<style lang="less">
    @import '../style/mixin';
    .form{
        min-width: 400px;
        margin-bottom: 30px;
        &:hover{
            box-shadow: 0 0 8px 0 rgba(232,237,250,.6), 0 2px 4px 0 rgba(232,237,250,.5);
            border-radius: 6px;
            transition: all 400ms;
        }
    }
    .food_form{
        border: 1px solid #eaeefb;
        padding: 10px 10px 0;
    }
    .form_header{
        text-align: center;
        margin-bottom: 10px;
    }
    .category_select{
        border: 1px solid #eaeefb;
        padding: 10px 30px 10px 10px;
        border-top-right-radius: 6px;
        border-top-left-radius: 6px;
    }
    .add_category_row{
        height: 0;
        overflow: hidden;
        transition: all 400ms;
        background: #f9fafc;
    }
    .showEdit{
        height: 185px;
    }
    .add_category{
        background: #f9fafc;
        padding: 10px 30px 0px 10px;
        border: 1px solid #eaeefb;
        border-top: none;
    }
    .add_category_button{
        text-align: center;
        line-height: 40px;
        border-bottom-right-radius: 6px;
        border-bottom-left-radius: 6px;
        border: 1px solid #eaeefb;
        border-top: none;
        transition: all 400ms;
        &:hover{
            background: #f9fafc;
            span, .edit_icon{
                color: #20a0ff;
            }
        }
        span{
            .sc(14px, #999);
            transition: all 400ms;
        }
        .edit_icon{
            color: #ccc;
            transition: all 400ms;
        }
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
    .cell{
        text-align: center;
    }


    .el-tag + .el-tag {
        margin-left: 10px;
    }
    .button-new-tag {
        margin-left: 10px;
        height: 32px;
        line-height: 30px;
        padding-top: 0;
        padding-bottom: 0;
    }
    .input-new-tag {
        width: 90px;
        margin-left: 10px;
        vertical-align: bottom;
    }


</style>
