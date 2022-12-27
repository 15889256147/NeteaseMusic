<script>
	export default {
		onLaunch: function() {
			
		},
		onShow: function() {
			
		},
		onHide: function() {
			
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	.container{
		position: fixed;
		top: 75px;
		width: 101%;
		// calc函数内“-”号前后必须要有空格，否则失效
		height: calc(100% - 75px);
		overflow: hidden;
			scroll-view{
				height: 100%;
			}
		
	}
	.figbg{
		width: 100%;
		height: 100%;
		position: fixed;
		right: 0;
		top: 0;
		background-size: cover;
		// background-position:center 0;
		background-attachment: fixed;
		// 模糊效果
		filter: blur(20px) brightness(95%);
		// 将容器缩放，防止显示白边
		transform: scale(1.5);
		// mix-blend-mode: darken; 
		// mix-blend-mode: blue;
		
	}
</style>
