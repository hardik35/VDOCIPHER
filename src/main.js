import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
axios.defaults.baseURL = 'https://www.vdocipher.com/blog/wp-json/wp/v2'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
