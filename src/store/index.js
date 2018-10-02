import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

//里边的技术参考 https://www.cnblogs.com/yaowen/p/8927343.html

//const是JavaScript的一种声明方式，如果使用const定义的将是常量，在后续的程序运行中，其值将无法被改变。
const state = {
	adminInfo: {},
    token: null
};

//https://www.cnblogs.com/SamWeb/p/6543931.html
//突变,里边用来定义各种发放
//The only way to actually change state in a Vuex store is by committing a mutation,
/* 在vue 中，只有mutation 才能改变state.  mutation 类似事件，每一个mutation都有一个类型和一个处理函数，
因为只有mutation 才能改变state, 所以处理函数自动会获得一个默认参数 state. 所谓的类型其实就是名字，
action去comit 一个mutation, 它要指定去commit哪个mutation, 所以mutation至少需要一个名字，
commit mutation 之后， 要做什么事情，那就需要给它指定一个处理函数 */
const mutations = {
	setAdminInfo(state, adminInfo){
		state.adminInfo = adminInfo;
        window.localStorage.setItem('adminInfo', JSON.stringify(state.adminInfo));
    },
    setToken(state, token){
        state.token = token;
        window.localStorage.setItem('token', state.token);
    },
    delToken(state){
        state.token = null;
        window.localStorage.setItem('token', null);
    }
};

// 理解vuex核心概念action https://blog.csdn.net/Fabulous1111/article/details/79362535
const actions = {
    //async就是异步的意思， 异步函数也就意味着该函数的执行不会阻塞后面代码的执行
	async setAdminInfo({commit}, adminInfo){
        try{
            commit('setAdminInfo', adminInfo);
		}catch(err){
			console.log('您尚未登陆或者session失效');
		}
	},

	async setToken({commit}, token){
        try{
            commit('setToken', token);
        }catch (err) {
            console.log("设置 token 成功")
        }
    },

    async delToken({commit}){
	    try {
            commit('delToken');
        }catch (err) {
            console.log("删除 token 成功")
        }
    }
};

const getters = {
    getToken: function () {
        return window.localStorage.getItem('token');
    },
    getAdminInfo: function (state) {
        // return state.adminInfo
        return JSON.parse(window.localStorage.getItem('adminInfo'));
    }
};

export default new Vuex.Store({
	state,
    getters,
	actions,
	mutations,
});
