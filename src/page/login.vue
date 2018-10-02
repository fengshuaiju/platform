<template>
    <div class="login_page fillcontain">
        <transition name="form-fade" mode="in-out">
            <section class="form_contianer" v-show="showLogin">
                <div class="manage_tip">
                    <p>elm后台管理系统</p>
                </div>
                <el-form :model="loginForm" :rules="rules" ref="loginForm">
                    <el-form-item prop="username">
                        <el-input type="text" v-model="loginForm.username" placeholder="用户名"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" v-model="loginForm.password" placeholder="密码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm('loginForm')" class="submit_btn">登陆</el-button>
                    </el-form-item>
                </el-form>
                <p class="tip">温馨提示：</p>
                <p class="tip">未登录过的新用户，自动注册</p>
                <p class="tip">注册过的用户可凭账号密码登录</p>
            </section>
        </transition>
    </div>
</template>

<script>
    //从getData.js中获取暴露出来的接口
    import {login, getAdminInfo} from '@/api/getData';
    import {mapActions, mapState, mapGetters} from 'vuex';
    import {baseUrl} from '../config/env'

    /*
    我在此将三种方式进行了比较。返回的结果是一样的，写但在法上computed计算属性的方式在用属性时不用加(),而methods方式在使用时要像方法一样去用，必须加().
    两种方式在缓存上也大有不同，利用computed计算属性是将 reverseMessage与message绑定，
    只有当message发生变化时才会触发reverseMessage，而methods方式是每次进入页面都要执行该方法，但是在利用实时信息时，比如显示当前进入页面的时间，必须用methods方式
     */

    export default {
        data() {
            return {
                loginForm: {
                    username: '',
                    password: '',
                },
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                },
                showLogin: false,
            }
        },
        mounted() {
            this.showLogin = true;
        },

        //当数据发生变化时触发，跟watch很像，但是又有区别 https://blog.csdn.net/webxiaoma/article/details/72626439
        computed: {
            ...mapState(['adminInfo'])
        },
        //mapActions用法 https://www.cnblogs.com/yaowen/p/8927343.html
        methods: {
            //该处数组中的 getAdminData 和 actions 中的方法名对应
            // mapActions() 返回的是一个对象, 用了 ... 扩展符后，才可以放进一个对象里，和其他组件内定义的 method 在同一个 methods 对象
            //vue  提供了mapAction 函数，它和mapState  是一样的，把我们的 action 直接映射到store 里面的action中
            ...mapActions(['setToken', 'setAdminInfo']),
            ...mapGetters(['getToken']),
            async submitForm(formName) {

                let formData = new FormData();
                formData.append("username", this.loginForm.username);
                formData.append("password", this.loginForm.password);
                formData.append("grant_type", "password");
                formData.append("client_id", "user");

                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        this.$axios({
                            url: baseUrl + "/accounts/oauth/token",
                            method: "POST",
                            headers: {
                                'Content-type': 'application/x-www-form-urlencoded',
                                'Authorization': 'Basic dXNlcjpzZWNyZXQ='
                            },
                            data: formData
                        }).then((res) => {
                            if (res.status === 200) {
                                let accessToken = res.data.access_token;
                                //存储access_token
                                this.setToken(accessToken);

                                //获取管理员信息
                                this.getAdminInfos(accessToken);

                                this.$message({
                                    type: 'success',
                                    message: '登录成功'
                                });
                                //跳转到manager页面
                                this.$router.push('manage')
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: res.message
                                });
                            }
                        }).catch((res) => {
                            console.log(res);
                        });
                    } else {
                        this.$notify.error({
                            title: '错误',
                            message: '请输入正确的用户名密码',
                            offset: 100
                        });
                        return false;
                    }
                });
            },

            getAdminInfos(accessToken) {
                this.$axios({
                    url: baseUrl + "/accounts/v1/users/info",
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + accessToken
                    }
                }).then((res) => {
                    this.setAdminInfo(res.data);
                }).catch((res) => {
                    console.log(res)
                })
            },

        },

    }
</script>

<style lang="less" scoped>
    @import '../style/mixin';

    .login_page {
        background-color: #324057;
    }

    .manage_tip {
        position: absolute;
        width: 100%;
        top: -100px;
        left: 0;
        p {
            font-size: 34px;
            color: #fff;
        }
    }

    .form_contianer {
        .wh(320px, 210px);
        .ctp(320px, 210px);
        padding: 25px;
        border-radius: 5px;
        text-align: center;
        background-color: #fff;
        .submit_btn {
            width: 100%;
            font-size: 16px;
        }
    }

    .tip {
        font-size: 12px;
        color: red;
    }

    .form-fade-enter-active, .form-fade-leave-active {
        transition: all 1s;
    }

    .form-fade-enter, .form-fade-leave-active {
        transform: translate3d(0, -50px, 0);
        opacity: 0;
    }
</style>
