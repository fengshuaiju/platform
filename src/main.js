import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import ElementUI from 'element-ui'
import axios from 'axios'
import qs from 'qs'
import 'element-ui/lib/theme-default/index.css'

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.prototype.$axios=(axios);
Vue.prototype.$qs=(qs);

new Vue({
	el: '#app',
	router,
	store,
	template: '<App/>',
	components: { App }
});
