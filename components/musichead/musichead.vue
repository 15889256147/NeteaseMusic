<template>
	<view class="">
		<!-- 自定义头部tab栏 -->
		<view class="musice-head" :style="{color:color}"> 
			<view v-if="icon" class="music-head-icon" :class="{'music-head-iconblack':iconblank}">
				<text class="iconfont iconzuojiantou-copy" @tap="handleToBack"></text> | <text class="iconfont iconshouye" @tap="handleToHome"></text>
			</view>
			<text class="musice-head-title">{{title}}</text>
		</view>
		<!-- 下方可滚动区域 -->
		<view class="container" >
			<scroll-view scroll-y="true" @scrolltolower="pushNewDataL" @scroll="onPageScrollL">
				<slot name="content_list">暂无数据</slot>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import '@/common/iconfont.css';
	export default {
		name:"musichead",
		data() {
			return {
				
			};
		},
		props:['title','icon','color','iconblank','pushNewData','onPageScroll'],
		methods:{
			handleToBack(){
				uni.navigateBack()
			},
			handleToHome(){
				uni.navigateTo({
					url:'/pages/index/index'
				})
			},
			pushNewDataL(){
				if(this.pushNewData){
					this.pushNewData()
				}
			},
			onPageScrollL(){
				if(this.onPageScroll){
					this.onPageScroll()
				}
			}
		},
		onLoad() {
		}
	}
</script>

<style lang="scss" scoped>
	.musice-head{
		width: 100%;
		height: 75px;
		font-size: 16px;
		line-height: 80px;
		color: black;
		text-align: center;
		position: fixed;
		top: 0;
		z-index: 1;
		.music-head-icon{
			position: fixed;
			left: 8px;
			top: 30px;
			width: 90px;
			height: 28px;
			background-color: rgba(0, 0, 0, 0.4);
			color: white;
			// 行高会受到父样式的影响
			line-height: 30px;
			border-radius: 15px;
			display: flex;
			justify-content: space-evenly;
		}
		.music-head-iconblack{
			color: black;
			border: 1px black solid;
			background-color: white;
		}
		.musice-head-title{
			width: 170px;
			display: block;
			margin: 0 auto;
			padding-top: 5px;
			overflow: hidden;
			white-space: nowrap;
			text-overflow:ellipsis;
		}
	}
</style>