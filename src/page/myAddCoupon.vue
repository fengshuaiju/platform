<template>
    <div>
        <head-top></head-top>
        <el-row style="margin-top: 20px;">
            <el-col :span="12" :offset="4">
                <el-form :model="formData" :rules="rules" ref="formData" label-width="110px" class="demo-formData">
                    <el-form-item label="红包名称" prop="couponName">
                        <el-input v-model="formData.couponName"></el-input>
                    </el-form-item>

                    <el-form-item label="红包类型">
                        <el-select v-model="formData.type" placeholder="请选择">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="红包金额" prop="amountOfMoney">
                        <el-input-number v-model="formData.amountOfMoney" :min="0" :max="100"></el-input-number>
                    </el-form-item>
                    <el-form-item label="满减价格" prop="requirementConsumption">
                        <el-input-number v-model="formData.requirementConsumption" :min="0"
                                         :max="999"></el-input-number>
                    </el-form-item>
                    <el-form-item label="有效天数" prop="validityDay">
                        <el-input-number v-model="formData.validityDay" :min="0" :max="100"></el-input-number>
                    </el-form-item>


                    <el-form-item label="红包图片">
                        <el-upload
                            class="avatar-uploader"
                            :action="uploadUrl()"
                            :show-file-list="false"
                            :on-success="handleShopAvatarScucess"
                            :before-upload="beforeAvatarUpload">
                            <img v-if="formData.picUrl" :src="formData.picUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>

                    <el-form-item label="备注" prop="remarks">
                        <el-input v-model="formData.remarks"></el-input>
                    </el-form-item>

                    <el-form-item class="button_submit">
                        <el-button type="primary" @click="submitForm('formData')">立即创建</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import headTop from '../components/headTop'
    import {baseUrl} from '../config/env'
    import {mapGetters} from 'vuex'

    export default {
        data() {
            return {
                city: {},
                formData: {
                    couponName: '', //店铺名称
                    type: '',
                    picUrl: "",
                    remarks: '',
                    amountOfMoney: 0,
                    validityDay: 30,//有效天数
                    requirementConsumption: 0
                },
                rules: {
                    couponName: [
                        {required: true, message: '请输入红包名', trigger: 'blur'},
                    ]
                },
                options: [{
                    value: 'DISCOUNT',
                    label: '满减优惠'
                }, {
                    value: 'WELCOME',
                    label: '新人红包'
                }],
            }
        },
        components: {
            headTop,
        },
        mounted() {

        },
        methods: {
            ...mapGetters(['getToken']),

            uploadUrl(){
              return baseUrl + "/baby/open/file"
            },

            handleShopAvatarScucess(res, file) {
                this.formData.picUrl = res.basePath + "/" +res.picUrl;
            },
            beforeAvatarUpload(file) {
                const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/png');
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isRightType) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isRightType && isLt2M;
            },

            submitForm(formName) {
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        try {
                            this.submit();
                        } catch (err) {
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

            submit(){
                this.$axios({
                    url: baseUrl + "/baby/discounts",
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.getToken()
                    },
                    data: JSON.stringify(this.formData)
                }).then((res) => {
                    if (res.status === 201) {
                        this.$message({
                            type: 'success',
                            message: '添加成功'
                        });
                        this.formData = {
                            couponName: '', //店铺名称
                            type: '',
                            picUrl: "",
                            remarks: '',
                            amountOfMoney: 0,
                            validityDay: 30,//有效天数
                            requirementConsumption: 0
                        };
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                }).catch((res) => {
                    console.log(res);
                });
            }

        }
    }
</script>

<style lang="less">
    @import '../style/mixin';

    .button_submit {
        text-align: center;
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

    .el-table .info-row {
        background: #c9e5f5;
    }

    .el-table .positive-row {
        background: #e2f0e4;
    }
</style>
