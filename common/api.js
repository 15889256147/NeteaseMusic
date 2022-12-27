import {baseUrl} from './config.js'

// 获取排行榜列表
export function topList(){
	return new Promise(function(resolve,reject){
		uni.request({
			url: `${baseUrl}/toplist/detail`,
			method: 'GET',
			data: {},
			success: res => {
				resolve(res)
			},
			fail: () => {},
			complete: () => {}
		});
	})
}

// 获取排行榜歌单列表
export function list(listId){
	// 返回值为promise
	return uni.request({
		url:`${baseUrl}/playlist/detail?id=`+listId,
		method:'GET'
	})
}

// 获取歌曲详情http://127.0.0.1:3000/song/detail?ids=1918576268
export function songDetail(songId){
	// 返回值为promise
	return uni.request({
		url:`${baseUrl}/song/detail?ids=`+songId,
		method:'GET'
	})
}

// 获取类似歌曲http://127.0.0.1:3000/simi/song?id=1918576268
export function songSimi(songId){
	// 返回值为promise
	return uni.request({
		url:`${baseUrl}/simi/song?id=`+songId,
		method:'GET'
	})
}

// 获取歌曲评论 http://127.0.0.1:3000/comment/music?id=1918576268
export function songComont(songId){
	// 返回值为promise
	return uni.request({
		url:`${baseUrl}/comment/music?id=`+songId,
		method:'GET'
	})
}

// 获取歌词 http://127.0.0.1:3000/lyric?id=1918576268
export function songLyric(songId){
	// 返回值为promise
	return uni.request({
		url:`${baseUrl}/lyric?id=`+songId,
		method:'GET'
	})
}

// 获取音乐url地址http://127.0.0.1:3000/song/url?id=1918576268
export function songUrl(songId){
	// 返回值为promise
	return uni.request({
		url:`${baseUrl}/song/url?id=`+songId,
		method:'GET'
	})
}

// 获取热搜榜关键词详情 http://localhost:3000/search/hot/detail
export function searchHot(){
	return uni.request({
		url:`${baseUrl}/search/hot/detail`,
		method:'GET'
	})
}

// 获取某一个关键词的详情 http://localhost:3000/search?keywords=世界杯主题曲
export function searchWord(word){
	return uni.request({
		url:`${baseUrl}/search?keywords=`+word,
		method:'GET'
	})
}


// 获取搜索建议 http://localhost:3000/search/suggest?keywords=世界杯主题曲&type=mobile，如果传 'mobile' 则返回移动端数据
export function searchSuggest(word){
	return uni.request({
		url:`${baseUrl}/search/suggest?keywords=`+word+'&type=mobile',
		method:'GET'
	})
}
