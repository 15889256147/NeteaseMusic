// 创建vuex共享实例对象
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state:{
		topListId:[],
		nextId:'',
		authorsName:''
	},
	mutations:{
		INIT_TOPLISTID(state,value){
			state.topListId=value
		},
		NEXT_ID(state,value){
			for(let i=0;i<state.topListId.length-1;i++){
				if(state.topListId[i].id==value){
					state.nextId=state.topListId[i+1].id
					// console.log(state.nextId);
				}
			}
		},
		JOIN_AUTHORNAME(state,authors){
			let authorsName=authors[0].name
			for(let i=1;i<authors.length;i++){
				authorsName=authorsName+'/'+authors[i].name
			}
			state.authorsName=authorsName
		}
	}
})