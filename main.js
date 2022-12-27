import App from './App'
import store from './store/index.js'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'

// 浏览量单位过滤
Vue.filter('formatCount',function(value){
	if(value>=10000&&value<=10000000){
		value/=1000
		return value.toFixed(1)+'万'
	}
	else if(value>10000000){
		value/=10000000
		return value.toFixed(1)+'亿'
	}else{
		return value
	}
})
// 时间格式转化，时间戳转换为日期
Vue.filter('formatTime',function(value){
	var data=new Date(value)
	return data.getFullYear()+'年'+(data.getMonth()+1)+'月'+data.getDate()+'日'
})

const app = new Vue({
    ...App,
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app,
	store
  }
}
// #endif