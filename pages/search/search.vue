<template>
	<view>
		<musichead title="搜索" :icon="true" :iconblank="true">
			<template v-slot:content_list>
				<view class="search-container">
					<!-- 搜索栏板块 -->
					<view class="search-search">
						<text class="iconfont iconsearch"></text>
						<input class="search-search-input" type="text" placeholder="搜索歌曲" v-model.trim="searchInputWord" @confirm="searchWord(searchInputWord)" @input="handleToSuggest"></input>
						<text v-show="searchType!==1" class="iconfont iconguanbi" @tap="handleToClose"></text>
					</view>
					
					<!-- 搜索热词排行榜 -->
					<block v-if="searchType==1">
						<view class="search-all">
							<!-- 历史记录 利用本地存储功能实现 @comfirm表当用户按下回车时实现 -->
							<view class="search-history">
								<view class="search-history-head">
									<text>历史记录</text>
									<text class="iconfont iconlajitong" @tap="clearHistory"></text>
								</view>
								<view class="search-history-list">
									<view class="search-history-item" v-for="(item,index) in searchHistory" :key="index" @tap="handlesearchInputWord(item)">{{item}}</view>
								</view>
							</view>
							<!-- 热搜榜 -->
							<view class="search-hot">
								<view class="search-hot-head">热搜榜</view>
									<!-- 热搜关键词 -->
									<view class="search-hot-item" v-for="(item,index) in searchHot" :key="index" @tap="handlesearchInputWord(item.searchWord)">
										<view class="search-hot-top">{{index+1}}</view>
										<view class="search-hot-word">
											<view class="search-hot-wordTitle">
												<text class="search-hot-wordText">{{item.searchWord}}</text>
												<image class="search-hot-wordImg" :src="item.iconUrl||''" mode=""></image>
											</view>
											<view class="search-hot-content">	
												<text class="search-hot-contentText">{{item.content}}</text>
											</view>
										</view>
										<text class="search-hot-count">{{item.score}}</text>
									</view>
							</view>
						</view>
					</block>
					
					<!-- 搜索关键词列表 -->
					<block v-else-if="searchType==2">
						<view class="search-result">
							<!-- 歌曲歌单 -->
							<view class="search-result-item" v-for="(item,index) in searchList" :key="index" @tap="handleToDetail(item.id)">
								<view class="search-result-word">
									<view class="">{{item.name}}</view>
									<view class="">
										<image v-show="item.fee==1" src="../../static/vip.png" mode=""></image>
										<image v-show="item.album.copyrightId==7003||item.album.copyrightId==5003" src="../../static/sq.png" mode=""></image>
										<text>{{authorsName[index]}}- {{item.album.name}}</text>
									</view>
								</view>
								<text class="iconfont iconbofang"></text>
							</view>
							
						</view>
					</block>
					
					<!-- 搜索关键词提示 -->
					<block v-else-if="searchType==3">
						<view class="search-suggest">
							<view class="search-suggest-head">搜索“{{searchInputWord}}”</view>
							<view class="search-suggest-item" v-for="(item,index) in searchSuggest" :key="index" @tap="handlesearchInputWord(item.keyword)">
								<text class="iconfont iconsearch"></text>
								<text class="search-suggest-word" >{{item.keyword}}</text>
							</view>
							
						</view>
					</block>
					
					<!-- 暂无搜索到的数据 -->
					<block v-else-if="searchType==4">
						<view class="search-noresult">
							抱歉~暂无数据
						</view>
					</block>
					
				</view>
			</template>
		</musichead>
	</view>
</template>

<script>
	import musichead from '../../components/musichead/musichead.vue'
	import {searchHot,searchWord,searchSuggest} from '../../common/api.js'
	export default {
		data() {
			return {
				searchHot:[],
				searchInputWord:'',
				searchHistory:[],
				searchType:1,
				searchList:[],
				searchSuggest:[],
				authorsName:[]
			}
		},
		components:{
			musichead
		},
		methods: {
			// 输入框获取文本
			handlesearchInputWord(word){
				this.searchInputWord=word
				this.searchWord(word)
			},
			// 查找关键词
			searchWord(word){
				this.searchHistory.unshift(word)
				this.searchHistory=[...new Set(this.searchHistory)]
				uni.setStorage({
					key: 'searchHistory',
					data: this.searchHistory,
				});
				this.getSearchList(word)
			},
			// 清空本地缓存历史记录
			clearHistory(){
				uni.removeStorage({
					key: 'searchHistory',
				});
				this.searchHistory=[]
			},
			// 获取搜索关键词的列表
			getSearchList(word){
				searchWord(word).then((res)=>{
					if(res[1].statusCode==200){
						this.searchList=res[1].data.result.songs
						this.searchType=2
						if(this.searchList){
							for(let j=0;j<this.searchList.length;j++){
								let authors=this.searchList[j].artists
								let authorsName=authors[0].name
								// 调用共享vuex拼接作者名称方法
								this.$store.commit('JOIN_AUTHORNAME',authors)
								this.authorsName[j]=this.$store.state.authorsName
							}
						}else{
							this.searchType=4
						}
						
					}
				})
			},
			// 关闭搜索详情页，回到排行榜
			handleToClose(){
				this.searchInputWord=''
				this.searchType=1
			},
			// 跳转至歌曲详情页
			handleToDetail(id){
				uni.navigateTo({
					url:'/pages/detail/detail?singId='+id
				})
			},
			// 获取搜索框正在搜索的词汇
			handleToSuggest(event){
				let value=event.detail.value
				// 若输入框为空,则显示热词排行榜页面
				if(!value){
					this.searchType=1
					return
				}
				searchSuggest(value).then((res)=>{
					if(res[1].statusCode==200){
						this.searchSuggest=res[1].data.result.allMatch
						this.searchType=3
					}
				})
			}
		},
		onLoad() {
			// 获取搜索排行榜
			searchHot().then((res)=>{
				if(res[1].statusCode==200){
					this.searchHot=res[1].data.data
				}
			}),
			// 获取本地键值
			uni.getStorage({
				key: 'searchHistory',
				success: (res)=>{
					this.searchHistory=res.data
				},
				
			});

		}
	}
</script>

<style lang="scss" scoped>
	.search-container{
		// 搜索栏板块
		.search-search{
			display: flex;
			align-items: center;
			height: 60rpx;
			margin:70rpx 30rpx 20rpx 30rpx;
			background-color: #f5f5f5;
			border-radius: 50rpx;
			.iconsearch{
				font-size: 26rpx;
				margin-right: 26rpx;
				margin-left: 28rpx;
			}
			.search-search-input{
				font-size: 28rpx;
				flex: 1;
			}
			.iconguanbi{
				font-size: 30rpx;
				margin-right: 30rpx;
			}
		}
		// 搜索热词排行榜
		.search-all{
			margin: 0 30rpx;
			.search-history{
				font-size: 26rpx;	
				.search-history-head{
					display: flex;
					justify-content: space-between;
					margin:36rpx 0 20rpx 0;
					.iconlajitong{
						color: #c1c1c1;
					}
				}
				.search-history-list{
					display: flex;
					flex-wrap: wrap;
					.search-history-item{
						padding: 16rpx 28rpx;
						border-radius: 40rpx;
						margin-right: 30rpx;
						margin-bottom: 30rpx;
						background: #f5f5f5;
					}
				}
			}
			.search-hot{
				border-radius: 50rpx 50rpx 0 0;
				margin-top: 30rpx;
				margin-bottom: 30rpx;
				font-size: 26rpx;
				.search-hot-head{
					height: 50rpx;
					align-items: center;
					padding: 30rpx 0 10rpx 0;
				}
				.search-hot-item{
					display: flex;
					margin-bottom: 32rpx;
					align-items: center;
					justify-content: space-between;
					color: #959595;
					.search-hot-top{
						width: 30rpx;
						text-align: center;
						margin: 25rpx;
						margin-left: 0;
						color: #fb2222;
						font-size: 28rpx;
					}
					.search-hot-word{
						// width: 600rpx;
						flex: 1;
						// align-items: center;
						.search-hot-wordTitle{
							width: 550rpx;
							.search-hot-wordText{
								color: black;
								font-size: 30rpx;
							}
							.search-hot-wordImg{
								width: 32rpx;
								height: 20rpx;
								margin-left: 10rpx;
								// 使其不被挤压
								flex-shrink: 0;
							}
						}
						.search-hot-content{
							align-items: center;
							padding-right: 18rpx;
							margin-top: 12rpx;
							.search-hot-contentText{
								font-size: 20rpx;
								// 超出文字显示省略号
								text-overflow:ellipsis;
								display: -webkit-box;
								-webkit-box-orient: vertical;
								-webkit-line-clamp:1;
								overflow: hidden;
							}
						}
					}
					.search-hot-count{
						// flex: 1;
						text-align: right;
						padding-right: 10rpx;
						color: #c7c7c7;
					}
				}
			}
		}
		// 搜索关键词列表
		.search-result{
			// border-top: 4rpx solid #e4e4e4;
			// margin-bottom: 50rpx;
			.search-result-item{
				display: flex;
				margin:0 30rpx;
				padding: 30rpx 0 20rpx 0;
				align-items: center;
				border-bottom: 2rpx solid #a3a3a3;
				.search-result-word{
					flex: 1;
					view:nth-child(1){
						// color: #235790;
						font-size: 28rpx;
						margin-bottom: 12rpx;
						margin-right: 20rpx;
						// 超出文字显示省略号
						text-overflow:ellipsis;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp:1;
						overflow: hidden;
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
							color: #898989;
							font-size: 22rpx;
							// 超出文字显示省略号
							text-overflow:ellipsis;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp:1;
							overflow: hidden;
						}
					}
				}
				text{
					font-size: 60rpx;
					color: #e3e3e3;
				}
			}
		}
		// 搜索关键词提示
		.search-suggest{
			border-top: 2rpx solid #e4e4e4;
			font-size: 26rpx;
			.search-suggest-head{
				padding: 30rpx;
				color: #4574a5;
				// padding-bottom: 0;
			}
			.search-suggest-item{
				padding: 30rpx;
				.iconsearch{
					margin-right:20rpx;
					color: #bdbdbd;
					font-size: 28rpx;
				}
				.search-suggest-word{
					color: #5d5d5d;
				}
			}
		}
		.search-noresult{
			margin: 35rpx;
			font-size: 30rpx;
		}
	}
</style>
