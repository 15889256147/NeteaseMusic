<template>
	<view class="detai-container">
		<view class="figbg" :style="{'background-image':'url('+songDetail.al.picUrl+')'}"></view>
		<musichead :title="songDetail.name" icon color="white" :onPageScroll="onPageScroll" >
			<template v-slot:content_list>
				<view v-show="!isLoading">
					<!-- 音乐盘区域 -->
					<view class="detai-play" @tap="handleToPlay">
						<!-- 当isPlayRotate值为true时，添加class类，旋转动画 -->
						<image class="detai-play-img" :src="songDetail.al.picUrl" :class="{'detai-play-run':isPlayRotate}" mode="" importance="hight"></image>
						<text class="detai-play-icon iconfont" :class="iconPlay"></text>
						<view class="needle"></view>
					</view>
					<!-- 歌词区域 -->
					<view class="detai-lyric">
						<view class="detai-lyric-warp" :style="{'transform':'translateY('+-(lyricIndex-1)*82+'rpx)'}">
							<view class="detai-lyric-item" v-for="(item,index) in songLyric" :key="index" :class="{active:lyricIndex===index}">{{item.lyric}}</view>
						</view>
					</view>
					<!-- 推荐歌曲区域 -->
					<view class="detai-like">
						<view class="detail-like-head">喜欢这首歌的人也听</view>
						<!-- 歌曲区域 -->
						<view class="detai-like-item" v-for="(item,index) in songSimi" :key="index" @tap="handleToSimi(item.id)">
							<view class="detai-like-img">
								<image :src="item.album.blurPicUrl" mode=""></image>
							</view>
							<view class="detai-like-song">
								<view class="">{{item.name}}</view>
								<view class="">
									<image v-show="item.privilege.fee==1" src="../../static/vip.png" mode=""></image>
									<image v-show="item.privilege.maxbr==999000" src="../../static/sq.png" mode=""></image>
									<text>{{authorsName[index]}} - {{item.album.name}}</text>
								</view>
							</view>
							<text class="iconfont iconbofang"></text>
						</view>
					
					</view>
					
					<!-- 歌曲评论区域 -->
					<view class="detail-comment">
						<view class="detail-comment-head">精彩评论</view>
						<!-- 每一项评论 -->
						<view class="detail-comment-item" v-for="(item,index) in songComont" :key="index">
							<!-- 左侧评论者头像 -->
							<view class="detail-comment-img">
								<!-- <image class="detail-comment-imgNow" :src="item.user.avatarUrl" mode=""></image> -->
								<easy-loadimage class="detail-comment-imgNow" :scrollTop="scrollTop" :imageSrc="item.user.avatarUrl"></easy-loadimage>
							</view>
							<!-- 右侧评论内容 -->
							<view class="detail-comment-content">
								<!-- 用户名/时间/点赞数 -->
								<view class="detail-comment-title">
									<view class="detail-comment-Info">
										<view class="detail-comment-name">{{item.user.nickname}}</view>
										<view class="detail-comment-data">{{item.time | formatTime}}</view>
									</view>
									<view class="detail-comment-like">{{item.likedCount | formatCount}} <text class="iconfont iconlike"></text></view>
								</view>
								<!-- 评论者评论的内容 -->
								<view class="detail-comment-text">{{item.content}}</view>
							</view>
						</view>
						<!-- 查看更多 -->
						<view class="detail-more">
							下载APP查看更多精彩评论
						</view>
					</view>
					
					

				</view>
			</template>
		</musichead>
	</view>
</template>

<script>
	import musichead from '../../components/musichead/musichead.vue'
	import easyLoadimage from '@/components/easy-loadimage/easy-loadimage.vue'
	import {songDetail,songSimi,songComont,songLyric,songUrl} from '../../common/api.js'
	export default {
		data() {
			return {
				isLoading:true,
				songDetail:{
					al:{
						picUrl:''
					}
				},
				songSimi:[],           //相似歌曲
				authorsName:[],         //歌曲名称
				songComont:[],         //歌曲评论
				songLyric:[],          //歌曲歌词
				lyricIndex:0,          //当前歌词行
				songUrl:'',            //歌曲地址
				iconPlay:'iconpause',  //播放图标
				isPlayRotate:true     ,//是否旋转
				timeID:''              ,//定时器
				flag:true               ,//节流函数标识
				scrollTop:0              //表示窗口滚动
			}
		},
		components:{
			musichead,
			easyLoadimage
		},
		methods: {
			// 获取歌曲信息，同时进行节流处理，防止多次触发
			getSongDetail(id){
				this.debounce(function(){
					this.$store.commit('NEXT_ID',id)
					
					uni.showLoading({
						title:'加载中...',
						icon:'loading'
					})
					this.isLoading=true
					
					Promise.all([songDetail(id),songSimi(id),songComont(id),songLyric(id),songUrl(id)]).then((res)=>{
						// console.log(res);
						// 获取歌曲详情
						if(res[0][1].statusCode===200) {
							this.songDetail=res[0][1].data.songs[0]
						}
						// 获取相似歌曲
						if(res[1][1].statusCode===200) {
							this.songSimi=res[1][1].data.songs
							for(let j=0;j<this.songSimi.length;j++){
								let authors=this.songSimi[j].artists
								// 调用vuex共享方法
								this.$store.commit('JOIN_AUTHORNAME',authors)
								this.authorsName[j]=this.$store.state.authorsName
							}
						}
						// 获取歌曲评论列表
						if(res[2][1].statusCode===200) {
							if(res[2][1].data.hotComments.length>10){
								res[2][1].data.hotComments.length=10
							}
							this.songComont=res[2][1].data.hotComments
							// console.log(this.songComont);
						}
						// 获取歌曲歌词
						if(res[3][1].statusCode===200) {
							let lyric=res[3][1].data.lrc.lyric
							// this.songLyric=this.songLyric.split('\n')
							let re=/\[([^\]]+)\]([^\n]+)/g
							var result=[]
							lyric.replace(re,($0,$1,$2)=>{
								result.push({"time":this.formatTimeToSec($1),"lyric":$2})
							})
							// console.log(result);
							this.songLyric=result
						}
						// 获取歌曲url地址
						if(res[4][1].statusCode===200&&res[4][1].data.data[0].url) {
							this.songUrl=res[4][1].data
							// 实现小程序播放音乐
							// #ifdef APP||APP-PLUS||MP-WEIXIN
							let bgAudioManager = uni.getBackgroundAudioManager()
							this.bgAudioManager=bgAudioManager
							this.bgAudioManager.title = this.songDetail.name
							this.listenLyricIndex()
							// #endif
							
							// #ifdef H5
							if(!this.bgAudioManager){
								this.bgAudioManager = uni.createInnerAudioContext();
							}
							this.iconPlay='iconbofang1'
							this.isPlayRotate=false 
							// this.bgAudioManager.autoplay=true
							// #endif
					
							this.bgAudioManager.src = this.songUrl.data[0].url					
							// 监听播放状态
							this.bgAudioManager.onPlay(()=>{
								this.iconPlay='iconpause'
								this.isPlayRotate=true 
								this.listenLyricIndex()
							})
							// 监听暂停状态
							this.bgAudioManager.onPause(()=>{
								this.iconPlay='iconbofang1'
								this.isPlayRotate=false 
								this.clearLyricIndex()
							})
							// 播放结束时,自动跳转到下一首歌
							this.bgAudioManager.onEnded(()=>{
								if(this.$store.state.nextId){
									this.getSongDetail(this.$store.state.nextId)
								}
							})
						}else if(!res[4][1].data.data[0].url){
							// 当搜索不出来时，即为vip歌曲
							if(!this.bgAudioManager){
								this.iconPlay='iconbofang1'
								this.isPlayRotate=false 
								uni.showToast({
									title: '该歌曲需要VIP，请转移至APP内查看',
									duration: 2000,
									icon:'none'
								});
							}
						}
					})
					this.isLoading=false
					uni.hideLoading()
					// console.log(11);
				},1000)
			},
			// 将时间转换为秒数
			formatTimeToSec(value){
				let arr=value.split(':')
				return (parseFloat(arr[0]*60)+parseFloat(arr[1])).toFixed(1)
			},
			// 控制播放状态,继续防抖操作，即执行最后一次
			handleToPlay(){
				this.debounce(function(){
					if(this.bgAudioManager){
						if(this.bgAudioManager.paused){
							this.bgAudioManager.play()
						}else{
							this.bgAudioManager.pause()
						}
					}
				},500)
			},
			// 节流函数：频繁触发事件时，限制触发次数
			throttle(fn,delay){
				if(this.flag){
					setTimeout(()=>{
						fn.call(this)
						this.flag=true
					},delay)
				}
				this.flag=false
			},
			// 防抖函数：多次触发，只执行最后一次
			debounce(fn,delay){
				if(this.timeID) {
					clearTimeout(this.timeID)
				}
				this.timeID=setTimeout(()=>{
					fn.call(this)
				},delay)
			},
			// 监听歌词播放,底层原理为定时器
			listenLyricIndex(){
				clearInterval(this.timer)
				this.timer=setInterval(()=>{
					for(let i=0;i<this.songLyric.length;i++){
						if(this.bgAudioManager.currentTime>=this.songLyric[this.songLyric.length-1].time){
							this.lyricIndex=this.songLyric.length-1
							break
						}
						if(this.bgAudioManager.currentTime>=this.songLyric[i].time&&
						this.bgAudioManager.currentTime<this.songLyric[i+1].time){
							this.lyricIndex=i
						}
					}
					// console.log(this.lyricIndex);
				},500)
			},
			// 清除定时器
			clearLyricIndex(){
				clearInterval(this.timer)
			},
			// 刷新数据，跳转到相似歌曲
			handleToSimi(id){
				this.getSongDetail(id)	
			},
			// 滚动时触发的事件
			onPageScroll(scrollTop){
				this.scrollTop=scrollTop
			}
		},
		onLoad(option) {
			// console.log(option.singId);
			this.getSongDetail(option.singId)
		},
		onUnload() {
			this.clearLyricIndex()
			// 解决H5退出后仍在播放的问题
			// #ifdef H5
			if(this.bgAudioManager){
				this.bgAudioManager.destroy()
			}
			// #endif
		},
		onHide() {
			this.clearLyricIndex()
			// #ifdef H5
			if(this.bgAudioManager){
				this.bgAudioManager.destroy()
			}
			// #endif
		}
	}
</script>

<style lang="scss" scoped>
	// 加动画旋转效果
	@keyframes move {
		from{transform: rotate(0deg);}
		to{transform: rotate(360deg);}
	}
	.detai-container{
		// 音乐磁盘区域
		.detai-play{
			width:580rpx;
			height: 580rpx;
			background: url(~@/static/disc.png);
			background-size: cover;
			margin: 214rpx auto 0 auto;
			position: relative;
			.detai-play-img{
				width: 370rpx;
				height: 370rpx;
				border-radius: 50%;
				// 相对于父容器居中对齐
				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				margin: auto;
				animation: 10s linear move infinite;
				animation-play-state: paused;
			}
			.detai-play-run{
				animation-play-state: running;
			}
			.detai-play-icon{
				width: 100rpx;
				height: 100rpx;
				font-size: 100rpx;
				color: white;
				// 相对于父容器居中对齐
				position: absolute;
				left: 0;
				right: 0;
				top: 0;
				bottom: 0;
				margin: auto;
			}
			.needle{
				width: 230rpx;
				height: 360rpx;
				background: url(~@/static/needle.png);
				background-size: cover;
				// z-index: 999;
				// 相对于父容器居中对齐
				position: absolute;
				left: 130rpx;
				right: 0;
				top: -680rpx;
				bottom: 0;
				margin: auto;
			}
		}
		// 歌词区域
		.detai-lyric{
			font-size: 30rpx;
			line-height: 82rpx;
			height: 246rpx;
			text-align: center;
			overflow: hidden;
			color: #868688;
			.detai-lyric-warp{
				transform: .5s;
				.detai-lyric-item{
					height: 82rpx;
					// 超出文字显示省略号
					width: 95%;
					margin: 0 auto;
					text-overflow:ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp:1;
					overflow: hidden;
				}
				.active{
					color: white;
				}
			}
		}
		// 推荐歌曲区域
		.detai-like{
			margin:0 30rpx;
			.detail-like-head{
				font-size: 36rpx;
				color: white;
				margin: 50rpx 0;
				letter-spacing: 5rpx;
			}
			.detai-like-item{
				display: flex;
				// padding: 0 32rpx 46rpx 0;
				align-items: center;
				margin-bottom: 28rpx;
				// color: #e0e0e0;
				.detai-like-img{
					width: 82rpx;
					height: 82rpx;
					border-radius: 20rpx;
					margin-right: 20rpx;
					flex-shrink: 0;
					image{
						width: 100%;
						height: 100%;
					}
				}
				.detai-like-song{
					width: 530rpx;
					view:nth-child(1){
						color: white;	
						font-size: 28rpx;
						width: 500rpx;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					view:nth-child(2){
						display: flex;
						align-items: center;
						padding-right: 18rpx;
						image{
							width: 32rpx;
							height: 20rpx;
							margin-right: 10rpx;
							// 使其不被挤压
							flex-shrink: 0;
						}
						text{
							font-size: 20rpx;
							// 超出文字显示省略号
							text-overflow:ellipsis;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp:1;
							overflow: hidden;
							color: #e3e3e3;
						}
					}
				}
				text{
					font-size: 65rpx;
					flex:1;
					color: #c7c7c7;
				}
			}
		}
		// 歌曲评论区域
		.detail-comment{
			margin:50rpx 30rpx;
			overflow: hidden;
			.detail-comment-head{
				font-size: 36rpx;
				color: white;
				margin: 50rpx 0;
				letter-spacing: 5rpx;
			}
			.detail-comment-item{
				margin: 28rpx 0;
				display: flex;
				.detail-comment-img{
					width: 64rpx;
					height: 64rpx;
					border-radius: 50%;
					overflow: hidden;
					margin-right: 18rpx;
					.detail-comment-imgNow{
						width: 100%;
						height: 100%;
					}
				}
				.detail-comment-content{
					flex: 1;
					color: #e3e3e3;
					// color: pink;
					.detail-comment-title{
						display: flex;
						justify-content: space-between;
						.detail-comment-Info{
							.detail-comment-name{
								font-size: 26rpx;
								// color: #a5a4a9;
							}
							.detail-comment-data{
								font-size: 20rpx;
								color: #7c7c7e;
							}
						}
						.detail-comment-like{
							font-size: 28rpx;
							.iconlike{
								margin-left: 20rpx;
							}
						}
					}
					.detail-comment-text{
						font-size: 28rpx;
						line-height: 40rpx;
						color: white;
						// margin-top: 20rpx;
						margin: 20rpx 20rpx 0 0 ;
						border-bottom: 1rpx #4d4b54 solid;
						padding-bottom: 40rpx;
						
					}
				}
			}
			// 查看更多
			.detail-more{
				margin: 0 auto;
				margin-bottom: 60rpx;
				width: 90%;
				height: 70rpx;
				color: white;
				font-size: 28rpx;
				text-align: center;
				line-height: 70rpx;
				border-radius: 35rpx;
				background-color: rgba(0, 0, 0, 0.2);
			}
		}

	}
</style>
