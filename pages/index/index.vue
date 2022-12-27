<template>
	<view class="index_container">

		<!-- icon="false"表示不显示该字段 -->
		<!-- 引入自定义头部tab栏 -->
		<musichead title="网易云音乐" :icon="false">
			<template v-slot:content_list>
				<!-- 搜索栏板块 -->
				<view class="index-search" @tap="handleToSearch">
					<text class="iconfont iconsearch"></text>
					<input class="index-search-input" type="text" placeholder="搜索歌曲"></input>
				</view>
				
				<!-- 骨架屏 -->
				<!-- <view class="skeleton">
				    <m-for-skeleton
				    :avatarSize="212"
				    :row="3"
				    :loading="isLoading"
				    isarc="square"
				    v-for="(item,key) in 4"
					:title="false"
					:titleStyle="{}"
				    :key="key">
				    </m-for-skeleton>
				</view> -->
				
				<!-- 歌曲板块 -->
				<view class="index-list">
					<view class="index-list-item" 
						v-for="item in topListArr" 
						:key="item.id"
						@tap="handleToList(item.id)">
						<view class="index-list-img">
							<image class="index-list-imgNow" :src="item.coverImgUrl" mode=""></image>
							<text class="index-list-imgText">{{item.updateFrequency}}</text>
						</view>
						<view class="index-list-text">
							<view class="index-list-textSong" v-for="(top,index) in item.tracks" 
							:key="index">{{index+1}}. {{top.first}} - {{top.second}}</view>
						</view>
					</view>
				</view>
				
				<!-- <button @click="handleToTest">按钮</button> -->
			</template>
		</musichead>
	</view>
</template>

<script>
	import '@/common/iconfont.css';
	import musichead from '../../components/musichead/musichead.vue'
	import mForSkeleton from "@/components/m-for-skeleton/m-for-skeleton";
	import {topList} from '../../common/api.js'
	export default {
		data() {
			return {
				topListArr:[],
				// isLoading:true
			}
		},
		components:{
			musichead,
			mForSkeleton
		},
		onLoad() {
			// this.isLoading=true
			topList().then((res)=>{
				if(res.statusCode===200){
					this.topListArr=res.data.list
					this.topListArr.length=4
					// console.log(this.topListArr);
					// this.isLoading=false
				}
			})
		},
		methods: {
			handleToList(id){
				uni.navigateTo({
					url:'/pages/list/list?id='+id
				})
			},
			handleToSearch(){
				uni.navigateTo({
					url:'/pages/search/search'
				})
			},
			handleToTest(){
				uni.navigateTo({
					url:'/pages/test/test'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index_container{
		.index-search{
			display: flex;
			align-items: center;
			height: 60rpx;
			margin:0 30rpx 30rpx 30rpx;
			background-color: #f5f5f5;
			border-radius: 50rpx;
			.iconsearch{
				font-size: 26rpx;
				margin-right: 26rpx;
				margin-left: 28rpx;
			}
			.index-search-input{
				font-size: 28rpx;
				flex: 1;
			}
		}
		.index-list{
			margin: 0 30rpx;
			margin-bottom: 34rpx;
			.index-list-item{
				display: flex;
				flex-wrap: nowrap;
				margin-bottom: 30rpx;
				.index-list-img{
					width: 212rpx;
					height: 212rpx;
					position: relative;
					margin-right: 22rpx;
					// 表示容器不会收缩，不受挤压
					flex-shrink:0;
					.index-list-imgNow{
						width: 100%;
						height: 100%;
						border-radius: 15rpx;
						overflow: hidden;
					}
					.index-list-imgText{
						position: absolute;
						left: 12rpx;
						bottom: 16rpx;
						color: white;
						font-size: 20rpx;
					}
				}
				.index-list-text{
					flex: 1;
					font-size: 24rpx;
					line-height: 66rpx;
					height: 66*3rpx;
					.index-list-textSong{
						// // 使得超出文字显示省略号
						width: 450rpx;
						text-overflow:ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp:1;
						overflow: hidden;
					}
				}
			}
		}
	}
</style>
