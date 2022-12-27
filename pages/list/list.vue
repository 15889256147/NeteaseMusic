<template>
	<view class="list-container">
		<view class="figbg" :style="{'background-image':'url('+playList.coverImgUrl+')'}"></view>
			<musichead title="歌单" icon color="white" :pushNewData="pushNewData">
				<template v-slot:content_list>
					<view class="" v-show="!isLoading">
					<!-- <view class="" > -->
						<!-- 头部区域 -->
						<view class="list-head">
							<!-- 头部左侧 -->
							<view class="list-head-img">
								<image class="list-head-imgNow" :src="playList.coverImgUrl" mode=""></image>
								<text class="iconfont iconyousanjiao">{{playList.playCount | formatCount}}</text>
							</view>
							<!-- 头部右侧 -->
							<view class="list-head-text">
								<view class="title">{{playList.name}}</view>
								<view class="logo">
									<image class="logo-img" :src="playList.creator.avatarUrl" mode=""></image>
									<text class="logo-text">{{playList.creator.nickname}}</text>
								</view>
								<view class="content">
									{{playList.description}}
								</view>
							</view>
						</view>
						<!-- 分享按钮 仅在微信小程序中展示-->
						<!-- #ifdef MP-WEIXIN -->
						 <button class="list-head-share" open-type="share">
							 <text class="iconfont iconicon-"></text>分享给微信好友
						 </button>
						 <!-- #endif -->
						 <!-- 歌曲列表 -->
						 <view class="list-music">
							 <!-- 歌曲列表头部 -->
						 	<view class="list-music-head">
						 		<text class="iconfont iconbofang1"></text>
								<text class="list-music-all">播放全部</text>
								<text class="list-music-count">(共{{playList.trackCount}}首)</text>
						 	</view>
							<!-- 歌曲歌单 -->
							<view class="list-music-item" v-for="(item,index) in playListData" :key="item.id" @tap="handleToDetail(item.id)">
								<view class="list-music-top">{{index+1}}</view>
								<view class="list-music-song">
									<view class="list-music-songName">{{item.name}}</view>
									<view class="list-music-songInfo">
										<image class="list-music-songImg" v-show="privileges[index].fee==1" src="../../static/vip.png" mode=""></image>
										<image class="list-music-songImg" v-show="privileges[index].maxbr==999000" src="../../static/sq.png" mode=""></image>
										<text class="list-music-songAuthor">{{authorsName[index]}} - {{item.al.name}}</text>
									</view>
								</view>
								<text class="iconfont iconbofang"></text>
							</view>
						 </view>
					</view>
				</template>
			</musichead>
			
	</view>
</template>

<script>
	import musichead from '../../components/musichead/musichead.vue'
	import {list} from '../../common/api.js'
	export default {
		data() {
			return {
				isLoading:true,
				playList:{
					creator:{
						avatarUrl:''
					}
				},
				privileges:{},
				nowPage: 1,
				playListData:[],
				authorsName:[]
			}
		},
		components:{
			musichead
		},
		methods: {
			getAuthorName(list){
					for(let j=0;j<list.length;j++){
						let authors=list[j].ar
						// 调用共享vuex拼接作者名称方法
						this.$store.commit('JOIN_AUTHORNAME',authors)
						this.authorsName[j]=this.$store.state.authorsName
					}
			},
			// 获取歌曲详情页
			handleToDetail(id){
				uni.navigateTo({
					url:'/pages/detail/detail?singId='+id
				})
			},
			// 获取新值
			pushNewData(){
				// console.log('下拉刷新');
				if(this.playListData.length<this.playList.tracks.length){
					this.playListData = this.playListData.concat(this.playList.tracks.slice(this.nowPage * 10, (this.nowPage + 1) * 10))
					this.nowPage++
					this.getAuthorName(this.playListData)
				}
			}
		},
		onLoad(option) {
			// console.log(option);
			// 显示加载中
			uni.showLoading({
				title:'加载中...',
				icon:'loading'
			})
			this.isLoading=true
			
			list(option.id).then((res)=>{
				if(res[1].statusCode===200){
					this.playList=res[1].data.playlist
					this.privileges=res[1].data.privileges
					// 只展示10条数据
					this.playListData = this.playList.tracks.slice(0, 10)
					this.getAuthorName(this.playListData)

					// 获取下一首歌的id值，实现播完自动跳转至下一首歌
					this.$store.commit('INIT_TOPLISTID',res[1].data.playlist.trackIds)
					// 关闭加载中图标
					uni.hideLoading()
					this.isLoading=false
				}
			})
		}
	}
</script>

<style lang="scss" scoped>
.list-container{
	.list-head{
		display: flex;
		margin-top: 30rpx;
		.list-head-img{
			width: 264rpx;
			height: 264rpx;
			position: relative;
			margin:0 30rpx 0 42rpx;
			flex-shrink:0;
			.list-head-imgNow{
				width: 100%;
				height: 100%;
				border-radius: 15rpx;
				overflow: hidden;
			}
			.iconyousanjiao{
				position: absolute;
				right: 10rpx;
				top: 5rpx;
				color: white;
				font-size: 26rpx;
			}
		}
		.list-head-text{
			flex: 1;
			color: #f0f2f7;
			.title{
				color: white;
				font-size: 34rpx;
			}
			.logo{
				display: flex;
				margin: 20rpx 0;
				// 使得元素居中对齐
				align-items: center;
				.logo-img{
					max-width: 54rpx;
					max-height: 54rpx;
					border-radius: 27rpx;
					margin-right: 14rpx;
					// transform: scale(1.2);
				}
				.logo-text{
					font-size: 24rpx;
				}
			}
			.content{
				// height: 120rpx;
				line-height: 37rpx;
				font-size: 22rpx;
				margin-right: 60rpx;
				// 超出文字显示省略号
				text-overflow:ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp:3;
				overflow: hidden;
			}
		}
	}
	.list-head-share{
		width: 330rpx;
		height: 74rpx;
		line-height: 74rpx;
		text-align: center;
		font-size: 28rpx;
		border-radius: 37rpx;
		margin: 40rpx auto;
		color: white;
		background-color: rgba(0, 0, 0,0.4);
		text{
			margin-right: 16rpx;
		}
	}
	.list-music{
		background-color: white;
		border-radius: 50rpx 50rpx 0 0;
		margin-top: 30rpx;
		.list-music-head{
			height: 50rpx;
			align-items: center;
			padding: 30rpx 0 65rpx 22rpx;
			.iconbofang1{
				font-size: 50rpx;
				height: 50rpx;
			}
			.list-music-all{
				font-size: 30rpx;
				margin: 0 10rpx 0 26rpx;
			}
			.list-music-count{
				font-size: 26rpx;
				color: #b2b2b2;
			}
		}
		.list-music-item{
			display: flex;
			padding: 0 32rpx 46rpx 0;
			align-items: center;
			color: #959595;
			.list-music-top{
				margin-right: 32rpx;
				font-size: 28rpx;
				width: 50rpx;
				text-align: center;
				margin: 25rpx;
			}
			.list-music-song{
				flex: 1;
				.list-music-songName{
					color: black;
					font-size: 28rpx;
					width: 550rpx;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.list-music-songInfo{
					display: flex;
					align-items: center;
					padding-right: 18rpx;
					.list-music-songImg{
						width: 32rpx;
						height: 20rpx;
						margin-right: 10rpx;
						/* // 使其不被挤压 */
						flex-shrink: 0; 
					}
					.list-music-songAuthor{
						font-size: 20rpx;
						/* // 超出文字显示省略号 */
						text-overflow:ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp:1;
						overflow: hidden;
					}
				}
			}
			.iconbofang{
				font-size: 50rpx;
				color: #c7c7c7;
			}
		}
	}
}
</style>
