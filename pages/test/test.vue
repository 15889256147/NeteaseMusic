<template>
	<view class="container">
		test页面
			<scroll-view scroll-y="true" @scrolltolower="pushNewData">
				<view  v-for="(item,index) in list" :key="index">{{item.id}}</view>
			</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[],
				nowPage: 1,
			}
		},
		onLoad() {
			this.init()
		},
		// onReachBottom(){
		// 	this.pushNewData()
		// },
		methods: {
			init() {
				uni.request({
					url:'http://jsonplaceholder.typicode.com/posts'
				}).then(res => {
					if (res[1].data.length <= 30) { // 10条数据一页
						this.list = res.data

					} else {
						this.list = res[1].data.slice(0, 30)

					}
				})
			},
			// 下拉刷新
			pushNewData(){
				uni.request({
					url:'http://jsonplaceholder.typicode.com/posts'
				}).then(res => {
					this.list = this.list.concat(res[1].data.slice(this.nowPage * 30, (this.nowPage + 1) * 30))
					this.nowPage++
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		position: fixed;
		top: 75px;
		width: 100%;
		margin: 40rpx;
		background-color: pink;
		// calc函数内“-”号前后必须要有空格，否则失效
		height: calc(100% - 75px);
		overflow: hidden;
			scroll-view{
				height: 100%;
			}
	}
</style>
